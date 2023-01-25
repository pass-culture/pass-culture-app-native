import React from 'react'
import styled from 'styled-components/native'

import { IconWithCaption } from 'ui/components/IconWithCaption'
import { DiscordRound } from 'ui/svg/icons/socialNetwork/DiscordRound'
import { IMessageRound } from 'ui/svg/icons/socialNetwork/IMessage'
import { InstagramRound } from 'ui/svg/icons/socialNetwork/InstagramRound'
import { MessengerRound } from 'ui/svg/icons/socialNetwork/MessengerRound'
import { SignalRound } from 'ui/svg/icons/socialNetwork/SignalRound'
import { SkypeRound } from 'ui/svg/icons/socialNetwork/SkypeRound'
import { SnapchatRound } from 'ui/svg/icons/socialNetwork/SnapchatRound'
import { Telegram } from 'ui/svg/icons/socialNetwork/Telegram'
import { TiktokRound } from 'ui/svg/icons/socialNetwork/TiktokRound'
import { TwitchRound } from 'ui/svg/icons/socialNetwork/TwitchRound'
import { TwitterRound } from 'ui/svg/icons/socialNetwork/TwitterRound'
import { ViberRound } from 'ui/svg/icons/socialNetwork/ViberRound'
import { WhatsAppRound } from 'ui/svg/icons/socialNetwork/WhatsAppRound'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { LINE_BREAK } from 'ui/theme/constants'

interface ShareMessagingAppProps {
  network: Network
  visible: boolean
}

export const ShareMessagingApp: React.FC<ShareMessagingAppProps> = ({
  network,
  visible,
}: ShareMessagingAppProps) => {
  const StyledIcon = styled(mapNetworkToRoundIcon[network]).attrs(({ theme }) => ({
    size: theme.buttons.buttonHeights.tall,
  }))``

  return visible ? (
    <IconWithCaption Icon={StyledIcon} caption={'Envoyer sur' + LINE_BREAK + network} />
  ) : null
}

export enum Network {
  discord = 'Discord',
  imessage = 'iMessage',
  instagram = 'Instagram',
  messenger = 'Messenger',
  signal = 'Signal',
  skype = 'Skype',
  snapchat = 'Snapchat',
  telegram = 'Telegram',
  tiktok = 'TikTok',
  twitch = 'Twitch',
  twitter = 'Twitter',
  viber = 'Viber',
  whatsapp = 'WhatsApp',
}

const mapNetworkToRoundIcon: Record<Network, React.FC<AccessibleIcon>> = {
  [Network.instagram]: InstagramRound,
  [Network.messenger]: MessengerRound,
  [Network.snapchat]: SnapchatRound,
  [Network.tiktok]: TiktokRound,
  [Network.whatsapp]: WhatsAppRound,
  [Network.signal]: SignalRound,
  [Network.skype]: SkypeRound,
  [Network.discord]: DiscordRound,
  [Network.telegram]: Telegram,
  [Network.twitch]: TwitchRound,
  [Network.twitter]: TwitterRound,
  [Network.viber]: ViberRound,
  [Network.imessage]: IMessageRound,
}
