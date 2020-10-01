import {
  TemplateFormat,
  DesignSystemFeatureParams,
  DesignSystemPreprocessFunction,
  DesignSystemProcessFunction,
  DesignSystemFilterFunction,
} from './interface';
import { DesignSystemFeature } from './design-system-feature';
import { format as prettierFormat } from 'prettier';
import { writeFileSync, readFileSync, existsSync, ensureDirSync } from 'fs-extra';
import { resolve, basename, dirname, sep, join, relative } from 'path';
import { find } from 'globule';
import lodashMerge from 'lodash/merge';

export class DesignSystem {
  private readonly defaults: string = resolve(process.cwd(), resolve(__dirname, './../defaults'));
  private readonly iconExtension = '.svg';
  private readonly templateExtension: TemplateFormat;
  private readonly aliasFormat: string | undefined;

  private features: { [key: string]: DesignSystemFeature } = {};

  private static outputMsg = 'File automatically generated by Atomic Framework Design System engine';

  public entry: string;
  public output: string;

  public fonts: string = '';
  public cssVars: string = '';
  public sassMaps: string = '';
  public sassPlaceholders: string = '';

  public static featureExtension = '.json';
  public static descExtension = '.md';
  public static preprocessExtension = '.preprocess.js';
  public static processExtension = '.process.js';

  constructor(entry: string, output: string, templateType: TemplateFormat, aliases?: string) {
    this.entry = resolve(process.cwd(), entry);
    this.output = resolve(process.cwd(), output);
    this.templateExtension = templateType;
    if (typeof aliases === 'string') {
      this.aliasFormat = aliases;
    }

    if (!existsSync(this.entry)) {
      console.log(`Entry Design System folder doesn't exists`);
      process.exit(1);
    }
  }

  public async setup(): Promise<void> {
    await this.exploreFolder(this.defaults);
    if (this.entry !== this.defaults) {
      await this.exploreFolder(this.entry);
    }

    this.fonts = this.getFonts();
    this.cssVars = this.getCssVars();
    this.sassMaps = this.getSassMaps();
    this.sassPlaceholders = this.getSassPlaceholders();
  }

  public async exploreFolder(entry: string = this.entry) {
    const features = find(`**/*${DesignSystem.featureExtension}`, { srcBase: entry, prefixBase: true });

    for (const feature of features) {
      const name = basename(feature, DesignSystem.featureExtension);
      const featureParams = await import(feature);
      const params: DesignSystemFeatureParams = {
        dirname: dirname(feature),
        files: {
          params: feature,
        },
        // Get Design System Features params
        params: featureParams.default,
      };

      // Search for a Readme file
      const descPath = `${dirname(feature)}${sep}${name}${DesignSystem.descExtension}`;
      if (existsSync(descPath)) {
        params.files.desc = descPath;
        params.desc = readFileSync(descPath, { encoding: 'utf-8' });
      }

      // Search for a Process function file
      const preprocessPath = `${dirname(feature)}${sep}${name}${DesignSystem.preprocessExtension}`;
      if (existsSync(preprocessPath)) {
        params.files.preprocess = preprocessPath;
        const preprocess = await import(preprocessPath);
        params.preprocess = preprocess.default.default as DesignSystemPreprocessFunction;
      }

      // Search for a Process function file
      const processPath = `${dirname(feature)}${sep}${name}${DesignSystem.processExtension}`;
      if (existsSync(processPath)) {
        params.files.process = processPath;
        const process = await import(processPath);
        params.process = process.default.default as DesignSystemProcessFunction;
      }

      // Search for a Template file
      const templatePath = `${dirname(feature)}${sep}${name}${this.templateExtension}`;
      if (existsSync(templatePath)) {
        params.files.template = templatePath;
        params.template = readFileSync(templatePath, { encoding: 'utf-8' });
      }

      // Search for an Icons folder
      const iconsPath = join(dirname(feature), name);
      if (existsSync(iconsPath)) {
        params.files.icons = find(`${iconsPath}${sep}*${this.iconExtension}`);
      }

      await this.setFeature(name, params);
    }
  }

  public getFeatures(): { [key: string]: DesignSystemFeature } {
    return this.features;
  }

  public getFeature(name: string): DesignSystemFeature | null {
    if (typeof this.features[name] !== 'undefined') {
      return this.features[name];
    } else {
      console.log(`There is no "${name}" feature in your Design System`);
      return null;
    }
  }

  public async setFeature(namespace: string, config: DesignSystemFeatureParams): Promise<void> {
    if (typeof this.features[namespace] !== 'undefined') {
      // Clearing feature old params and old directives
      this.features[namespace].clearParams();
      this.features[namespace].clearDirectives();

      // Merging all other params
      const mergedConfig = lodashMerge(this.features[namespace].getConfig(), config);

      await this.features[namespace].setConfig(mergedConfig);

      console.log(`Feature "${namespace}" overrides default ${namespace}`);
    } else {
      this.features[namespace] = new DesignSystemFeature(namespace, config, this.output, this.aliasFormat);
    }
  }

  public deleteFeature(namespace: string) {
    if (typeof this.features[namespace] !== 'undefined') {
      delete this.features[namespace];
      console.log(`Feature "${namespace}" deleted`);
    } else {
      console.log(`There is no "${namespace}" feature in your Design System`);
    }
  }

  public getFonts(): string {
    let output = '';
    for (const [namespace, feature] of Object.entries(this.features)) {
      output += feature.exportFonts(this.aliasFormat);
    }

    return output;
  }

  public getCssVars(): string {
    let output = '';
    for (const [namespace, feature] of Object.entries(this.features)) {
      output += feature.exportCssVars();
    }

    return output;
  }

  public getSassMaps(): string {
    let output = '';
    for (const [namespace, feature] of Object.entries(this.features)) {
      output += feature.exportSassMap();
    }

    return output;
  }

  public getSassPlaceholders(): string {
    let output = '';
    for (const [namespace, feature] of Object.entries(this.features)) {
      output += feature.exportSassPlaceholders();
    }

    return output;
  }

  public writeFiles(filter?: DesignSystemFilterFunction): void {
    this.writeCssFile(this.output, filter);
    this.writeSassFile(this.output, filter);
  }

  public writeCssFile(output: string = this.output, filter?: DesignSystemFilterFunction): void {
    let source = `
      /* ${DesignSystem.outputMsg} */
    
      :root {
        ${this.cssVars}
      }
    `;

    if (typeof filter === 'function') {
      source = filter('css', source);
    }

    ensureDirSync(this.output);
    writeFileSync(`${output}${sep}design-system.css`, prettierFormat(source, { parser: 'css' }), { encoding: 'utf-8' });
  }

  public writeSassFile(output: string = this.output, filter?: DesignSystemFilterFunction): void {
    let source = `
      // ${DesignSystem.outputMsg}
      
      :root {
        ${this.cssVars}
      }
      
      ${this.fonts}
      
      /// Define @content from a specific semantic breakpoint
      /// @name breakpoint
      /// @group Core
      /// @param {string} $device Semantic breakpoint name string
      /// @param {map} $breakpointsSystem [$design-system-breakpoints] Sass map with semantic breakpoints names associated with their values
      
      @mixin breakpoint($device, $breakpoints-system:$DS-breakpoints) {
      
        @if map-has-key($breakpoints-system, $device) {
          @media (min-width: #{map-get($breakpoints-system, $device)}px) {
      
            @content;
          }
        }
        @else {
      
          @content;
        }
      }
      
      /// Define @content from a specific breakpoint
      /// @name tweakpoint
      /// @group Core
      /// @param {number} point Breakpoint value
      
      @mixin tweakpoint($point) {
      
        @media (min-width: $point) {
          @content;
        }
      }
      
      /// Retrieve any value from a Design System map
      /// @name get-DS
      /// @group Core
      /// @param {map} $map Design system map targeted
      /// @param {list} $keys List of map keys tree to the value
      /// @example scss - Usage
      /// .foo {
      ///   right: #{get-DS($DS-spacing, 'block' 'std')}px;
      /// }
      /// @example css - Output
      /// .foo {
      ///   right: 16px;
      /// }
      
      @function get-DS($map, $keys) {
        @each $key in $keys {
          @if map-has-key($map, $key) {
            $map: map-get($map, $key);
          }
        }
      
        @return $map;
      }
      
      ${this.sassMaps}
      
      ${this.sassPlaceholders}
    `;

    if (typeof filter === 'function') {
      source = filter('scss', source);
    }

    ensureDirSync(this.output);
    writeFileSync(`${output}${sep}design-system.scss`, prettierFormat(source, { parser: 'scss' }), {
      encoding: 'utf-8',
    });
  }
}
