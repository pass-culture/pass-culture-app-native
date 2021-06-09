# ThreatMetrix SDK installation

Before integrating the SDK, please get familiar with developing a [native module](https://reactnative.dev/docs/native-modules-intro).

We will install the SDK as a local module or library inside our app. It would probably work just as well with a npm package, but we would have to configue the CI as such. And for the sake of simplicity, we'll just keep it local.

So let's create the module.

### Create the local module

In the following, "Application" = your react native application and "Module" the library created for profiling.
Inside your application, create a directory `packages`. You will create the module inside. You can choose to create the module where you want. For clarity, we'll create it inside `./packages`.

Next install [`create-react-native-module`](https://www.npmjs.com/package/create-react-native-module).

```bash
$ yarn add global react-native-cli
$ yarn global add create-react-native-module
$ create-react-native-module profiling  # This will create the module react-native-profiling
$ cd react-native-profiling && yarn
```

You can choose whichever name for your module. We'll stick with profiling.
Now, the module by default provides us with a native function `sampleMethod`. Let's try to make this works.

### Making the local module work

The code in java for this function can be found in `packages/react-native-profiling/android/src/main/java/com/reactlibrary/ProfilingModule.java` and looks like that:

```java
    @ReactMethod
    public void sampleMethod(String stringArgument, int numberArgument, Callback callback) {
        // TODO: Implement some actually useful functionality
        callback.invoke("Received numberArgument: " + numberArgument + " stringArgument: " + stringArgument);
    }
```

In javascript, we will just call it like that:

```javascript
import { NativeModules } from 'react-native'

const { Profiling } = NativeModules
Profiling.sampleMethod('hello', 23, console.log) // and this will print "Received numberArgument: 23  stringArgument: hello"
```

The equivalent method for iOS will be in `packages/react-native-profiling/ios/Profiling.m`

First, we need to install the module into our application by adding it to the `package.json` as a local module.

```json
    "react-native-profiling": "file:./packages/react-native-profiling",
```

And run

```bash
$ yarn  # to install react-native-profiling
$ cd ios && bundle exec pod install && cd ..  # to install the new pod for iOS
$ yarn start && yarn start --reset-cache  # restart the metro server (due to patched package conflicts)
```

Make sure you can build for iOS and Android. You may need to enable `inlineRequires` in your metro.config.js.

✅ Check: invoke the function `sampleMethod`:

```javascript
import Profiling from 'react-native-profiling'

Profiling.sampleMethod('hello', 23, console.log)
```
