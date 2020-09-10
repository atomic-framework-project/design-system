const unicode = require('unicode/category/Ll');

exports.default = (prefix, params, output) => {

  const unicodeTable = Object.keys(unicode);
  const excludedChars = ['࿕', '࿖', '࿗', '࿘'];

  // Placeholders
  const designSystemDirectives = {
    fonts: {},
    cssVars: {},
    sassPlaceholders: {},
  };

  const namespaceFont = `webfont-icons`;
  designSystemDirectives.fonts[namespaceFont] = {
    'file': `./${namespaceFont}.woff2`,
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

  let index = 0;
  for(const [iconNamespace, icon] of Object.entries(params)) {

    const namespace = `${prefix}-${iconNamespace}`;

    // const glyph = createReadStream(`${Icons.iconsRelPath}${iconName}`);
    let character = unicode[unicodeTable[index]].symbol;

    while(excludedChars.indexOf(character) !== -1) {
      index++;
      character = unicode[unicodeTable[index]].symbol;
    }

    // glyph.metadata = {
    //   unicode: [character],
    //   name: id
    // };
    // fontStream.write(glyph);
    //

    // this.webfontIcons[`${id}`] = {
    //   ...DesignSystemFeatureObj.extractSvgSize(iconMarkupOptimized),
    //   filename: iconName,
    //   unicode: `\\${unicodeTable[Icons.unicodeTableKeys[index]].value}`,
    //   _path: `data:image/svg+xml;charset=utf-8,${urlencode(await iconPath)}`,
    // };

    designSystemDirectives.sassPlaceholders[`%${namespace}`] = {
      sassdoc: {
        '@name': `${namespace}`,
      },
      css: {
        '@extend': [`%${namespaceFont}`],
        content: `"\\${unicode[unicodeTable[index]].value}"`,
        width: `${icon.width}px`,
        height: `${icon.height}px`,
      }
    };

    index++;
  }

  return designSystemDirectives;
}
