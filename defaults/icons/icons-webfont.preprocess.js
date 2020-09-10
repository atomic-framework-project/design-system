const fs = require('fs');
const path = require('path');
const urlencode = require('urlencode');

exports.default = async (DesignSystemFeatureObj) => {

  const output = {};

  if(typeof DesignSystemFeatureObj.files.icons !== 'undefined') {

    for (const icon of DesignSystemFeatureObj.files.icons) {
      const iconName = path.basename(icon, '.svg');

      const iconMarkup = fs.readFileSync(icon, {encoding: 'utf-8'});
      const iconMarkupOptimized = await DesignSystemFeatureObj.optimiseSvgPath(iconMarkup);

      const relpath = path.relative(DesignSystemFeatureObj.output, icon);
      output[iconName] = {
        ...DesignSystemFeatureObj.extractSvgSize(iconMarkupOptimized),
        file: `"${icon}"`,
        relpath: `"${relpath}"`,
        _path: iconMarkupOptimized,
      };
    }
  }

  return output;
}
