import {
  DesignSystemFeatureParams,
  DesignSystemPreprocessFunction,
  DesignSystemProcessFunction,
  DesignSystemDirectives,
  DesignSystemFeatureParamsFiles,
  DesignSystemDirectivesPlaceholders,
  DesignSystemDirectivesFont,
  DesignSystemAlias,
} from './interface';
import { basename, sep, relative } from 'path';
import { optimize } from 'svgo';

export class DesignSystemFeature {
  public readonly _prefix = 'DS-';
  public readonly _sassDocGroupName = 'Design System';
  public readonly aliasFormat?: string;

  private readonly output: string;
  private namespace: string;
  private dirname: string = '';
  private files: DesignSystemFeatureParamsFiles;
  private desc: string | undefined = undefined;
  private preprocess: DesignSystemPreprocessFunction = (): object => {
    return {};
  };
  private process: DesignSystemProcessFunction | undefined = undefined;
  private template: string | undefined = undefined;

  private params: any = {};
  private directives: DesignSystemDirectives = {};
  private alias?: DesignSystemAlias;

  constructor(namespace: string, params: DesignSystemFeatureParams, output: string, alias?: string) {
    this.output = output;
    this.namespace = `${this._prefix}${namespace}`;
    this.files = params.files;
    this.aliasFormat = alias;

    this.setConfig(params);
  }

  public async setup(): Promise<void> {
    if (typeof this.preprocess === 'function') {
      this.params = {
        ...this.params,
        ...(await this.preprocess(this)),
      };
    }

    if (typeof this.process === 'function') {
      this.directives = this.process(this.namespace, this.params, this.output, this.dirname, this);
    }
  }

  public getSassPlaceholders(): { [key: string]: DesignSystemDirectivesPlaceholders } | undefined {
    return this.directives?.sassPlaceholders;
  }

  public getCssVars(): { [key: string]: string } | undefined {
    return this.directives?.cssVars;
  }

  public getFonts(): { [key: string]: DesignSystemDirectivesFont } | undefined {
    return this.directives?.fonts;
  }

  public exportFonts(alias?: string): string {
    let output = '';

    if (typeof this.directives?.fonts !== 'undefined' && Object.keys(this.directives.fonts).length) {
      for (const [namespace, fontDirectives] of Object.entries(this.directives.fonts)) {
        if (typeof fontDirectives['@import'] === 'string') {
          output += `
            @import url(${fontDirectives['@import']});`;
        } else if (typeof fontDirectives.file === 'string') {
          output += `
          
            @font-face {
          `;

          if (typeof fontDirectives.css === 'object') {
            for (const [prop, value] of Object.entries(fontDirectives.css)) {
              output += `
                ${prop}: ${value};`;
            }
          }

          let url = fontDirectives.file;
          if (typeof this.aliasFormat === 'string' && typeof fontDirectives.path === 'string') {
            const aliasName = this.getAliasNamespace();
            this.setAlias(aliasName as string, relative(this.output, fontDirectives.path));
            url = `${aliasName}${sep}${basename(fontDirectives.file)}`;
          }
          output += `
              src: url(${url}) format("woff2");
            }
          `;
        }
      }
    }

    return output;
  }

  public getAliasNamespace(): string | undefined {
    if (typeof this.aliasFormat === 'string') {
      return this.aliasFormat.replace('{{namespace}}', this.namespace);
    } else {
      return undefined;
    }
  }

  public setAlias(name: string, path: string): void {
    this.alias = [name, path];
  }

  public getAlias(): DesignSystemAlias {
    return this.alias;
  }

  public exportCssVars(): string {
    let output = '';

    if (typeof this.directives?.cssVars !== 'undefined' && Object.keys(this.directives.cssVars).length) {
      output += `
      
        /* ${this.namespace} */
      `;
      for (const [varname, value] of Object.entries(this.directives.cssVars)) {
        output += `--${varname}: ${DesignSystemFeature.cssPropertyConverter(value)};`;
      }
    }

    return output;
  }

  public exportSassMap(): string {
    if (typeof this.directives?.bypassMap !== 'boolean' || !this.directives?.bypassMap) {
      let output = `
        $${this.namespace}: (
      `;

      // Recursively parse JSON datas
      const recursiveCall = (recursiveDatas: object) => {
        let recursiveOutput = '';

        if (typeof recursiveDatas === 'object') {
          for (const [key, item] of Object.entries(recursiveDatas)) {
            if (item !== null && typeof item !== 'undefined' && item.constructor === Object) {
              recursiveOutput += `
                '${key}': (
              `;
              recursiveOutput += recursiveCall(item);
              recursiveOutput += `
                ),
              `;
            } else {
              recursiveOutput += `
                '${key}': ${DesignSystemFeature.cssPropertyConverter(item)},
              `;
            }
          }
        }

        return recursiveOutput;
      };

      output += recursiveCall(DesignSystemFeature.filterObjectByKeyPrefix(this.params));

      output += `
        );
      `;

      return output;
    } else {
      return '';
    }
  }

  public exportSassPlaceholders(): string {
    let output = '';

    if (typeof this.directives?.sassPlaceholders === 'object') {
      for (const [placeholderName, placeholder] of Object.entries(this.directives.sassPlaceholders)) {
        if (typeof placeholder.sassdoc !== 'undefined') {
          for (const [sassDocKey, sassDocValue] of Object.entries(placeholder.sassdoc)) {
            // Sassdoc
            output += `
            /// ${sassDocKey} ${sassDocValue}`;
          }

          if (Object.keys(placeholder.sassdoc).length > 0) {
            // Sassdoc
            output += `
            /// @group ${this._sassDocGroupName}`;
          }

          // Sassdoc
          output += `
          /// @example scss - Usage
          /// .foo {
          ///   @extend ${placeholderName};
          /// }`;

          // Sassdoc
          output += `
          /// @example css - Output
          /// .foo {`;

          // SASS Doc CSS Properties
          if (typeof placeholder.css === 'object') {
            for (const [prop, value] of Object.entries(placeholder.css)) {
              if (prop.substr(0, 1) === '@') {
                output += `
                ///   @extend ${value};`;
              } else {
                output += `
                ///   ${prop}: ${value};`;
              }
            }
          }

          // SASS Doc Responsive content
          if (typeof placeholder.responsive === 'object') {
            for (const [breakpoint, css] of Object.entries(placeholder.responsive)) {
              if (breakpoint.substr(breakpoint.length - 'px'.length, breakpoint.length) === 'px') {
                output += `
                ///   @include tweakpoint(${breakpoint}) {`;
              } else {
                output += `
                ///   @include breakpoint('${breakpoint}') {`;
              }

              for (const [prop, value] of Object.entries(css)) {
                output += `
                ///     ${prop}: ${value};`;
              }

              output += `
              ///   }`;
            }
          }

          // Sassdoc
          output += `
            /// }
          `;
        }

        // SASS Placeholder
        output += `${placeholderName} {`;

        // CSS Properties
        if (typeof placeholder.css === 'object') {
          for (const [prop, value] of Object.entries(placeholder.css)) {
            if (prop === '@extend' && value.constructor === Array) {
              for (const extend of value) {
                output += `
                @extend ${extend};`;
              }
            } else {
              output += `
              ${prop}: ${value};`;
            }
          }
        }

        // Responsive content
        if (typeof placeholder.responsive === 'object') {
          for (const [breakpoint, css] of Object.entries(placeholder.responsive)) {
            if (breakpoint.substr(breakpoint.length - 'px'.length, breakpoint.length) === 'px') {
              output += `
              @include tweakpoint(${breakpoint}) {`;
            } else {
              output += `
              @include breakpoint('${breakpoint}') {`;
            }

            for (const [prop, value] of Object.entries(css)) {
              output += `
              ${prop}: ${value};`;
            }

            output += `
            }
          `;
          }
        }

        output += `
        }
      `;
      }
    }

    return output;
  }

  public clearDirectives(): void {
    this.directives = {};
  }

  public getDirectives(): DesignSystemDirectives {
    return this.directives;
  }

  public getNamespace() {
    return this.namespace;
  }

  public getFiles() {
    return this.files;
  }

  public getParams() {
    return this.params;
  }

  public getConfig(): DesignSystemFeatureParams {
    return {
      dirname: this.dirname,
      files: {
        params: this.files.params,
        desc: this.files.desc,
        preprocess: this.files.preprocess,
        process: this.files.process,
        template: this.files.template,
        icons: this.files.icons,
      },
      params: this.params,
      desc: this.desc,
      preprocess: this.preprocess,
      process: this.process,
      template: this.template,
    };
  }

  public async setConfig(params: DesignSystemFeatureParams): Promise<void> {
    this.dirname = params.dirname;
    this.files = params.files;
    this.params = params.params;
    typeof params.desc === 'string' ? (this.desc = params.desc) : (this.desc = undefined);
    if (typeof params.preprocess === 'function') {
      this.preprocess = params.preprocess;
    }
    if (typeof params.process === 'function') {
      this.process = params.process;
    }
    typeof params.template === 'string' ? (this.template = params.template) : (this.template = undefined);

    await this.setup();
  }

  public clearParams(): void {
    this.params = {};
  }

  public getDescription() {
    return this.desc;
  }

  public getTemplate() {
    return this.template;
  }

  public getPreprocess() {
    return this.preprocess;
  }

  public getProcess() {
    return this.process;
  }

  public async optimiseSvgPath(path: string): Promise<string> {
    const output = await optimize(path);
    return output.data;
  }

  public extractSvgSize(markup: any): { width: number; height: number } {
    let width = 0;
    let height = 0;

    const svgWidthAttr = /<svg[^>]*width="(\d+)(px)?"(.*)>/gi;
    if (svgWidthAttr.test(markup)) {
      markup.replace(svgWidthAttr, (match: string, result: string) => {
        width = Number.parseFloat(result);
        return result;
      });
    }
    const svgHeightAttr = /<svg[^>]*height="(\d+)(px)?"(.*)>/gi;
    if (svgHeightAttr.test(markup)) {
      markup.replace(svgHeightAttr, (match: string, result: string) => {
        height = Number.parseFloat(result);
        return result;
      });
    }
    const svgViewboxAttr = /<svg[^>]*viewbox="(([0-9 px])*)"(.*)>/gi;
    if (!width && !height && svgViewboxAttr.test(markup)) {
      markup.replace(svgViewboxAttr, (match: string, result: string) => {
        const coords = result.replace('px', '').split(' ');
        if (typeof coords[2] !== 'undefined') {
          width = Number.parseFloat(coords[2]);
        }
        if (typeof coords[3] !== 'undefined') {
          height = Number.parseFloat(coords[3]);
        }
        return result;
      });
    }

    return {
      width,
      height,
    };
  }

  private static cssPropertyConverter(property: any): string {
    let output = '';

    // Switch for different types
    switch (property !== null && typeof property !== 'undefined' && property.constructor) {
      case Array:
        for (const value of property) {
          output += `${value} `;
        }
        break;
      case Number:
        output += String(property);
        break;
      case String:
      default:
        output += property;
        break;
    }

    return output;
  }

  private static filterObjectByKeyPrefix = (params: object, prefix: string = '_'): any => {
    const output: any = {};
    for (let [key, data] of Object.entries(params)) {
      if (key.substr(0, prefix.length) !== prefix) {
        if (data !== null && typeof data !== 'undefined' && data.constructor === Object) {
          data = DesignSystemFeature.filterObjectByKeyPrefix(data, prefix);
        }
        output[key] = data;
      }
    }

    return output;
  };
}
