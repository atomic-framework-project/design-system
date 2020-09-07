function unitChecker(value) {

  let unit = '';
  if (typeof value === 'number' && value) {
    unit = 'px';
  }

  return unit;
}

exports.default = (prefix, params) => {

  // Placeholders
  const designSystemDirectives = {
    cssVars: {},
    sassPlaceholders: {},
  };

  for (const [name, value] of Object.entries(params)) {

    const namespace = `${prefix}-${name}`;

    designSystemDirectives.cssVars[namespace] = `${value}${unitChecker(value)}`;
    designSystemDirectives.sassPlaceholders[`%${namespace}`] = {
      sassdoc: {
        '@name': `${prefix}-${name}`
      },
      css: {
        'border-radius': `var(--${namespace})`
      }
    };
  }

  return designSystemDirectives;
}
