import React, { FunctionComponent } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle, TouchableOpacity } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { accessibilityAndTestId } from 'tests/utils'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { IconInterface } from 'ui/svg/icons/types'
import { Typo, Spacer } from 'ui/theme'

type SectionRowProps = {
  title: string
  accessibilityLabel?: string
  renderTitle?: (title: string) => JSX.Element
  iconSize?: number
  ctaIconSize?: number
  icon?: FunctionComponent<IconInterface>
  style?: StyleProp<ViewStyle>
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
  const { activeOpacity } = useTheme()
  const Icon = props.icon
  const numberOfLines = props.numberOfLines || 2

  const title = props.renderTitle ? (
    props.renderTitle(props.title)
  ) : (
    <Typo.ButtonText numberOfLines={numberOfLines}>{props.title}</Typo.ButtonText>
  )

  const accessibilityLabel = props.accessibilityLabel || props.title
  return (
    <TouchableOpacity
      onPress={props.onPress}
      activeOpacity={props.onPress ? activeOpacity : 1}
      {...accessibilityAndTestId(accessibilityLabel)}>
      <View style={[styles.container, props.style]}>
        {!!Icon && (
          <React.Fragment>
            <Icon size={props.iconSize} />
            <Spacer.Row numberOfSpaces={2} />
          </React.Fragment>
        )}
        <TitleContainer>{title}</TitleContainer>
        <CTAContainer>
          {props.type == 'navigable' ? (
            <ArrowNext size={props.ctaIconSize || 20} testID="section-row-navigable-icon" />
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
  textAlign: 'left',
})

const CTAContainer = styled.View({
  alignItems: 'flex-end',
})
