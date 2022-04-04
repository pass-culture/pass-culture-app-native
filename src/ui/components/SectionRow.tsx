import React, { FunctionComponent } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { AllNavParamList } from 'features/navigation/RootNavigator'
import { ArrowNext as DefaultArrowNext } from 'ui/svg/icons/ArrowNext'
import { IconInterface } from 'ui/svg/icons/types'
import { Typo, Spacer } from 'ui/theme'
import { TouchableLink } from 'ui/web/link/TouchableLink'
import { To } from 'ui/web/link/types'

type SectionRowProps = {
  title: string
  accessibilityLabel?: string
  renderTitle?: (title: string) => JSX.Element
  iconSize?: number
  ctaIconSize?: number
  icon?: FunctionComponent<IconInterface>
  style?: StyleProp<ViewStyle>
  numberOfLines?: number
  to?: To<AllNavParamList, keyof AllNavParamList>
  externalHref?: string
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

  const ArrowNext = styled(DefaultArrowNext).attrs(({ theme }) => ({
    size: props.ctaIconSize || theme.icons.sizes.smaller,
  }))``
  return (
    <TouchableLink
      activeOpacity={props.onPress ? activeOpacity : 1}
      onPress={props.onPress}
      disabled={!props.onPress}
      accessibilityLabel={props.accessibilityLabel}
      to={props.to}
      externalHref={props.externalHref}>
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
            <ArrowNext testID="section-row-navigable-icon" />
          ) : (
            props.cta
          )}
        </CTAContainer>
      </View>
    </TouchableLink>
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
