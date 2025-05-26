import React, { FunctionComponent } from 'react'
import { LayoutChangeEvent, View } from 'react-native'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
// eslint-disable-next-line no-restricted-imports
import { ModalSpacing } from 'ui/components/modals/enum'
import { Touchable } from 'ui/components/touchable/Touchable'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { ModalIconProps } from './types'

type ModalHeaderProps = {
  title: string
  titleID?: string
  numberOfLines?: number
  modalSpacing?: ModalSpacing
  onLayout?: (event: LayoutChangeEvent) => void
} & ModalIconProps

export const ModalHeader: FunctionComponent<ModalHeaderProps> = ({
  title,
  titleID,
  leftIcon,
  leftIconAccessibilityLabel = 'Revenir en arrière',
  onLeftIconPress,
  rightIcon,
  rightIconAccessibilityLabel = 'Fermer la modale',
  onRightIconPress,
  numberOfLines = 2,
  modalSpacing,
  onLayout,
}) => {
  const LeftIcon =
    !!leftIcon &&
    styled(leftIcon).attrs(({ theme }) => ({
      size: theme.icons.sizes.smaller,
      color: theme.designSystem.color.icon.default,
    }))``
  const RightIcon =
    !!rightIcon &&
    styled(rightIcon).attrs(({ theme }) => ({
      size: theme.icons.sizes.smaller,
      color: theme.designSystem.color.icon.default,
    }))``

  return (
    <Container onLayout={onLayout} testID="modalHeader" modalSpacing={modalSpacing}>
      <HeaderActionContainer justifyContent="left">
        {LeftIcon ? (
          <HeaderAction onPress={onLeftIconPress} accessibilityLabel={leftIconAccessibilityLabel}>
            <LeftIcon />
            <HiddenAccessibleText>Retour</HiddenAccessibleText>
          </HeaderAction>
        ) : null}
      </HeaderActionContainer>
      <TitleContainer>
        <Title numberOfLines={numberOfLines} nativeID={titleID} testID="modalHeaderTitle">
          {title}
        </Title>
      </TitleContainer>
      <HeaderActionContainer justifyContent="right">
        {RightIcon ? (
          <HeaderAction onPress={onRightIconPress} accessibilityLabel={rightIconAccessibilityLabel}>
            <RightIcon testID="rightIcon" />
          </HeaderAction>
        ) : null}
      </HeaderActionContainer>
    </Container>
  )
}

const Container = styled(View)<{ modalSpacing?: ModalSpacing }>(({ modalSpacing }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'center',
  ...(modalSpacing ? { padding: modalSpacing } : {}),
}))

const TitleContainer = styled.View(({ theme }) => ({
  justifyContent: 'center',
  paddingHorizontal: getSpacing(3),
  flex: 1,
  zIndex: theme.zIndex.modalHeader,
}))

const HeaderActionContainer = styled.View<{ justifyContent: 'left' | 'right' }>(
  ({ theme, justifyContent }) => {
    const headerActionSize = theme.icons.sizes.smaller + getSpacing(2)
    return {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: justifyContent === 'left' ? 'flex-start' : 'flex-end',
      width: headerActionSize,
      height: headerActionSize,
    }
  }
)

const HeaderAction = styledButton(Touchable)({
  padding: getSpacing(1),
})

const Title = styled(Typo.Title4).attrs(() => getHeadingAttrs(1))({
  textAlign: 'center',
})
