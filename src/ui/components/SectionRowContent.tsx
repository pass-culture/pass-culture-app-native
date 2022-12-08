import React, { FunctionComponent } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { theme } from 'theme'
import { ArrowNext as DefaultArrowNext } from 'ui/svg/icons/ArrowNext'
import { IconInterface } from 'ui/svg/icons/types'
import { Typo, Spacer } from 'ui/theme'

export type SectionRowContentProps = {
  title: string
  type: 'navigable' | 'clickable'
  accessibilityLabel?: string
  onPress?: () => void
  icon?: FunctionComponent<IconInterface>
  iconSize?: number
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
)

export const SectionRowContent = ({
  title,
  renderTitle,
  icon: Icon,
  iconSize,
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
      {props.type == 'navigable' && (
        <CTAContainer>
          <ArrowNext testID="section-row-navigable-icon" />
        </CTAContainer>
      )}
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

const ArrowNext = styled(DefaultArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
