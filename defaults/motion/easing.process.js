exports.default = (prefix, params) => {

  // Placeholders
  const designSystemDirectives = {
    cssVars: {},
    sassPlaceholders: {},
  };

  for (const [name, value] of Object.entries(params)) {

    // Namespace
    const namespace= `${prefix}-${name}`;
    designSystemDirectives.cssVars[namespace] = value.css;
  }

  return designSystemDirectives;
}
