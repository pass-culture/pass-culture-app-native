This directory is a universal JS interface for firebase Web & Native.

Firebase import should only be imported through those, 
we have added an eslint rule not to be able to import without adding to this interface.

`libs/firebaseImpl` is for business custom implementation that use `libs/firebase`.

DO NOT add any business logic in this file.

TODO: remove usage of `FIREBASE_CONFIG` (separate of concerns)
