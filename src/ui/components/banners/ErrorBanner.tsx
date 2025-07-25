import React, { FunctionComponent } from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { GenericColoredBanner } from 'ui/components/banners/GenericColoredBanner'
import { Error } from 'ui/svg/icons/Error'

type Props = {
  message: string
  children?: React.ReactNode
  testID?: string
}

export const ErrorBanner: FunctionComponent<Props> = ({ message, testID, children }) => {
  const { designSystem } = useTheme()
  const Icon = StyledErrorIcon

  return (
    <GenericColoredBanner
      message={message}
      Icon={Icon}
      backgroundColor={designSystem.color.background.error}
      textColor={designSystem.color.text.error}
      testID={testID}>
      {children}
    </GenericColoredBanner>
  )
}

const StyledErrorIcon = styled(Error).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.error,
  size: theme.icons.sizes.small,
}))``
