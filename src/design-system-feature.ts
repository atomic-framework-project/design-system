import {
  DesignSystemFeatureParams,
  DesignSystemPreprocessFunction,
  DesignSystemProcessFunction,
  DesignSystemDirectives,
  DesignSystemFeatureParamsFiles,
  DesignSystemDirectivesPlaceholders
} from './interface';

export class DesignSystemFeature {

  public readonly _prefix = 'DS-';
  public readonly _sassDocGroupName = 'Design System';

  private readonly namespace: string;
  private readonly files: DesignSystemFeatureParamsFiles;
  private readonly desc: string | undefined = undefined;
  private readonly preprocess: DesignSystemPreprocessFunction | undefined = undefined;
  private readonly process: DesignSystemProcessFunction | undefined = undefined;
  private readonly template: string | undefined = undefined;

  private params: any;
  private directives: DesignSystemDirectives | undefined = undefined;

  constructor(namespace:string, params: DesignSystemFeatureParams) {

    this.namespace = `${this._prefix}${namespace}`;
    this.files = params.files;
    this.params = params.params;
    typeof params.desc === 'string' ? this.desc = params.desc : null;
    typeof params.preprocess === 'function' ? this.preprocess = params.preprocess : null;
    typeof params.process === 'function' ? this.process = params.process : null;
    typeof params.template === 'string' ? this.template = params.template : null;

    if(typeof this.preprocess === 'function'){
      this.params = {
        ...this.params,
        ...this.preprocess(this),
      };
    }

    if(typeof this.process === 'function'){
      this.directives = this.process(this.namespace, this.params);
    }
  }

  public getSassPlaceholders(): {[key: string]: DesignSystemDirectivesPlaceholders} | undefined {

    return this.directives?.sassPlaceholders;
  }

  public getCssVars(): {[key: string]: string} | undefined {

    return this.directives?.cssVars;
  }

  public exportCssVars(): string {

    let output = '';

    if(typeof this.directives?.cssVars !== 'undefined' && Object.keys(this.directives.cssVars).length) {

      output += `
      
        /* ${this.namespace} */
      `;
      for(const [varname, value] of Object.entries(this.directives.cssVars)){
        output += `--${varname}: ${DesignSystemFeature.cssPropertyConverter(value)};`;
      }
    }

    return output;
  }

  public exportSassMap(): string {

    let output = `
      $${this.namespace}: (
    `;

    // Recursively parse JSON datas
    const recursiveCall = (recursiveDatas: object) => {

      let recursiveOutput = '';

      if (typeof recursiveDatas === 'object') {

        for (const[key, item] of Object.entries(recursiveDatas)) {

          if(item !== null && typeof item !== 'undefined' && item.constructor === Object) {

            recursiveOutput += `
              '${key}': (
            `;
            recursiveOutput += recursiveCall(item);
            recursiveOutput += `
              ),
            `;
          }
          else {
            recursiveOutput += `
              '${key}': ${DesignSystemFeature.cssPropertyConverter(item)},
            `;
          }
        }
      }

      return recursiveOutput;
    };

    output += recursiveCall(this.params);

    output += `
      );
    `;

    return output;
  }

  public exportSassPlaceholders(): string {

    let output = '';

    if(typeof this.directives?.sassPlaceholders === 'object') {

      for (const[placeholderName, placeholder] of Object.entries(this.directives.sassPlaceholders)) {

        if(typeof placeholder.sassdoc !== 'undefined'){

          for (const[sassDocKey, sassDocValue] of Object.entries(placeholder.sassdoc)) {

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
              }
              else {
                output += `
                ///   ${prop}: ${value};`;
              }
            }
          }

          // SASS Doc Responsive content
          if (typeof placeholder.responsive === 'object') {

            for (const [breakpoint, css] of Object.entries(placeholder.responsive)) {

              if(breakpoint.substr((breakpoint.length - 'px'.length), breakpoint.length) === 'px') {
                output += `
                ///   @include tweakpoint(${breakpoint}) {`;
              }
              else {
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

            if (prop.startsWith('@')) {
              output += `
              @extend ${value};`;
            }
            else {
              output += `
              ${prop}: ${value};`;
            }
          }
        }

        // Responsive content
        if (typeof placeholder.responsive === 'object') {

          for (const [breakpoint, css] of Object.entries(placeholder.responsive)) {

            if(breakpoint.substr((breakpoint.length - 'px'.length), breakpoint.length) === 'px') {
              output += `
              @include tweakpoint(${breakpoint}) {`;
            }
            else {
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

  public getDirectives() {

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
}
