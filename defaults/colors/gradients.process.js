exports.default = (prefix, params) => {

  // Placeholders
  const designSystemDirectives = {
    cssVars: {},
    sassPlaceholders: {},
  };

  // family
  for (const[family, gradients] of Object.entries(params)){

    // Colors
    for (const[name, properties] of Object.entries(gradients)){

      const namespace = `${prefix}-${family}-${name}`;
      const type = properties.type;
      const gradientSteps = properties.steps;
      const variants = properties.variants;

      const colorsStops = [];
      for (const color of gradientSteps) {
        colorsStops.push(color);
      }
      const colorStops = colorsStops.join(', ');

      for(const variant of variants) {
        const cssProp = `${type}-gradient(${variant}, ${colorStops})`;
        const variantNamespace = `${namespace}-${variant.replace(/ /gi, '-')}`;
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
