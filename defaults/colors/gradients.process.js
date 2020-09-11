function setupPlaceholder(namespace, value) {

  const output = {};

  output[`%${namespace}-background`] = {
    sassdoc: {
      '@name': `${namespace}-background`
    },
    css: {
      'background-color': `var(--${namespace})`,
    },
  };

  output[`%${namespace}-color`] = {
    sassdoc: {
      '@name': `${namespace}-color`
    },
    css: {
      'color': `var(--${namespace})`,
    },
  };

  output[`%${namespace}-border`] = {
    sassdoc: {
      '@name': `${namespace}-border`
    },
    css: {
      'border-color': `var(--${namespace})`,
    },
  };

  return output;
}

exports.default = (prefix, params) => {

  // Placeholders
  const designSystemDirectives = {
    cssVars: {},
    sassPlaceholders: {},
  };

  // family
  for (const[family, gradients] of Object.entries(params)){

    // Colors
    for (const[name, gradientSteps] of Object.entries(gradients)){

      const namespace = `${prefix}-${family}-${name}`;

      const colorsStops = [];
      for (const color of gradientSteps) {
        colorsStops.push(color);
      }
      const colorStops = colorsStops.join(', ');

      const variants = ['to bottom', 'to left', 'to right', 'to top'];

      for(const variant of variants) {
        const cssProp = `linear-gradient(${variant}, ${colorStops})`;
        const variantNamespace = `${namespace}-${variant.replace(' ', '-')}`;
        designSystemDirectives.cssVars[variantNamespace] = cssProp;
        designSystemDirectives.sassPlaceholders[`%${variantNamespace}`] = {
          sassdoc: {
            '@name': `${variantNamespace}`
          },
          css: {
            'background': `var(--${variantNamespace})`,
          },
        };
      }
    }
  }

  return designSystemDirectives;
}
