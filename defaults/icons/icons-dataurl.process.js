const path = require('path');
const fs = require('fs');

exports.default = (prefix, params, output) => {

  // Placeholders
  const designSystemDirectives = {
    fonts: {},
    cssVars: {},
    sassPlaceholders: {},
  };

  for(const [iconNamespace, icon] of Object.entries(params)) {

    const namespace = `${prefix}-${iconNamespace}`;
    const filepath = icon.relpath.substring(0, icon.relpath.length - 1).substring(1, icon.relpath.length - 1);
    designSystemDirectives.sassPlaceholders[`%${namespace}`] = {
      sassdoc: {
        '@name': `${namespace}`,
      },
      css: {
        content: `""`,
        display: 'inline-block',
        width: `${icon.width}px`,
        height: `${icon.height}px`,
        'background-image': `url(${filepath})`,
        'background-repeat': 'no-repeat',
        'background-size': `${icon.width}px ${icon.height}px`,
      }
    };
  }

  return designSystemDirectives;
}
