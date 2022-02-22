import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import { LayoutChangeEvent } from 'react-native'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typography'

import { ModalIconProps } from './types'

type ModalHeaderProps = {
  title: string
  boldTitle?: boolean
  numberOfLines?: number
  onLayout?: (event: LayoutChangeEvent) => void
  accessibilityDescribedBy?: string
} & ModalIconProps

export const ModalHeader: FunctionComponent<ModalHeaderProps> = ({
  title,
  leftIcon,
  leftIconAccessibilityLabel = t`Revenir en arrière`,
  onLeftIconPress,
  rightIcon,
  rightIconAccessibilityLabel = t`Fermer la modale`,
  onRightIconPress,
  boldTitle = false,
  numberOfLines = 2,
  onLayout,
  accessibilityDescribedBy,
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
    <Container onLayout={onLayout} testID="modalHeader">
      <LeftHeaderActionContainer>
        {!!LeftIcon && (
          <HeaderAction
            onPress={onLeftIconPress}
            {...accessibilityAndTestId(leftIconAccessibilityLabel)}>
            <LeftIcon testID="leftIcon" />
          </HeaderAction>
        )}
      </LeftHeaderActionContainer>
      <TitleContainer>
        <TitleComponent numberOfLines={numberOfLines} nativeID={accessibilityDescribedBy}>
          {title}
        </TitleComponent>
      </TitleContainer>
      <RightHeaderActionContainer>
        {!!RightIcon && (
          <HeaderAction
            onPress={onRightIconPress}
            {...accessibilityAndTestId(rightIconAccessibilityLabel)}>
            <RightIcon testID="rightIcon" />
          </HeaderAction>
        )}
      </RightHeaderActionContainer>
    </Container>
  )
}

const Container = styled.View({
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'center',
})

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

const HeaderAction = styled.TouchableOpacity({
  padding: getSpacing(1),
})

const Title = styled(Typo.Title4).attrs(() => getHeadingAttrs(1))({
  textAlign: 'center',
})
const BoldTitle = styled(Typo.Title3).attrs(() => getHeadingAttrs(1))({
  textAlign: 'center',
})
