import { Network } from 'ui/components/ShareMessagingApp'

export const checkInstalledApps: () => Promise<Record<Network, boolean>> = async () => {
  // ORDERED BY PRIORITY
  // In web, only Whatsapp, Telegram and Twitter are supported because we can't open direct messages in the other platforms
  const networks = {
    [Network.snapchat]: false,
    [Network.instagram]: false,
    [Network.whatsapp]: true,
    [Network.imessage]: false,
    [Network.messenger]: false,
    [Network.telegram]: true,
    [Network.viber]: false,
    [Network.twitter]: true,
  }
  return networks
}
