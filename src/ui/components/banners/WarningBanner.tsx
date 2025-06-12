import React, { FunctionComponent } from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { GenericColoredBanner } from 'ui/components/banners/GenericColoredBanner'
import { Warning } from 'ui/svg/icons/BicolorWarning'

type Props = {
  message: string
  children?: React.ReactNode
  testID?: string
}

export const WarningBanner: FunctionComponent<Props> = ({ message, testID, children }) => {
  const theme = useTheme()

  return (
    <GenericColoredBanner
      message={message}
      Icon={GreyWarning}
      backgroundColor={theme.designSystem.color.background.warning}
      textColor={theme.designSystem.color.text.warning}
      testID={testID}>
      {children}
    </GenericColoredBanner>
  )
}

const GreyWarning = styled(Warning).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.warning,
  color2: theme.designSystem.color.icon.warning,
  size: theme.icons.sizes.small,
}))``
