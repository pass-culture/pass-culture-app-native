// useNetwork is used on mobile to disable network requests when the user is offline.
// (example: `enabled: network.isConnected`)
// by default on mobile, upon initialization, whilst networkInfo.isConnected is null,
// we consider that we don't have network yet. This is useful when we start the application without network
// since it would crash if trying to do a network request while offline.

// on web, we don't have caching and we don't use network connection info.
// if the network is down, we just let the query fail (this will not crash)
export const useNetwork = () => {
  return { isConnected: true }
}
