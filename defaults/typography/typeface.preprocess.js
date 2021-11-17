exports.default = (DesignSystemFeatureObj) => {

  const typescales = require('./typescales.json');
  const output = {};

  // How many sizes do we need. Default is from down-2 to up-8
  const howManySizes = {
    down: 2,
    up: 8,
  };
  const range = {
    from: (howManySizes.down * -1),
    to: howManySizes.up,
  };

  for (const [fontname, font] of Object.entries(DesignSystemFeatureObj.params)) {
    for (const [breakpoint, responsive] of Object.entries(font.responsive)) {

      DesignSystemFeatureObj.params[fontname].responsive[breakpoint].typescale = typescales[DesignSystemFeatureObj.params[fontname].responsive[breakpoint].typescale];

      // Init output result
      DesignSystemFeatureObj.params[fontname].responsive[breakpoint]['font-sizes'] = {};

      for (let index = range.to; index >= range.from; index--) {

        let prefix = '';
        let value = DesignSystemFeatureObj.params[fontname].responsive[breakpoint].root * Math.pow(DesignSystemFeatureObj.params[fontname].responsive[breakpoint].typescale, index);

        // 'up' context
        if (index > 0) {
          prefix = `up-${index}`;
          value = Math.floor(value);
        }
        // 'root' context
        else if (index === 0) {
          prefix = 'root';
        }
        // 'down' context
        else {
          prefix = `down${index}`;
          value = Math.ceil(value);
        }

        DesignSystemFeatureObj.params[fontname].responsive[breakpoint]['font-sizes'][prefix] = `${value}`;
      }
    }

    if(typeof font['font-sizes-specifics'] !== 'undefined') {
      for (const [name, values] of Object.entries(font['font-sizes-specifics'])) {
        for (const [breakpoint, value] of Object.entries(values)) {
          if (
              typeof DesignSystemFeatureObj.params[fontname].responsive[breakpoint] !== 'undefined'
              && DesignSystemFeatureObj.params[fontname].responsive[breakpoint]['font-sizes'] !== 'undefined') {
            DesignSystemFeatureObj.params[fontname].responsive[breakpoint]['font-sizes'][name] = `${value}`;
          }
        }
      }
    }
  }

  return output;
}
