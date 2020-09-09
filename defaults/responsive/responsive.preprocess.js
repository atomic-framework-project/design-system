exports.default = () => {

  const siteRange = require('./site-range.json');
  const breakpoints = require('./breakpoints.json');

  const output = {
    max: siteRange.max,
    steps: {
      mobile: siteRange.min,
    }
  }

  for (const [breakpoint, value] of Object.entries(breakpoints)) {
    output.steps[breakpoint] = value;
  }

  return output;
}
