import React from 'react'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { Network } from 'libs/share/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { IconWithCaption } from 'ui/components/IconWithCaption'
import { Touchable } from 'ui/components/touchable/Touchable'
import { GoogleMessagesRound } from 'ui/svg/icons/socialNetwork/GoogleMessagesRound'
import { IMessageRound } from 'ui/svg/icons/socialNetwork/IMessage'
import { InstagramRound } from 'ui/svg/icons/socialNetwork/InstagramRound'
import { MessengerRound } from 'ui/svg/icons/socialNetwork/MessengerRound'
import { SnapchatRound } from 'ui/svg/icons/socialNetwork/SnapchatRound'
import { Telegram } from 'ui/svg/icons/socialNetwork/Telegram'
import { TwitterRound } from 'ui/svg/icons/socialNetwork/TwitterRound'
import { ViberRound } from 'ui/svg/icons/socialNetwork/ViberRound'
import { WhatsAppRound } from 'ui/svg/icons/socialNetwork/WhatsAppRound'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'

interface ShareMessagingAppProps {
  network: Network
  onPress: () => Promise<void>
  accessibilityLabel?: string
}

export const ShareMessagingApp: React.FC<ShareMessagingAppProps> = ({
  network,
  onPress,
  accessibilityLabel,
}: ShareMessagingAppProps) => {
  const StyledIcon = styled(mapNetworkToRoundIcon[network]).attrs(({ theme }) => ({
    size: theme.buttons.buttonHeights.tall,
  }))``

  const captionStarting = network === Network.googleMessages ? 'Envoyer par' : 'Envoyer sur'
  const caption = captionStarting + LINE_BREAK + network
  const computedAccessibilityLabel = accessibilityLabel ?? `${captionStarting} ${network}`

  return (
    <MessagingAppButtonContainer
      onPress={onPress}
      accessibilityRole={AccessibilityRole.LINK}
      accessibilityLabel={computedAccessibilityLabel}>
      <IconWithCaption Icon={StyledIcon} caption={caption} />
    </MessagingAppButtonContainer>
  )
}

const mapNetworkToRoundIcon: Record<Network, React.FC<AccessibleIcon>> = {
  [Network.googleMessages]: GoogleMessagesRound,
  [Network.imessage]: IMessageRound,
  [Network.instagram]: InstagramRound,
  [Network.messenger]: MessengerRound,
  [Network.snapchat]: SnapchatRound,
  [Network.telegram]: Telegram,
  [Network.twitter]: TwitterRound,
  [Network.viber]: ViberRound,
  [Network.whatsapp]: WhatsAppRound,
}

const MESSAGING_BUTTON_HEIGHT = getSpacing(24)
export const MESSAGING_BUTTON_WIDTH = getSpacing(19)
export const MessagingAppButtonContainer = styledButton(Touchable)({
  minHeight: MESSAGING_BUTTON_HEIGHT,
  width: MESSAGING_BUTTON_WIDTH,
  alignItems: 'center',
})
