Since react-native-firebase is not yet having the modular firebase implementation (See https://github.com/invertase/react-native-firebase/discussions/6220#discussioncomment-2646606),

TODO(PC-14769): udpate firebase and react-native-firebase to modular

We use this directory has an universal JS interface for firebase Web & Native.

Firebase import should only be imported through those, we have added an eslint rule not to be able to import without adding to this interface.

`libs/firebase/shims` is for business custom implementation that use `libs/firebase`.

DO NOT add any business logic in this file.

TODO: remove usage of `FIREBASE_CONFIG` (separate of concerns)

> Shim inspired of https://github.com/invertase/react-native-firebase-authentication-example/blob/68bd37f8c219f892655b40c73e9818370f368b82/template/craco.config.js#L111-L114
