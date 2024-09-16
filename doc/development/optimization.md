## Web

### Analyze production build

Set `BUNDLE_ANALYZER` environment variable to visualize what's bundled in production:

```bash
BUNDLE_ANALYZER=true yarn build:testing
```

This will open a Web page with a visualization of all the sources and dependencies builded, with size en gzipped size, ex:

![Example of webpack-bundle-analyzer](https://user-images.githubusercontent.com/77674046/182584538-e0554a55-5f8f-4282-b3a2-aebfce5ec9d6.png)

This can help to understand if you are building, optimizing and tree shaking correctly.

Read more about tree shaking : [MDN](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) | [How To Make Tree Shakeable Libraries](https://blog.theodo.com/2021/04/library-tree-shaking/)

### Analyze production duplicate modules

Set `SHOW_DUPLICATES_PLUGIN` environment variable to visualize what's bundled in production in a more advanced way than `npm ls`, ex:

```bash
SHOW_DUPLICATES_PLUGIN=true yarn build:testing
```

This will log when building the production Web application, ex:

```bash
Duplicate Sources / Packages - Duplicates found! ⚠️

* Duplicates: Found 71 similar files across 152 code sources (both identical + similar)
  accounting for 387610 bundled bytes.
* Packages: Found 10 packages with 17 resolved, 25 installed, and 53 depended versions.

## static/js/2.7cb904a6.chunk.js
@babel/runtime (Found 2 resolved, 7 installed, 8 depended. Latest 7.16.3.)
  7.14.8 ~/@lingui/core/~/@babel/runtime
    PassCulture@1.199.0 -> @lingui/core@^3.13.2 -> @babel/runtime@^7.11.2
    PassCulture@1.199.0 -> @lingui/react@^3.13.2 -> @lingui/core@^3.13.2 -> @babel/runtime@^7.11.2
  7.14.8 ~/@lingui/react/~/@babel/runtime
    PassCulture@1.199.0 -> @lingui/react@^3.13.2 -> @babel/runtime@^7.11.2
  7.14.8 ~/amplitude-js/~/@babel/runtime
    PassCulture@1.199.0 -> amplitude-js@^8.16.1 -> @babel/runtime@^7.3.4
  7.14.8 ~/babel-preset-react-app/~/@babel/runtime
    PassCulture@1.199.0 -> babel-preset-react-app@^10.0.1 -> @babel/runtime@^7.16.3
  7.14.8 ~/react-instantsearch-hooks/~/@babel/runtime
    PassCulture@1.199.0 -> react-instantsearch-hooks@^6.30.2 -> @babel/runtime@^7.1.2
  7.14.8 ~/react-query/~/@babel/runtime
    PassCulture@1.199.0 -> react-query@3.34.16 -> @babel/runtime@^7.5.5
  7.16.3 ~/@babel/runtime
    PassCulture@1.199.0 -> @babel/runtime@^7.12.0

@sentry/hub (Found 1 resolved, 2 installed, 2 depended. Latest 7.8.1.)
  7.8.1 ~/@sentry/react/~/@sentry/hub
    PassCulture@1.199.0 -> @sentry/react@^7.8.1 -> @sentry/browser@7.8.1 -> @sentry/core@7.8.1 -> @sentry/hub@7.8.1
  7.8.1 ~/@sentry/tracing/~/@sentry/hub
    PassCulture@1.199.0 -> @sentry/tracing@^7.8.1 -> @sentry/hub@7.8.1

@sentry/utils (Found 1 resolved, 2 installed, 6 depended. Latest 7.8.1.)
  7.8.1 ~/@sentry/react/~/@sentry/utils
    PassCulture@1.199.0 -> @sentry/react@^7.8.1 -> @sentry/utils@7.8.1
    PassCulture@1.199.0 -> @sentry/react@^7.8.1 -> @sentry/browser@7.8.1 -> @sentry/utils@7.8.1
    PassCulture@1.199.0 -> @sentry/react@^7.8.1 -> @sentry/browser@7.8.1 -> @sentry/core@7.8.1 -> @sentry/utils@7.8.1
    PassCulture@1.199.0 -> @sentry/react@^7.8.1 -> @sentry/browser@7.8.1 -> @sentry/core@7.8.1 -> @sentry/hub@7.8.1 -> @sentry/utils@7.8.1
  7.8.1 ~/@sentry/tracing/~/@sentry/utils
    PassCulture@1.199.0 -> @sentry/tracing@^7.8.1 -> @sentry/utils@7.8.1
    PassCulture@1.199.0 -> @sentry/tracing@^7.8.1 -> @sentry/hub@7.8.1 -> @sentry/utils@7.8.1

color-name (Found 2 resolved, 2 installed, 3 depended. Latest 1.1.4.)
  1.1.3 ~/color-convert/~/color-name
    PassCulture@1.199.0 -> @react-navigation/bottom-tabs@^6.0.9 -> color@^3.1.3 -> color-convert@^1.9.3 -> color-name@1.1.3
  1.1.4 ~/color-name
    PassCulture@1.199.0 -> @react-navigation/bottom-tabs@^6.0.9 -> color@^3.1.3 -> color-string@^1.6.0 -> color-name@^1.0.0
    PassCulture@1.199.0 -> color-alpha@^1.1.3 -> color-parse@^1.4.1 -> color-name@^1.0.0

fbjs (Found 2 resolved, 2 installed, 3 depended. Latest 3.0.1.)
  0.8.18 ~/recyclerlistview/~/fbjs
    PassCulture@1.199.0 -> react-native-calendars@^1.1284.0 -> recyclerlistview@^3.0.5 -> prop-types@15.5.8 -> fbjs@^0.8.9
  3.0.1 ~/fbjs
    PassCulture@1.199.0 -> react-native-gesture-handler@^1.10.3 -> fbjs@^3.0.0
    PassCulture@1.199.0 -> react-native-web@^0.17.5 -> fbjs@^3.0.0

prop-types (Found 2 resolved, 2 installed, 12 depended. Latest 15.7.2.)
  15.5.8 ~/recyclerlistview/~/prop-types
    PassCulture@1.199.0 -> react-native-calendars@^1.1284.0 -> recyclerlistview@^3.0.5 -> prop-types@15.5.8
  15.7.2 ~/prop-types
    PassCulture@1.199.0 -> react-helmet@^6.1.0 -> prop-types@^15.7.2
    PassCulture@1.199.0 -> react-mobile-picker@^0.1.13 -> prop-types@^15.6.0
    PassCulture@1.199.0 -> react-native-animatable@^1.3.3 -> prop-types@^15.7.2
    PassCulture@1.199.0 -> react-native-calendars@^1.1284.0 -> prop-types@^15.5.10
    PassCulture@1.199.0 -> react-native-country-picker-modal@^2.0.0 -> prop-types@15.7.2
    PassCulture@1.199.0 -> react-native-gesture-handler@^1.10.3 -> prop-types@^15.7.2
    PassCulture@1.199.0 -> react-native-modal@^13.0.0 -> prop-types@^15.6.2
    PassCulture@1.199.0 -> react-native-modal@^13.0.0 -> react-native-animatable@1.3.3 -> prop-types@^15.7.2
    PassCulture@1.199.0 -> react-native-qrcode-svg@^6.1.1 -> prop-types@^15.7.2
    PassCulture@1.199.0 -> react-native-web-swiper@2.2.1 -> prop-types@^15.6.2
    PassCulture@1.199.0 -> react-native-web@^0.17.5 -> prop-types@^15.6.0

query-string (Found 2 resolved, 2 installed, 2 depended. Latest 7.0.1.)
  5.1.1 ~/query-string
    PassCulture@1.199.0 -> amplitude-js@^8.16.1 -> query-string@5
  7.0.1 ~/@react-navigation/core/~/query-string
    PassCulture@1.199.0 -> @react-navigation/native@^6.0.6 -> @react-navigation/core@^6.1.0 -> query-string@^7.0.0

react-is (Found 1 resolved, 2 installed, 2 depended. Latest 16.13.1.)
  16.13.1 ~/@react-navigation/core/~/react-is
    PassCulture@1.199.0 -> @react-navigation/native@^6.0.6 -> @react-navigation/core@^6.1.0 -> react-is@^16.13.0
  16.13.1 ~/hoist-non-react-statics/~/react-is
    PassCulture@1.199.0 -> @sentry/react@^7.8.1 -> hoist-non-react-statics@^3.3.2 -> react-is@^16.7.0

strict-uri-encode (Found 2 resolved, 2 installed, 2 depended. Latest 2.0.0.)
  1.1.0 ~/strict-uri-encode
    PassCulture@1.199.0 -> amplitude-js@^8.16.1 -> query-string@5 -> strict-uri-encode@^1.0.0
  2.0.0 ~/@react-navigation/core/~/strict-uri-encode
    PassCulture@1.199.0 -> @react-navigation/native@^6.0.6 -> @react-navigation/core@^6.1.0 -> query-string@^7.0.0 -> strict-uri-encode@^2.0.0

tslib (Found 2 resolved, 2 installed, 13 depended. Latest 2.3.1.)
  1.14.1 ~/@amplitude/utils/~/tslib
    PassCulture@1.199.0 -> amplitude-js@^8.16.1 -> @amplitude/utils@^1.0.5 -> tslib@^1.9.3
  2.3.1 ~/tslib
    PassCulture@1.199.0 -> @fingerprintjs/fingerprintjs@^3.3.0 -> tslib@^2.0.1
    PassCulture@1.199.0 -> firebase@^9.6.11 -> @firebase/analytics-compat@0.1.9 -> tslib@^2.1.0
    PassCulture@1.199.0 -> firebase@^9.6.11 -> @firebase/analytics@0.7.8 -> tslib@^2.1.0
    PassCulture@1.199.0 -> firebase@^9.6.11 -> @firebase/app-compat@0.1.22 -> tslib@^2.1.0
    PassCulture@1.199.0 -> firebase@^9.6.11 -> @firebase/app@0.7.21 -> tslib@^2.1.0
    PassCulture@1.199.0 -> firebase@^9.6.11 -> @firebase/app@0.7.21 -> @firebase/component@0.5.13 -> tslib@^2.1.0
    PassCulture@1.199.0 -> firebase@^9.6.11 -> @firebase/app@0.7.21 -> @firebase/logger@0.3.2 -> tslib@^2.1.0
    PassCulture@1.199.0 -> firebase@^9.6.11 -> @firebase/app@0.7.21 -> @firebase/util@1.5.2 -> tslib@^2.1.0
    PassCulture@1.199.0 -> firebase@^9.6.11 -> @firebase/firestore-compat@0.1.17 -> tslib@^2.1.0
    PassCulture@1.199.0 -> firebase@^9.6.11 -> @firebase/firestore@3.4.8 -> tslib@^2.1.0
    PassCulture@1.199.0 -> firebase@^9.6.11 -> @firebase/installations@0.5.8 -> tslib@^2.1.0
    PassCulture@1.199.0 -> firebase@^9.6.11 -> @firebase/remote-config@0.3.7 -> tslib@^2.1.0

* Understanding the report: Need help with the details? See:
  https://github.com/FormidableLabs/inspectpack/#diagnosing-duplicates
* Fixing bundle duplicates: An introductory guide:
  https://github.com/FormidableLabs/inspectpack/#fixing-bundle-duplicates
```

You can now try to upgrade the module to optimize what is deduped, 
and open issue on repo so that package maintainer update their dependencies to allow deduping of it.

We strongly advised to read the [Diagnosing duplicates](https://github.com/FormidableLabs/inspectpack#diagnosing-duplicates) part of the module documentation. 
