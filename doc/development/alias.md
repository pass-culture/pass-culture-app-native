# Alias

We have alias when we import stuff

To be able to write this

```ts
import { eventMonitoring } from 'libs/monitoring'
```

Instead of

```ts
import { eventMonitoring } from '../../../libs/monitoring'
```

They are configured on several tools :

- [Vite](https://github.com/pass-culture/pass-culture-app-native/blob/7bd66f82d47fc41dec8e0f0e32c743931de41f97/vite.config.js#L114)
- [Storybook](https://github.com/pass-culture/pass-culture-app-native/blob/7bd66f82d47fc41dec8e0f0e32c743931de41f97/.storybook/main.js#L14)
- [ESLint](https://github.com/pass-culture/pass-culture-app-native/blob/7bd66f82d47fc41dec8e0f0e32c743931de41f97/.eslintrc.js#L302)
- [Babel](https://github.com/pass-culture/pass-culture-app-native/blob/7bd66f82d47fc41dec8e0f0e32c743931de41f97/babel.config.js#L11)
- [Jest](https://github.com/pass-culture/pass-culture-app-native/blob/7bd66f82d47fc41dec8e0f0e32c743931de41f97/jest.config.js#L7)
- [TSConfig](https://github.com/pass-culture/pass-culture-app-native/blob/7bd66f82d47fc41dec8e0f0e32c743931de41f97/tsconfig.json#L4)
- [Knip](https://github.com/pass-culture/pass-culture-app-native/blob/8267d4b7ae0d69d1ad0c5c8238806765da31a735/knip.ts#L5)

If you change one, please make sure to change the other
