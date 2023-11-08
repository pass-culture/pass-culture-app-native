import React from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useWhiteStatusBar } from 'libs/hooks/useWhiteStatusBar'
import { BackButton } from 'ui/components/headers/BackButton'
import { CloseButton } from 'ui/components/headers/CloseButton'
import { getSpacing } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'
interface Props {
  title: string
  titleId: string
  onGoBack: () => void
  shouldDisplayBackButton: boolean
  shouldDisplayCloseButton: boolean
  onClose: () => void
}

export const SearchCustomModalHeader: React.FC<Props> = ({
  title,
  titleId,
  onGoBack,
  shouldDisplayBackButton = true,
  shouldDisplayCloseButton,
  onClose,
}) => {
  useWhiteStatusBar()

  const { top } = useCustomSafeInsets()
  const { isDesktopViewport } = useTheme()
  const headerHeight = getSpacing(18) + (isDesktopViewport ? top : 0)

  return (
    <Header>
      <HeaderContent testID="pageHeader" height={headerHeight}>
        <ButtonContainer positionInHeader="left" testID="back-button-container">
          {!!shouldDisplayBackButton && <BackButton onGoBack={onGoBack} color={ColorsEnum.BLACK} />}
        </ButtonContainer>
        <Title nativeID={titleId}>{title}</Title>
        <ButtonContainer positionInHeader="right" testID="close-button-container">
          {!!shouldDisplayCloseButton && <CloseButton onClose={onClose} color={ColorsEnum.BLACK} />}
        </ButtonContainer>
      </HeaderContent>
    </Header>
  )
}

const Header = styled.View.attrs<{ children: React.ReactNode }>({
  accessibilityRole: AccessibilityRole.HEADER,
})({
  width: '100%',
})

const HeaderContent = styled.View<{ height: number }>(({ height, theme }) => ({
  zIndex: theme.zIndex.header,
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  height: height,
}))

const ButtonContainer = styled.View<{ positionInHeader: 'left' | 'right' }>(
  ({ positionInHeader = 'left' }) => ({
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: positionInHeader === 'left' ? 'flex-start' : 'flex-end',
    paddingLeft: getSpacing(3),
    paddingRight: getSpacing(3),
  })
)

const Title = styled.Text.attrs(() => ({
  numberOfLines: 1,
  ...getHeadingAttrs(1),
}))(({ theme }) => ({
  ...theme.typography.body,
  textAlign: 'center',
  color: theme.colors.black,
}))
