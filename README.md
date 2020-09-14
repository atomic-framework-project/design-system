# Atomic Framework: design-system
From designer params to ready-to-use Frontend material  
Generates `css`/`scss` files based on set of `json` config files

- [Overview](#overview)
- [Example](#example)
- [Advanced usages](#advanced-usages)
- [Todo](#todo)

## Overview
#### From...
``` json
{
  "brand": {
    "primary": {
      "value": "#545afb"
    }
  }
}
```
#### ...to
``` css
:root {--DS-colors-brand-primary: #545afb;}
```
``` scss
%DS-colors-brand-primary-color {color: var(--DS-colors-brand-primary);}
%DS-colors-brand-primary-background {background-color: var(--DS-colors-brand-primary);}
%DS-colors-brand-primary-border {border-color: var(--DS-colors-brand-primary);}
```
``` scss
$DS-colors: (
  "brand": (
    "primary": (
      "value": #545afb",
    )
  )
)
```

Handles the following frontend features:
- Css vars
- Sass Placeholders
- Icons (both to dataUrl and to webfont usage)
- Typefaces following [type-scale](https://type-scale.com/) best practice

## Example 
- 1: Require module `npm install --save @atomic-framework/design-system`  
- 2: Create an `index.js` file at your project's root and put the following code  
``` javascript
const DesignSystem = require('@atomic-framework/design-system').DesignSystem;

(async () => {
  const DesignSystemObj = new DesignSystem(
    './design-system',
    './dist'
  );
  await DesignSystemObj.setup();
  DesignSystemObj.writeFiles();
})();
```
- 3: Create a `./design-system` folder at your project's root
- 4: Fork default **[colors.json](https://github.com/atomic-framework-project/design-system/blob/master/defaults/colors/colors.json)** config file and put your own colors ([*see all defaults*](https://github.com/atomic-framework-project/design-system/tree/master/defaults))
- 5: run command `node index.js`
- 6: Open `./dist/design-system.css` and `./dist/design-system.scss` file to see the result

## Advanced usages
@todo: Finish advanced usages

## @todo
- Finish readme.md
- Write advanced usages
- Add templates for a Styleguide (Expected formats: .twig | .vue | .jsx)
- Export Typescript types
- Add Jest tests
- Unify default icons
