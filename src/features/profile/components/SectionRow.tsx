import React, { FunctionComponent } from 'react'
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

type SectionRowProps = {
  title: string
  ctaIconSize?: number
  icon?: FunctionComponent<IconInterface>
  style?: StyleProp<ViewStyle>
  testID?: string
  numberOfLines?: number
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
  const numberOfLines = props.numberOfLines || 2
  return (
    <TouchableOpacity
      activeOpacity={props.onPress ? ACTIVE_OPACITY : 1}
      onPress={props.onPress}
      testID={props.testID ? props.testID : 'section-row-touchable'}>
      <View style={[styles.container, props.style]}>
        {Icon && <Icon />}
        <TitleContainer>
          <Typo.ButtonText numberOfLines={numberOfLines}>{props.title}</Typo.ButtonText>
        </TitleContainer>
        <CTAContainer>
          {props.type == 'navigable' ? (
            <ArrowNext size={props.ctaIconSize || 24} testID="section-row-navigable-icon" />
          ) : (
            props.cta
          )}
        </CTAContainer>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

const TitleContainer = styled.View({
  flex: 1,
  marginHorizontal: getSpacing(1),
  textAlign: 'left',
})

const CTAContainer = styled.View({
  alignItems: 'flex-end',
})
