exports.default = (prefix, params) => {

  // Placeholders
  const designSystemDirectives = {
    cssVars: {},
    sassPlaceholders: {},
  };

  for (const [name, value] of Object.entries(params)) {

    const placeholderPrefix = `${prefix}-${name}`;
    designSystemDirectives.sassPlaceholders[`%${placeholderPrefix}`] = {
      sassdoc: {
        '@name': `${placeholderPrefix}`,
      },
      css: {
        'transition-timing-function': `var(--${value._easingNamespace})`,
        'transition-duration': `var(--${value._timingNamespace})`,
      }
    };
  }

  return designSystemDirectives;
}
