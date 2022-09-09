import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import { LayoutChangeEvent } from 'react-native'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { styledButton } from 'ui/components/buttons/styledButton'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { Touchable } from 'ui/components/touchable/Touchable'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { ModalIconProps } from './types'

export type ModalHeaderProps = {
  title: string
  titleID?: string
  boldTitle?: boolean
  numberOfLines?: number
  padding?: number
  onLayout?: (event: LayoutChangeEvent) => void
} & ModalIconProps

export const ModalHeader: FunctionComponent<ModalHeaderProps> = ({
  title,
  titleID,
  leftIcon,
  leftIconAccessibilityLabel = t`Revenir en arrière`,
  onLeftIconPress,
  rightIcon,
  rightIconAccessibilityLabel = t`Fermer la modale`,
  onRightIconPress,
  boldTitle = false,
  numberOfLines = 2,
  padding,
  onLayout,
}) => {
  const TitleComponent = boldTitle ? BoldTitle : Title
  const LeftIcon =
    !!leftIcon &&
    styled(leftIcon).attrs(({ theme }) => ({
      size: theme.icons.sizes.smaller,
    }))``
  const RightIcon =
    !!rightIcon &&
    styled(rightIcon).attrs(({ theme }) => ({
      size: theme.icons.sizes.smaller,
    }))``

  return (
    <Container onLayout={onLayout} testID="modalHeader" padding={padding}>
      <LeftHeaderActionContainer>
        {!!LeftIcon && (
          <HeaderAction onPress={onLeftIconPress} testID={leftIconAccessibilityLabel}>
            <LeftIcon {...accessibilityAndTestId(leftIconAccessibilityLabel, 'leftIcon')} />
            <HiddenAccessibleText>{t`Retour`}</HiddenAccessibleText>
          </HeaderAction>
        )}
      </LeftHeaderActionContainer>
      <TitleContainer>
        <TitleComponent numberOfLines={numberOfLines} nativeID={titleID}>
          {title}
        </TitleComponent>
      </TitleContainer>
      <RightHeaderActionContainer>
        {!!RightIcon && (
          <HeaderAction onPress={onRightIconPress} testID={rightIconAccessibilityLabel}>
            <RightIcon {...accessibilityAndTestId(rightIconAccessibilityLabel, 'rightIcon')} />
          </HeaderAction>
        )}
      </RightHeaderActionContainer>
    </Container>
  )
}

const Container = styled.View<{ padding?: number }>(({ padding }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'center',
  ...(padding ? { padding } : {}),
}))

const TitleContainer = styled.View(({ theme }) => ({
  justifyContent: 'center',
  paddingRight: getSpacing(3),
  paddingLeft: getSpacing(3),
  flex: 0.8,
  zIndex: theme.zIndex.modalHeader,
}))

const LeftHeaderActionContainer = styled.View({
  flexDirection: 'row',
  flex: 0.1,
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
})

const RightHeaderActionContainer = styled.View({
  flexDirection: 'row',
  flex: 0.1,
  alignItems: 'flex-start',
  justifyContent: 'flex-end',
})

const HeaderAction = styledButton(Touchable)({
  padding: getSpacing(1),
})

const Title = styled(Typo.Title4).attrs(() => getHeadingAttrs(1))({
  textAlign: 'center',
})
const BoldTitle = styled(Typo.Title3).attrs(() => getHeadingAttrs(1))({
  textAlign: 'center',
})
