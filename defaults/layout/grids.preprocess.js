exports.default = (DesignSystemFeatureObj) => {

    const output = {};

    for (const [key, gridConfig] of Object.entries(DesignSystemFeatureObj.params)) {
      if (DesignSystemFeatureObj.params.hasOwnProperty(key)) {
        gridConfig.relativeSize = 100 / gridConfig.size;
        for (let index = 1; index <= gridConfig.size; index++) {
          gridConfig.units[index] = gridConfig.relativeSize * index;
        }
      }
    }

    return output;
}
