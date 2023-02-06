import React from 'react'
import styled from 'styled-components/native'

import { IconWithCaption } from 'ui/components/IconWithCaption'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { IMessageRound } from 'ui/svg/icons/socialNetwork/IMessage'
import { InstagramRound } from 'ui/svg/icons/socialNetwork/InstagramRound'
import { MessengerRound } from 'ui/svg/icons/socialNetwork/MessengerRound'
import { SnapchatRound } from 'ui/svg/icons/socialNetwork/SnapchatRound'
import { Telegram } from 'ui/svg/icons/socialNetwork/Telegram'
import { ViberRound } from 'ui/svg/icons/socialNetwork/ViberRound'
import { WhatsAppRound } from 'ui/svg/icons/socialNetwork/WhatsAppRound'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { LINE_BREAK } from 'ui/theme/constants'

interface ShareMessagingAppProps {
  network: Network
  onPress: () => Promise<void>
}

export const ShareMessagingApp: React.FC<ShareMessagingAppProps> = ({
  network,
  onPress,
}: ShareMessagingAppProps) => {
  const StyledIcon = styled(mapNetworkToRoundIcon[network]).attrs(({ theme }) => ({
    size: theme.buttons.buttonHeights.tall,
  }))``

  return (
    <TouchableOpacity onPress={onPress}>
      <IconWithCaption Icon={StyledIcon} caption={'Envoyer sur' + LINE_BREAK + network} />
    </TouchableOpacity>
  )
}

export enum Network {
  imessage = 'iMessage',
  instagram = 'Instagram',
  messenger = 'Messenger',
  snapchat = 'Snapchat',
  telegram = 'Telegram',
  viber = 'Viber',
  whatsapp = 'WhatsApp',
}

const mapNetworkToRoundIcon: Record<Network, React.FC<AccessibleIcon>> = {
  [Network.instagram]: InstagramRound,
  [Network.messenger]: MessengerRound,
  [Network.snapchat]: SnapchatRound,
  [Network.whatsapp]: WhatsAppRound,
  [Network.telegram]: Telegram,
  [Network.viber]: ViberRound,
  [Network.imessage]: IMessageRound,
}
