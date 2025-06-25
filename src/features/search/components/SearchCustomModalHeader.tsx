import React from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { styledButton } from 'ui/components/buttons/styledButton'
import { BackButton } from 'ui/components/headers/BackButton'
import { CloseButton } from 'ui/components/headers/CloseButton'
import { Typo, getSpacing } from 'ui/theme'
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
  const { top } = useCustomSafeInsets()
  const { isDesktopViewport, designSystem } = useTheme()
  const headerHeight = getSpacing(18) + (isDesktopViewport ? top : 0)

  return (
    <Header>
      <HeaderContent testID="pageHeader" height={headerHeight}>
        <ButtonContainer positionInHeader="left" testID="back-button-container">
          {shouldDisplayBackButton ? (
            <BackButton onGoBack={onGoBack} color={designSystem.color.icon.default} />
          ) : null}
        </ButtonContainer>
        <StyledTitle4 numberOfLines={1} nativeID={titleId} {...getHeadingAttrs(1)}>
          {title}
        </StyledTitle4>
        <ButtonContainer positionInHeader="right" testID="close-button-container">
          {shouldDisplayCloseButton ? (
            <StyledCloseButton onClose={onClose} color={designSystem.color.icon.default} />
          ) : null}
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

const StyledTitle4 = styled(Typo.Title4)({
  textAlign: 'center',
})

const StyledCloseButton = styledButton(CloseButton)({
  width: getSpacing(10),
  height: getSpacing(10),
})
