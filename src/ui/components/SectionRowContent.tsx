import React, { FunctionComponent } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { theme } from 'theme'
import { ArrowNext as DefaultArrowNext } from 'ui/svg/icons/ArrowNext'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Spacer, TypoDS } from 'ui/theme'

export type SectionRowContentProps = {
  title: string
  type: 'navigable' | 'clickable'
  accessibilityLabel?: string
  onPress?: () => void
  icon?: FunctionComponent<AccessibleIcon>
  iconSize?: number
  style?: StyleProp<ViewStyle>
} & (
  | {
      renderTitle: (title: string) => React.JSX.Element
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
    <TypoDS.BodyAccent numberOfLines={numberOfLines}>{title}</TypoDS.BodyAccent>
  )

  return (
    <View style={[styles.container, style]}>
      {Icon ? (
        <React.Fragment>
          <Icon size={iconSize} color={theme.colors.black} />
          <Spacer.Row numberOfSpaces={2} />
        </React.Fragment>
      ) : null}
      <TitleContainer>{Title}</TitleContainer>
      {props.type == 'navigable' ? (
        <CTAContainer>
          <ArrowNext testID="section-row-navigable-icon" />
        </CTAContainer>
      ) : null}
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
