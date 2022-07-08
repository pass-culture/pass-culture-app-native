## Offline mode

### react-query

Due to the presence of an `AsyncErrorBoundary` catching all rendering error, if a `useQuery` fail to receive its data, 
it will show a `GenericErrorPage` with a `retry` button.

Since we support offline mode, it is necessary to prevent this to happen when offline, to set the `enable` option of `useQuery` to:

```bash
const netInfo = useNetInfo()
const enabled = !!netInfo.isConnected
``` 

This way, the request will be enabled only when we have a network interface.

In some case, the network interface doesn't mean you have internet, which can cause some request to fail when running.

On the other hand, testing if internet is reachable will cause interruption of the user experience, for example, reading the home page.

For this reason, it is not recommended at the moment to do so:  

```bash
const netInfo = useNetInfo()
const enabled = !!netInfo.isConnected && !!netInfo.isInternetReachable
``` 

We prefer to let the `GenericErrorPage` render, and `retry` if necessary.

If you need to refetch on reconnect, like for `Bookings`, then it makes sens to test `netInfo.isInternetReachable`, 
otherwise you'll have a generic error page and in this case, it's better not to refetch on reconnect.

## Important

Some `useQuery` does not rely on a page, like `useAppSettings`, such hooks needs to test if `netInfo.isInternetReachable`, otherwise it will break other views.
