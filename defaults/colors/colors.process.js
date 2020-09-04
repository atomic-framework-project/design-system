function setupPlaceholder(namespace, value) {

  const output = {};

  output[`%${namespace}-background`] = {
    sassdoc: {
      '': `Extend design system [${namespace}: ${value}] for background-color`,
      '@name': `${namespace}-background`
    },
    css: {
      'background-color': `var(--${namespace})`,
    },
  };

  output[`%${namespace}-color`] = {
    sassdoc: {
      '': `Extend design system [${namespace}: ${value}] for color`,
      '@name': `${namespace}-color`
    },
    css: {
      'color': `var(--${namespace})`,
    },
  };

  output[`%${namespace}-border`] = {
    sassdoc: {
      '': `Extend design system [${namespace}: ${value}] for border-color`,
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
  for (const[family, colors] of Object.entries(params)){

    // Colors
    for (const[name, color] of Object.entries(colors)){

      const namespace = `${prefix}-${family}-${name}`;

      // Root color value
      if(typeof color.value === 'string') {
        designSystemDirectives.cssVars[namespace] = color.value;
        designSystemDirectives.sassPlaceholders = {
          ...designSystemDirectives.sassPlaceholders,
          ...setupPlaceholder(namespace, color.value),
        };
      }

      // Declinaisons
      if(typeof color.declinaisons === 'object') {

        // Color declinaison
        for (const[declinaison, value] of Object.entries(color.declinaisons)){

          const declinaisonNamespace = `${namespace}-${declinaison}`;
          designSystemDirectives.cssVars[declinaisonNamespace] = value;
          designSystemDirectives.sassPlaceholders = {
            ...designSystemDirectives.sassPlaceholders,
            ...setupPlaceholder(declinaisonNamespace, value),
          };
        }
      }
    }
  }

  return designSystemDirectives;
}
