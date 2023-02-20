import React, { useState, useEffect } from 'react'
import { Linking } from 'react-native'
import Share, { ShareSingleOptions, Social } from 'react-native-share'

import { MessagingAppContainer } from 'features/offer/components/shareMessagingOffer/MessagingAppContainer'
import { checkInstalledApps } from 'features/offer/helpers/checkInstalledApps/checkInstalledApps'
import { getOfferUrl } from 'features/share/helpers/getOfferUrl'
import { useShareOfferMessage } from 'features/share/helpers/useShareOfferMessage'
import { Network, ShareMessagingApp } from 'ui/components/ShareMessagingApp'

export const MAX_NB_OF_SOCIALS_TO_SHOW = 3

export const InstalledMessagingApps = ({ offerId }: { offerId: number }) => {
  const [installedApps, setInstalledApps] = useState<Network[]>([])
  const shareMessage = useShareOfferMessage(offerId)
  const shareUrl = getOfferUrl(offerId)

  useEffect(() => {
    checkInstalledApps()
      .then((result) => {
        const apps = Object.keys(result) as Network[]
        setInstalledApps(apps.filter((app) => result[app]).slice(0, MAX_NB_OF_SOCIALS_TO_SHOW))
      })
      .catch((error) => {
        throw new Error(error)
      })
  }, [])

  if (!shareMessage) return null

  return (
    <React.Fragment>
      {installedApps.map((network) => {
        const {
          shouldEncodeURI,
          supportsURL = true,
          isNative,
          ...options
        } = mapNetworkToSocial[network]
        // Message has to be concatenated with url if url option is not supported
        const message = supportsURL ? shareMessage : shareMessage + '\n' + shareUrl

        const onPress = async () => {
          if (isNative && options.url) await Linking.openURL(options.url + message)
          else {
            await Share.shareSingle({
              message: shouldEncodeURI ? encodeURI(message) : message,
              url: supportsURL ? shareUrl : undefined,
              ...options,
            })
          }
        }

        return (
          <MessagingAppContainer key={network}>
            <ShareMessagingApp network={network} onPress={onPress} />
          </MessagingAppContainer>
        )
      })}
    </React.Fragment>
  )
}

const mapNetworkToSocial: Record<
  Network,
  ShareSingleOptions & { shouldEncodeURI?: boolean; supportsURL?: boolean; isNative?: boolean }
> = {
  [Network.instagram]: { social: Social.Instagram, supportsURL: false, shouldEncodeURI: true },
  [Network.messenger]: { social: Social.Messenger },
  [Network.snapchat]: { social: Social.Snapchat },
  [Network.whatsapp]: { social: Social.Whatsapp },
  [Network.telegram]: { social: Social.Telegram },
  [Network.viber]: {
    social: Social.Viber,
    supportsURL: false,
  },
  [Network.imessage]: {
    social: Social.Sms,
    isNative: true,
    supportsURL: false,
    url: 'sms://&body=',
  },
}
