function unitChecker(value) {

  let unit = '';
  if (typeof value === 'number' && value) {
    unit = 'px';
  }

  return unit;
}

function setupPlaceholder(namespace, value) {

  const output = {};

  output[`%${namespace}`] = {
    sassdoc: {
      '@name': `${namespace}`
    },
    css: {
      'border-width': `${value}${unitChecker(value)}`,
      'border-style': 'solid',
    },
  };

  for (const side of ['top', 'right', 'bottom', 'left']) {

    const namespaceSide = `${namespace}-${side}`;

    output[`%${namespaceSide}`] = {
      sassdoc: {
        '@name': `${namespaceSide}`
      },
      css: {},
    };
    output[`%${namespaceSide}`].css[`border-${side}-width`] = `var(--${namespace})`;
    output[`%${namespaceSide}`].css[`border-${side}-style`] = 'solid';
  }

  return output;
}

exports.default = (prefix, params) => {

  // Placeholders
  const designSystemDirectives = {
    cssVars: {},
    sassPlaceholders: {},
  };

  // family
  for (const [name, value] of Object.entries(params)) {

    const namespace = `${prefix}-${name}`;

    designSystemDirectives.cssVars[namespace] = `${value}${unitChecker(value)}`;
    designSystemDirectives.sassPlaceholders = {
      ...designSystemDirectives.sassPlaceholders,
      ...setupPlaceholder(namespace, value),
    };
  }

  return designSystemDirectives;
}
