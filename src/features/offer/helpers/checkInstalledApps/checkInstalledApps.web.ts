import { Network } from 'ui/components/ShareMessagingApp'

export const checkInstalledApps: () => Promise<Record<Network, boolean>> = async () => {
  // ORDERED BY PRIORITY
  const networks = {
    [Network.snapchat]: true,
    [Network.instagram]: true,
    [Network.whatsapp]: true,
    [Network.imessage]: true,
    [Network.messenger]: true,
    [Network.telegram]: true,
    [Network.viber]: true,
  }
  return networks
}
