exports.default = (prefix, params) => {

  // Placeholders
  const designSystemDirectives = {
    cssVars: {},
    sassPlaceholders: {},
  };

  for (const [name, value] of Object.entries(params)) {

    const namespace = `${prefix}-${name}`;
    const namespaceBlock = `%${prefix}-box-${name}`;
    const namespaceText = `%${prefix}-text-${name}`;

    designSystemDirectives.cssVars[namespace] = value;
    designSystemDirectives.sassPlaceholders[namespaceBlock] = {
      sassdoc: {
        '@name': namespaceBlock
      },
      css: {
        'box-shadow': `var(--${namespace})`
      }
    };
    designSystemDirectives.sassPlaceholders[namespaceText] = {
      sassdoc: {
        '@name': namespaceText
      },
      css: {
        'text-shadow': `var(--${namespace})`
      }
    };
  }

  return designSystemDirectives;
}
