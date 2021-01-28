import React, { FunctionComponent } from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { IconInterface } from 'ui/svg/icons/types'
import { Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

type SectionRowProps = {
  title: string
  icon: FunctionComponent<IconInterface>
  ctaIconSize?: number
} & (
  | {
      type: 'navigable'
      onPress: () => void
    }
  | {
      type: 'clickable'
      onPress?: () => void
      cta?: JSX.Element
    }
)

export function SectionRow(props: SectionRowProps) {
  const Icon = props.icon

  return (
    <TouchableOpacity
      activeOpacity={props.onPress ? ACTIVE_OPACITY : 1}
      onPress={props.onPress}
      testID="section-row-touchable">
      <Container>
        <IconContainer>
          <Icon />
        </IconContainer>
        <TitleContainer>
          <Typo.ButtonText numberOfLines={1}>{props.title}</Typo.ButtonText>
        </TitleContainer>
        <CTAContainer>
          {props.type == 'navigable' ? (
            <ArrowNext size={props.ctaIconSize || 24} testID="section-row-navigable-icon" />
          ) : (
            props.cta
          )}
        </CTAContainer>
      </Container>
    </TouchableOpacity>
  )
}

const Container = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const IconContainer = styled.View({
  flex: 0.1,
})

const TitleContainer = styled.View({
  flex: 0.65,
})

const CTAContainer = styled.View({
  flex: 0.2,
  alignItems: 'flex-end',
})
