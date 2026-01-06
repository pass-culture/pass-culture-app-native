## Offline mode

Due to `OfflineModeContainer.tsx` an offline screen is displayed when you are offline 

### react-query

By default, react-query only triggers queries when the network is online. However, for this to work on RN, it still needs to be told when the network is available, which is done globally via the `onlineManager` in `NetInfoWrapper.tsx`.

