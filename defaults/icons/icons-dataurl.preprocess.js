const fs = require('fs');
const path = require('path');
const urlencode = require('urlencode');

exports.default = (DesignSystemFeatureObj) => {

  const output = {};

  for(const icon of DesignSystemFeatureObj.files.icons){
    const iconName = path.basename(icon, '.svg');

    let width = null;
    let height = null;

    const iconMarkup = fs.readFileSync(icon, {encoding: 'utf-8'});

    const svgWidthAttr = /<svg[^>]*width="(\d+)(px)?"(.*)>/gi;
    if (svgWidthAttr.test(iconMarkup)) {
      iconMarkup.replace(svgWidthAttr, (match, result) => {
        width = Number.parseFloat(result);
        return result;
      });
    }
    const svgHeightAttr = /<svg[^>]*height="(\d+)(px)?"(.*)>/gi;
    if (svgHeightAttr.test(iconMarkup)) {
      iconMarkup.replace(svgHeightAttr, (match, result) => {
        height = Number.parseFloat(result);
        return result;
      });
    }
    const svgViewboxAttr = /<svg[^>]*viewbox="(([0-9 px])*)"(.*)>/gi;
    if (width == null && height == null && svgViewboxAttr.test(iconMarkup)) {
      iconMarkup.replace(svgViewboxAttr, (match, result) => {
        console.log('viewbox ----', iconName);
        const coords = result.replace('px', '').split(' ');
        if (typeof coords[2] !== 'undefined'){
          width = Number.parseFloat(coords[2]);
        }
        if (typeof coords[3] !== 'undefined'){
          height = Number.parseFloat(coords[3]);
        }
        return result;
      });
    }

    const relpath = path.relative(DesignSystemFeatureObj.output, icon);
    output[iconName] = {
      width,
      height,
      file: `"${icon}"`,
      relpath: `"${relpath}"`,
      _path: `data:image/svg+xml;charset=utf-8,${urlencode(iconMarkup)}`,
    };
  }

  return output;
}
