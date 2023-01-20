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
}

export const ShareMessagingApp: React.FC<ShareMessagingAppProps> = ({
  network,
}: ShareMessagingAppProps) => {
  const StyledIcon = styled(mapNetworkToRoundIcon[network]).attrs(({ theme }) => ({
    size: theme.buttons.buttonHeights.tall,
  }))``

  const networkDisplayName = network.charAt(0).toUpperCase() + network.slice(1)
  return (
    <IconWithCaption Icon={StyledIcon} caption={'Envoyer sur' + LINE_BREAK + networkDisplayName} />
  )
}

const mapNetworkToRoundIcon: Record<Network, React.FC<AccessibleIcon>> = {
  instagram: InstagramRound,
  messenger: MessengerRound,
  snapchat: SnapchatRound,
  tiktok: TiktokRound,
  whatsapp: WhatsAppRound,
  signal: SignalRound,
  skype: SkypeRound,
  discord: DiscordRound,
  telegram: Telegram,
  twitch: TwitchRound,
  twitter: TwitterRound,
  viber: ViberRound,
  imessage: IMessageRound,
}

type Network =
  | 'instagram'
  | 'messenger'
  | 'snapchat'
  | 'tiktok'
  | 'whatsapp'
  | 'signal'
  | 'skype'
  | 'discord'
  | 'telegram'
  | 'twitch'
  | 'twitter'
  | 'viber'
  | 'imessage'
