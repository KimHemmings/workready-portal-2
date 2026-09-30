import { module1 } from './modules/module1';
import { module2 } from './modules/module2';
import { module3 } from './modules/module3';
import { module4 } from './modules/module4';
import { module5 } from './modules/module5';
import { module6 } from './modules/module6';
import { module7 } from './modules/module7';
import { module8 } from './modules/module8';
import { module9 } from './modules/module9';
import { module10 } from './modules/module10';
import { module11 } from './modules/module11';
import { module12 } from './modules/module12';
import { module13 } from './modules/module13';
import { module14 } from './modules/module14';
import { module15 } from './modules/module15';
import { module16 } from './modules/module16';
import { module17 } from './modules/module17';
import { module18 } from './modules/module18';
import { module19 } from './modules/module19';
import { module20 } from './modules/module20';
import { module21 } from './modules/module21';
import { module22 } from './modules/module22';
import { module23 } from './modules/module23';
import { module24 } from './modules/module24';

export type ModuleData = any;

const rawModules = [
  module1, module2, module3, module4, module5, module6,
  module7, module8, module9, module10, module11, module12,
  module13, module14, module15, module16, module17, module18,
  module19, module20, module21, module22, module23, module24
];

export const modulesData = rawModules.map((mod, index) => {
  const num = mod.moduleNumber || index + 1;
  return {
    ...mod,
    id: `M${String(num).padStart(2, '0')}`,
    moduleNumber: num,
    category: mod.category || 'Workplace Expectations',
    estimatedMins: 20,
    pbasPoints: 5,
  };
});