import React, { FunctionComponent } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { theme } from 'theme'
import { ArrowNext as DefaultArrowNext } from 'ui/svg/icons/ArrowNext'
import { IconInterface } from 'ui/svg/icons/types'
import { Typo, Spacer } from 'ui/theme'

export type SectionRowContentProps = {
  title: string
  accessibilityLabel?: string
  iconSize?: number
  ctaIconSize?: number
  icon?: FunctionComponent<IconInterface>
  style?: StyleProp<ViewStyle>
} & (
  | {
      renderTitle: (title: string) => JSX.Element
      numberOfLines?: never
    }
  | {
      renderTitle?: never
      numberOfLines?: number
    }
) &
  (
    | {
        type: 'navigable'
        onPress?: () => void
      }
    | {
        type: 'clickable'
        onPress?: () => void
        cta?: JSX.Element
      }
  )

export const SectionRowContent = ({
  title,
  renderTitle,
  icon: Icon,
  iconSize,
  ctaIconSize,
  numberOfLines = 2,
  style,
  ...props
}: SectionRowContentProps) => {
  const Title = renderTitle ? (
    renderTitle(title)
  ) : (
    <Typo.ButtonText numberOfLines={numberOfLines}>{title}</Typo.ButtonText>
  )

  return (
    <View style={[styles.container, style]}>
      {!!Icon && (
        <React.Fragment>
          <Icon size={iconSize} color={theme.colors.black} />
          <Spacer.Row numberOfSpaces={2} />
        </React.Fragment>
      )}
      <TitleContainer>{Title}</TitleContainer>
      <CTAContainer>
        {props.type == 'navigable' ? (
          <ArrowNext ctaIconSize={ctaIconSize} testID="section-row-navigable-icon" />
        ) : (
          props.cta
        )}
      </CTAContainer>
    </View>
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

const ArrowNext = styled(DefaultArrowNext).attrs<{ ctaIconSize?: number }>(
  ({ theme, ctaIconSize }) => ({
    size: ctaIconSize || theme.icons.sizes.smaller,
  })
)<{ ctaIconSize?: number }>``
