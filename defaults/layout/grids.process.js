exports.default = (prefix, params) => {

  // Placeholders
  const designSystemDirectives = {
    cssVars: {},
    sassPlaceholders: {},
  };

  for (const [breakpoint, config] of Object.entries(params)) {

    const namespace = `${prefix.substr(0, prefix.length - 1)}-${breakpoint}`;

    designSystemDirectives.sassPlaceholders[`%${namespace}`] = {
      sassdoc: {
        '': `Extend design system [grid : ${namespace}]`,
        '@name': `${namespace}`
      },
      responsive: {},
    };
    designSystemDirectives.sassPlaceholders[`%${namespace}`].responsive[breakpoint] = {
      'width': '100%',
      'display': 'grid',
      'align-content': 'space-around',
      'justify-content': 'space-between',
    };

    if(typeof config.gutter === 'number'){
      designSystemDirectives.cssVars[`${namespace}-gutter`] = `${config.gutter}px`;
      designSystemDirectives.sassPlaceholders[`%${namespace}`].responsive[breakpoint]['grid-column-gap'] = `var(--${namespace}-gutter)`;
    }

    for (const combinaison of config.prefferedCombinaisons) {

      const range = Math.round(config.size / combinaison);
      const suffix = `-by${range}`;
      const combinaisonName = `grid-${breakpoint}${suffix}`;

      designSystemDirectives.sassPlaceholders[`%${combinaisonName}`] = {
        sassdoc: {},
        responsive: {}

      };

      designSystemDirectives.cssVars[`${namespace}${suffix}`] = `repeat(${range}, 1fr)`;
      designSystemDirectives.sassPlaceholders[`%${combinaisonName}`].responsive[breakpoint] = {
        'grid-template-columns': `var(--${namespace}${suffix})`,
      };
    }

    for (const [unit, size] of Object.entries(config.units)) {

      const unitName = `grid-${breakpoint}-${unit}`;

      designSystemDirectives.sassPlaceholders[`%${unitName}`] = {
        sassdoc: {},
        responsive: {}

      };
      designSystemDirectives.sassPlaceholders[`%${unitName}`].responsive[breakpoint] = {
        'width': `${size}%`,
      };
    }
  }

  return designSystemDirectives;
}
