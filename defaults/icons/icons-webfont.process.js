const path = require('path');
const webfontsGenerator = require('@ilzrv/webfonts-generator');

exports.default = (prefix, params, output) => {

  // Placeholders
  const designSystemDirectives = {
    fonts: {},
    cssVars: {},
    sassPlaceholders: {},
  };

  const namespaceFont = `webfont-icons`;
  designSystemDirectives.fonts[namespaceFont] = {
    file: `./${namespaceFont}.woff2`,
    css: {
      'font-family': `"${namespaceFont}"`,
      'font-display': 'swap',
      'font-weight': 'normal',
      'font-style': 'normal',
    }
  };
  designSystemDirectives.sassPlaceholders[`%${namespaceFont}`] = {
    sassdoc: {
      '@name': `${namespaceFont}`,
    },
    css: {
      'font-family': `"${namespaceFont}", sans-serif`,
      speak: 'none',
      'font-style': 'normal',
      'font-weight': 'normal',
      'font-variant': 'normal',
      'text-transform': 'none',
      'line-height': 1,
    }
  };

  let iconsCodepoints = {};
  webfontsGenerator ({
    files: Object.values(params).map(elt => elt.file.substring(0, elt.file.length - 1).substring(1, elt.file.length - 1)),
    css: false,
    dest: output,
    fontName: namespaceFont,
    types: ['woff2'],
  }, function(error) {
    if (error) {
      console.log('Error creating icons font', error);
    }
  });

  // Setup corresponding codepoint to webfontsGenerator module
  const startingCodepoint = 61697; // 0xF101
  const codepoints = [];
  for(let i = 61697; i < (startingCodepoint + Object.keys(params).length); i++) {
    codepoints.push(i.toString(16));
  }

  let index = 0;
  for(const [iconNamespace, icon] of Object.entries(params)) {

    const namespace = `${prefix}-${iconNamespace}`;
    designSystemDirectives.sassPlaceholders[`%${namespace}`] = {
      sassdoc: {
        '@name': `${namespace}`,
      },
      css: {
        '@extend': [`%${namespaceFont}`],
        content: `"\\${codepoints[index]}"`,
        width: `${icon.width}px`,
        height: `${icon.height}px`,
      }
    };

    index++;
  }

  return designSystemDirectives;
}
