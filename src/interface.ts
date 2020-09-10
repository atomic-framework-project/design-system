export type OutputFormat = 'css' | 'scss';
export type TemplateFormat = '.twig' | '.vue';

export type DesignSystemPreprocessFunction = (self: object) => any;
export type DesignSystemProcessFunction = (prefix: string, params: any, output?: string) => DesignSystemDirectives;

export interface DesignSystemFeatureParams {
  files: DesignSystemFeatureParamsFiles;
  params: object;
  desc?: string;
  preprocess?: DesignSystemPreprocessFunction;
  process?: DesignSystemProcessFunction;
  template?: string;
}

export interface DesignSystemFeatureParamsFiles {
  params: string;
  desc?: string;
  preprocess?: string;
  process?: string;
  template?: string;
  icons?: string[];
}

/**
 * Object returned by any conversion process function
 */
export interface DesignSystemDirectives {
  bypassMap?: boolean,
  fonts?: {[key: string]: DesignSystemDirectivesFont};
  cssVars?: {[key: string]: string};
  sassPlaceholders: {[key: string]: DesignSystemDirectivesPlaceholders};
}

export interface DesignSystemDirectivesFont {
  '@import'?: string
  file?: string;
  css?: {[key: string]: any};
}

export interface DesignSystemDirectivesPlaceholders {
  /**
   * SASS doc lines (will be prefixed by "/// ")
   */
  sassdoc?: {
    [key: string]: string;
  };
  /**
   * CSS rules
   */
  css?: {
    /**
     * SASS placeholder extend directive
     */
    '@extend'?: string[];
    /**
     * CSS property: value
     */
    [key: string]: any;
  };
  /**
   * CSS within media queries
   */
  responsive?: {
    /**
     * Breakpoint semantic name: config
     */
    [key: string]: {
      /**
       * CSS property: value
       */
      [key: string]: any;
    }
  };
}
