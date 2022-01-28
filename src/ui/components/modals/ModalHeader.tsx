import React, { FunctionComponent } from 'react'
import { LayoutChangeEvent } from 'react-native'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'tests/utils'
import { getSpacing, Typo } from 'ui/theme'

import { ModalIconProps } from './types'

type ModalHeaderProps = {
  title: string
  boldTitle?: boolean
  numberOfLines?: number
  onLayout?: (event: LayoutChangeEvent) => void
} & ModalIconProps

export const ModalHeader: FunctionComponent<ModalHeaderProps> = ({
  title,
  leftIcon: LeftIcon,
  leftIconAccessibilityLabel = 'Revenir en arrière',
  onLeftIconPress,
  rightIcon: RightIcon,
  rightIconAccessibilityLabel = 'Fermer la modale',
  onRightIconPress,
  boldTitle = false,
  numberOfLines = 2,
  onLayout,
}) => {
  const TitleComponent = boldTitle ? BoldTitle : Title
  return (
    <Container onLayout={onLayout} testID="modalHeader">
      <LeftHeaderActionContainer>
        {!!LeftIcon && (
          <HeaderAction
            onPress={onLeftIconPress}
            {...accessibilityAndTestId(leftIconAccessibilityLabel)}>
            <LeftIcon size={getSpacing(5)} testID="leftIcon" />
          </HeaderAction>
        )}
      </LeftHeaderActionContainer>
      <TitleContainer>
        <TitleComponent numberOfLines={numberOfLines}>{title}</TitleComponent>
      </TitleContainer>
      <RightHeaderActionContainer>
        {!!RightIcon && (
          <HeaderAction
            onPress={onRightIconPress}
            {...accessibilityAndTestId(rightIconAccessibilityLabel)}>
            <RightIcon size={getSpacing(5)} testID="rightIcon" />
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

const Title = styled(Typo.Title4)({ textAlign: 'center' })
const BoldTitle = styled(Typo.Title3)({ textAlign: 'center' })
