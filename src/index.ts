import {TemplateFormat} from './interface';
import DesignSystem from "./design-system";

export default async function proceed() {

  const output: null | DesignSystem = null;

  if (
    typeof process.argv[2] === 'string'
    && process.argv[2] === '-entry'
    && typeof process.argv[3] === 'string'
    && typeof process.argv[4] === 'string'
    && process.argv[4] === '-output'
    && typeof process.argv[5] === 'string'
    && typeof process.argv[6] === 'string'
    && process.argv[6] === '-format'
    && typeof process.argv[7] === 'string'
  ) {

    const DesignSystemObj = new DesignSystem(process.argv[3], process.argv[5], process.argv[7] as TemplateFormat);
    await DesignSystemObj.setup();
    DesignSystemObj.writeFiles();
  }
  else {

    console.error('Missing "-entry" and/or "-output" directive(s)');
    process.exit(1);
  }
}

proceed();
