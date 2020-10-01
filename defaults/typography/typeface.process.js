const path = require('path');
const fs = require('fs');

exports.default = (prefix, params, output, dirname) => {

  // Font sizes unit
  const unit = 'px';

  // Placeholders
  const designSystemDirectives = {
    bypassMap: true,
    fonts: {},
    cssVars: {},
    sassPlaceholders: {},
  };

  let index = 1;
  for (const [fontname, font] of Object.entries(params)) {
    for (const [variantName, variant] of Object.entries(font.fonts)) {

      designSystemDirectives.cssVars[`${prefix}-${index}-font-family`] = font['_font-family'];
      designSystemDirectives.cssVars[`${prefix}-${index}-font-weight`] = variant['font-weight'];
      designSystemDirectives.cssVars[`${prefix}-${index}-font-style`] = variant['font-style'];

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
          'font-kerning': font['font-kerning'],
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
        }
      };

      const fontPath = path.resolve(dirname, variant._file);
      // Test for local file @todo: Replace for a search on "http(s)" protocol or "//" url ?
      if(fs.existsSync(fontPath)) {
        // @font-face case
        designSystemDirectives.fonts[namespaceVariantSuffix] = {
          file: path.relative(output, fontPath),
          path: path.dirname(fontPath),
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

          const namespaceFontSize = `${namespaceVariant}-${suffix}`;
          const namespaceFontSizeHeading = `${namespaceVariant}-heading-${suffix}`;
          const namespaceFontSizeText = `${namespaceVariant}-text-${suffix}`;

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
          if (typeof designSystemDirectives.sassPlaceholders[`%${namespaceFontSizeHeading}`] === 'undefined') {

            // Init Placeholder
            designSystemDirectives.sassPlaceholders[`%${namespaceFontSizeHeading}`] = {
              sassdoc: {
                '@name': `${namespaceFontSize}`,
              },
              css: {
                '@extend': [`%${namespaceVariant}`],
              },
              responsive: {},
            };
          }
          if (typeof designSystemDirectives.sassPlaceholders[`%${namespaceFontSizeText}`] === 'undefined') {

            // Init Placeholder
            designSystemDirectives.sassPlaceholders[`%${namespaceFontSizeText}`] = {
              sassdoc: {
                '@name': `${namespaceFontSizeText}`,
              },
              css: {
                '@extend': [`%${namespaceVariant}`],
              },
              responsive: {},
            };
          }

          designSystemDirectives.sassPlaceholders[`%${namespaceFontSize}`].responsive[breakpoint] = {
            'font-size': `${value}${unit}`,
          };
          const fsTrigger = 80;
          const reduction = ((Math.PI / 2 + Math.atan(fsTrigger - value)) / Math.PI);
          const lineHeightTarget = .9;
          const gap = responsive['line-height-heading'] - lineHeightTarget;
          const lineHeight = Math.round((lineHeightTarget + (gap * reduction)) * 100) / 100;
          designSystemDirectives.sassPlaceholders[`%${namespaceFontSizeHeading}`].responsive[breakpoint] = {
            'font-size': `${value}${unit}`,
            'line-height': lineHeight,
          };
          designSystemDirectives.sassPlaceholders[`%${namespaceFontSizeText}`].responsive[breakpoint] = {
            'font-size': `${value}${unit}`,
            'line-height': responsive['line-height-text'],
          };
        }
      }

      index++;
    }
  }

  return designSystemDirectives;
}
