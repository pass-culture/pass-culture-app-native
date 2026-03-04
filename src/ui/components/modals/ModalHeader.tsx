import React, { FunctionComponent } from 'react'
import { LayoutChangeEvent, View } from 'react-native'
import styled from 'styled-components/native'

// eslint-disable-next-line no-restricted-imports
import { ModalSpacing } from 'ui/components/modals/enum'
import { Button } from 'ui/designSystem/Button/Button'
import { Typo } from 'ui/theme'
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
  const RightIcon =
    !!rightIcon &&
    styled(rightIcon).attrs(() => ({
      testID: 'rightIcon',
    }))``

  return (
    <Container onLayout={onLayout} testID="modalHeader" modalSpacing={modalSpacing}>
      <HeaderActionContainer justifyContent="left">
        {leftIcon ? (
          <Button
            iconButton
            variant="tertiary"
            color="neutral"
            icon={leftIcon}
            onPress={onLeftIconPress}
            accessibilityLabel={leftIconAccessibilityLabel}
          />
        ) : null}
      </HeaderActionContainer>
      <TitleContainer>
        <Title numberOfLines={numberOfLines} nativeID={titleID} testID="modalHeaderTitle">
          {title}
        </Title>
      </TitleContainer>
      <HeaderActionContainer justifyContent="right">
        {RightIcon ? (
          <Button
            iconButton
            variant="tertiary"
            color="neutral"
            icon={RightIcon}
            onPress={onRightIconPress}
            accessibilityLabel={rightIconAccessibilityLabel}
          />
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
  paddingHorizontal: theme.designSystem.size.spacing.m,
  flex: 1,
  zIndex: theme.zIndex.modalHeader,
}))

const HeaderActionContainer = styled.View<{ justifyContent: 'left' | 'right' }>(
  ({ theme, justifyContent }) => {
    const headerActionSize = theme.icons.sizes.smaller + theme.designSystem.size.spacing.s
    return {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: justifyContent === 'left' ? 'flex-start' : 'flex-end',
      width: headerActionSize,
      height: headerActionSize,
    }
  }
)

const Title = styled(Typo.Title4).attrs(() => getHeadingAttrs(1))({
  textAlign: 'center',
})
