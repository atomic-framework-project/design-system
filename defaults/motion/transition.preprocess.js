exports.default = (DesignSystemFeatureObj) => {

    const easingPromise = require('./easing.json');
    const timingPromise = require('./timing.json');

    const output = {};

    for (const [easingName, easing] of Object.entries(easingPromise)) {
      for (const [timingName, timing] of Object.entries(timingPromise)) {
        output[`${easingName}-${timingName}`] = {
          easing: easing.css,
          timing,
          _easingNamespace: `${DesignSystemFeatureObj._prefix}easing-${easingName}`,
          _timingNamespace: `${DesignSystemFeatureObj._prefix}timing-${timingName}`,
        };
      }
    }

    return output;
}
