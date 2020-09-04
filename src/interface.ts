export type OutputFormat = 'css' | 'scss';
export type TemplateFormat = '.twig' | '.vue';

export type DesignSystemProcessFunction = (prefix: string, params: any) => DesignSystemDirectives;

export interface DesignSystemFeatureParams {
  files: DesignSystemFeatureParamsFiles;
  params: any;
  desc?: string;
  process?: DesignSystemProcessFunction;
  template?: string;
}

export interface DesignSystemFeatureParamsFiles {
  params: string;
  desc?: string;
  process?: string;
  template?: string;
}

/**
 * Object returned by any conversion process function
 */
export interface DesignSystemDirectives {
  cssVars: {[key: string]: string};
  sassPlaceholders: {[key: string]: DesignSystemDirectivesPlaceholders};
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
