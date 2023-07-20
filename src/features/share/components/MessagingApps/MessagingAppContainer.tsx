import styled from 'styled-components/native'

import { Li } from 'ui/components/Li'
import { MESSAGING_BUTTON_WIDTH } from 'ui/components/ShareMessagingApp'
import { getSpacing } from 'ui/theme'

export const MessagingAppContainer = styled(Li)(({ theme }) => {
  // We compute the number of buttons that can fit in one row. If the screen is too small for one button (which is unlikely), we still display one button per row
  const nbOfButtonsInRow =
    Math.floor(
      (theme.appContentWidth - 2 * theme.contentPage.marginHorizontal) / MESSAGING_BUTTON_WIDTH
    ) || 1

  return {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: `${100 / nbOfButtonsInRow}%`,
    maxWidth: MESSAGING_BUTTON_WIDTH,
    marginBottom: getSpacing(5),
    marginHorizontal: getSpacing(1),
  }
})
