import { NodePlopAPI } from 'plop';

export default function (plop: NodePlopAPI) {
  // Atom generator
  plop.setGenerator('atom', {
    description: 'add a new atom',
    prompts: [
      {
        type: 'input',
        name: 'AtomName',
        message: 'Atom name?',
        validate: (input) => {
          if (input[0] === input[0].toLowerCase()) return 'Please capitalize';
          return true;
        },
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/atoms/{{AtomName}}/{{AtomName}}.atom.tsx',
        templateFile: 'plop_templates/atom/atom.template',
      },
      {
        type: 'add',
        path: 'src/atoms/{{AtomName}}/index.ts',
        templateFile: 'plop_templates/atom/index.template',
      },
      {
        type: 'add',
        path: 'src/atoms/{{AtomName}}/__tests__/{{AtomName}}.atom.test.tsx',
        templateFile: 'plop_templates/atom/test.template',
      },
    ],
  });

  // Page generator
  plop.setGenerator('page', {
    description: 'add a new page',
    prompts: [
      {
        type: 'input',
        name: 'PageName',
        message: 'Page name?',
        validate: (input) => {
          if (input[0] === input[0].toLowerCase()) return 'Please capitalize';
          return true;
        },
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/pages/{{PageName}}/{{PageName}}.component.tsx',
        templateFile: 'plop_templates/page/page.template',
      },
      {
        type: 'add',
        path: 'src/pages/{{PageName}}/index.ts',
        templateFile: 'plop_templates/page/index.template',
      },
      {
        type: 'add',
        path: 'src/pages/{{PageName}}/__tests__/{{PageName}}.component.test.tsx',
        templateFile: 'plop_templates/page/test.template',
      },
      {
        type: 'modify',
        path: 'src/pages/index.ts',
        pattern: /((export \* from '\.\/\w+';\n?)+)/,
        template: `$1export * from './{{PageName}}';\n`,
      },
      {
        type: 'modify',
        path: 'src/navigation/RootNavigator.tsx',
        pattern: /(export type RootStackParamList = {\n( *\w*:.*;\n)+)};/,
        templateFile: 'plop_templates/page/RootNavigator/RootStackParamList.template',
      },
      {
        type: 'modify',
        path: 'src/navigation/RootNavigator.tsx',
        pattern: /(\n {6}<\/RootStack\.Navigator>)/,
        templateFile: 'plop_templates/page/RootNavigator/RootNavigator.template',
      },
      {
        type: 'modify',
        path: 'src/navigation/RootNavigator.tsx',
        pattern: /import {([\w\n ,]*} from '..\/pages';)/,
        templateFile: 'plop_templates/page/RootNavigator/import.template',
      },
    ],
  });

  // Redux module generator
  plop.setGenerator('module', {
    description: 'add a new Redux module',
    prompts: [
      {
        type: 'input',
        name: 'ModuleName',
        message: 'Module name?',
        validate: (input) => {
          if (input[0] === input[0].toLowerCase()) return 'Please capitalize';
          return true;
        },
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/redux/{{ModuleName}}/index.ts',
        templateFile: 'plop_templates/module/index.template',
      },
      {
        type: 'add',
        path: 'src/redux/{{ModuleName}}/selectors.ts',
        templateFile: 'plop_templates/module/selectors.template',
      },
      {
        type: 'add',
        path: 'src/redux/{{ModuleName}}/reducer.ts',
        templateFile: 'plop_templates/module/reducer.template',
      },
      {
        type: 'add',
        path: 'src/redux/{{ModuleName}}/actions.ts',
        templateFile: 'plop_templates/module/actions.template',
      },
      {
        type: 'modify',
        path: 'src/redux/rootReducer.ts',
        pattern: /(import.*from.*\/reducer.*)\n((import.*Action.*from '\.\/.*\n)+)/,
        templateFile: 'plop_templates/module/rootReducer/import.template',
      },
      {
        type: 'modify',
        path: 'src/redux/rootReducer.ts',
        pattern: /(export interface RootState {\n( *\w+: \w+State;\n?)+)}/,
        templateFile: 'plop_templates/module/rootReducer/RootState.template',
      },
      {
        type: 'modify',
        path: 'src/redux/rootReducer.ts',
        pattern: /(export type RootReducer = {\n( *\w+: Reducer<\w+State, \w+Action>;\n?)+)};/,
        templateFile: 'plop_templates/module/rootReducer/RootReducerType.template',
      },
      {
        type: 'modify',
        path: 'src/redux/rootReducer.ts',
        pattern: /(export const rootReducer = combineReducers\({\n( *\w+: (localStoragePersist|sensitivePersist)\('\w+', \w+Reducer(, \[\])?\),(\n)?)+)}\);/,
        templateFile: 'plop_templates/module/rootReducer/RootReducer.template',
      },
    ],
  });
}
