function unitChecker(value) {

  let unit = '';
  if (typeof value === 'number' && value) {
    unit = 'px';
  }

  return unit;
}

exports.default = (prefix, params) => {

  // Placeholders
  const designSystemDirectives = {
    cssVars: {},
    sassPlaceholders: {},
  };

  // Group name
  for (const[groupName, group] of Object.entries(params)){

    // Color name
    for (const[name, value] of Object.entries(group)){

      // Namespace
      const namespace= `${prefix}-${groupName}-${name}`;

      designSystemDirectives.cssVars[namespace] = `${value}${unitChecker(value)}`;
      designSystemDirectives.sassPlaceholders[`%${namespace}-inset`] = {
        sassdoc: {
          '@name': `${prefix}-${groupName}-${name}-inset`
        },
        css: {
          'padding': `var(--${namespace})`
        }
      };

      designSystemDirectives.sassPlaceholders[`%${namespace}-inset-horizontal`] = {
        sassdoc: {
          '@name': `${prefix}-${groupName}-${name}-inset-horizontal`
        },
        css: {
          'padding-left': `var(--${namespace})`,
          'padding-right': `var(--${namespace})`
        }
      };

      designSystemDirectives.sassPlaceholders[`%${namespace}-inset-vertical`] = {
        sassdoc: {
          '@name': `${prefix}-${groupName}-${name}-inset-vertical`
        },
        css: {
          'padding-top': `var(--${namespace})`,
          'padding-bottom': `var(--${namespace})`
        }
      };

      designSystemDirectives.sassPlaceholders[`%${namespace}-outset`] = {
        sassdoc: {
          '@name': `${prefix}-${groupName}-${name}-outset`
        },
        css: {
          'margin': `var(--${namespace})`
        }
      };

      designSystemDirectives.sassPlaceholders[`%${namespace}-outset-horizontal`] = {
        sassdoc: {
          '@name': `${prefix}-${groupName}-${name}-outset-horizontal`
        },
        css: {
          'margin-left': `var(--${namespace})`,
          'margin-right': `var(--${namespace})`
        }
      };

      designSystemDirectives.sassPlaceholders[`%${namespace}-outset-vertical`] = {
        sassdoc: {
          '@name': `${prefix}-${groupName}-${name}-outset-vertical`
        },
        css: {
          'margin-top': `var(--${namespace})`,
          'margin-bottom': `var(--${namespace})`
        }
      };

      designSystemDirectives.sassPlaceholders[`%${namespace}-stack`] = {
        sassdoc: {
          '@name': `${prefix}-${groupName}-${name}-stack`
        },
        css: {
          'margin-bottom': `var(--${namespace})`
        }
      };

      designSystemDirectives.sassPlaceholders[`%${namespace}-inline`] = {
        sassdoc: {
          '@name': `${prefix}-${groupName}-${name}-inline`
        },
        css: {
          'margin-right': `var(--${namespace})`
        }
      };
    }
  }

  return designSystemDirectives;
}
