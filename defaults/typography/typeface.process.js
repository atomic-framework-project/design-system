const path = require('path');
const fs = require('fs');

exports.default = (prefix, params) => {

  // Placeholders
  const designSystemDirectives = {
    bypassMap: true,
    fonts: {},
    cssVars: {},
    sassPlaceholders: {},
  };

  for (const [fontname, font] of Object.entries(params)) {
    for (const [variantName, variant] of Object.entries(font.fonts)) {

      const namespaceVariantSuffix = `${fontname}-${variantName}`;
      const namespaceVariant = `${prefix}-${namespaceVariantSuffix}`;
      const fontBaseFontFace = {
        'font-weight': variant['font-weight'],
        'font-style': variant['font-style'],
      };

      designSystemDirectives.sassPlaceholders[`%${namespaceVariant}`] = {
        sassdoc: {
          '@name': `${prefix}-${font}`,
        },
        css: {
          ...fontBaseFontFace,
          ...variant.css,
          'font-family': font['_font-family'],
          'font-kerning': ['normal'],
          '-webkit-font-smoothing': ['antialiased'],
          '-moz-osx-font-smoothing': ['grayscale'],
        }
      };

      const fontPath = path.join(__dirname, variant._file);
      // Test for local file @todo: Replace for a search on "http(s)" protocol or "//" url ?
      if(fs.existsSync(fontPath)) {
        // @font-face case
        designSystemDirectives.fonts[namespaceVariantSuffix] = {
          'file': fontPath,
          css: {
            'font-family': `"${font['font-face-family']}"`,
            'font-display': font['font-display'],
            ...fontBaseFontFace,
            ...variant.css,
          }
        };
      }
      else {
        // @import case
        designSystemDirectives.fonts[namespaceVariantSuffix] = {
          '@import': variant._file,
        };
      }

      for (const [breakpoint, responsive] of Object.entries(font.responsive)) {
        for (const [suffix, value] of Object.entries(responsive['font-sizes'])) {

          const namespaceFontSize = `${prefix}-${fontname}-${suffix}`;

          // If key doesn't exists yet
          if (typeof designSystemDirectives.sassPlaceholders[`%${namespaceFontSize}`] === 'undefined') {

            // Init Placeholder
            designSystemDirectives.sassPlaceholders[`%${namespaceFontSize}`] = {
              sassdoc: {
                '@name': `${namespaceFontSize}`,
              },
              css: {
                '@extend': [`%${namespaceVariant}`],
              },
              responsive: {},
            };
          }

          designSystemDirectives.sassPlaceholders[`%${namespaceFontSize}`].responsive[breakpoint] = {
            'font-size': value,
          }
        }
      }
    }
  }

  return designSystemDirectives;
}
