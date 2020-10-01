const path = require('path');

exports.default = (prefix, params, output, dirname, DesignSystemFeatureObj) => {

  // Placeholders
  const designSystemDirectives = {
    cssVars: {},
    sassPlaceholders: {},
  };

  const aliasName = DesignSystemFeatureObj.getAliasNamespace();
  if(typeof aliasName === 'string' && Object.keys(params).length) {
    let dirname = path.dirname(Object.values(params)[0].file);
    dirname = dirname.replace('"', '');
    DesignSystemFeatureObj.setAlias(aliasName, dirname)
  }

  for(const [iconNamespace, icon] of Object.entries(params)) {

    const namespace = `${prefix}-${iconNamespace}`;
    const filepath = icon.relpath.substring(0, icon.relpath.length - 1).substring(1, icon.relpath.length - 1);

    let url = filepath;
    if(typeof aliasName === 'string' && Object.keys(params).length) {
      url = `${aliasName}${path.sep}${path.basename(filepath)}`;
    }

    designSystemDirectives.sassPlaceholders[`%${namespace}`] = {
      sassdoc: {
        '@name': `${namespace}`,
      },
      css: {
        content: `""`,
        display: 'inline-block',
        width: `${icon.width}px`,
        height: `${icon.height}px`,
        'background-image': `url(${url})`,
        'background-repeat': 'no-repeat',
        'background-size': `${icon.width}px ${icon.height}px`,
      }
    };
  }

  return designSystemDirectives;
}
