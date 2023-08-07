# TODO

## Links

- [PC-TicketNumber](https://passculture.atlassian.net/browse/PC-TicketNumber)
- [MobTime](https://mobtime.hadrienmp.fr/mob/pass-culture)

---

## Tasks

- [ ] 93 tests suites qui fail en web

L'erreur est la suivante :

```
  FAIL src/ui/components/touchableLink/ExternalTouchableLink.web.test.tsx
  ● Test suite failed to run

  Jest encountered an unexpected token

  Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

  Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

  By default "node_modules" folder is ignored by transformers.

  Here's what you can do:
  • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
  • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
  • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
  • If you need a custom transformation specify a "transform" option in your config.
  • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

  You'll find more details and examples of these config options in the docs:
  https://jestjs.io/docs/configuration
  For information about custom transformations, see:
  https://jestjs.io/docs/code-transformation

  Details:

  /Users/lucasbeneston/Desktop/pass-culture-app-native/node_modules/firebase/compat/app/dist/index.esm.js:1
  ({"Object.<anonymous>":function(module,exports,require,**dirname,**filename,jest){import firebase from '@firebase/app-compat';
  ^^^^^^

  SyntaxError: Cannot use import statement outside a module

        1 | /* eslint-disable no-restricted-imports */

  > 2 | import firebase from 'firebase/compat/app'

          | ^
        3 | import 'firebase/compat/firestore'
        4 |
        5 | import initializeApp from '../firebase-init'

        at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1796:14)
        at Object.<anonymous> (src/libs/firebase/shims/firestore/index.web.ts:2:1)
```

J'ai essayé de fix le problème en ajoutant ceci dans le jest.web.config qui règle quasiement toutes les erreurs (plus que 8 tests suites qui fail), mais c'est peut-être pas la solution la plus propre :

```
transformIgnorePatterns: [
'node_modules/(?!' +
'firebase' +
'|@firebase' +
'|@ptomasroos/react-native-multi-slider' +
'|react-native-svg-web' +
'|react-native-animatable' +
'|react-native-web' +
'|react-native-modal' +
'|react-native-calendars' +
'|react-native-swipe-gestures' +
'|react-native-permissions' +
'|react-native-qrcode-svg' +
'|react-native-country-picker-moda' +
'|instantsearch.js' +
')',
],
```

Les tests qui échouent avec cette solution sont en lien avec firebase. Pour info, j'ai testé de mettre le mock des FF et les tests étaient OK !

---

## Tasks for another US

- [ ] Tester de mettre les useFakeTimers('modern')
