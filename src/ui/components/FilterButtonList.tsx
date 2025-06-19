import React, { PropsWithChildren } from 'react'
import { ScrollView, StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { SingleFilterButton } from 'features/search/components/Buttons/SingleFilterButton/SingleFilterButton'
import { Li } from 'ui/components/Li'
import { Ul } from 'ui/components/Ul'
import { Check } from 'ui/svg/icons/Check'
import { getSpacing } from 'ui/theme'

export type FilterButtonListItem = {
  label: string
  onPress: VoidFunction
  isApplied: boolean
  testID?: string
}

type Props = {
  items: FilterButtonListItem[]
  contentContainerStyle?: StyleProp<ViewStyle>
  horizontal?: boolean
} & PropsWithChildren

export const FilterButtonList: React.FC<Props> = ({
  items,
  contentContainerStyle,
  children,
  horizontal = true,
}) => {
  return (
    <ScrollView
      horizontal={horizontal}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={contentContainerStyle}>
      <StyledUl>
        {children}
        {items.map((item) => (
          <StyledLi key={item.testID ? `${item.testID}Li` : item.label}>
            <StyledSingleFilterButton
              label={item.label}
              testID={item.testID}
              onPress={item.onPress}
              isSelected={item.isApplied}
            />
          </StyledLi>
        ))}
      </StyledUl>
    </ScrollView>
  )
}

const StyledUl = styled(Ul)(({ theme }) => ({
  flexDirection: 'row',
  flexWrap: theme.isDesktopViewport ? 'wrap' : undefined,
  maxWidth: theme.isDesktopViewport ? '100%' : undefined,
  justifyContent: theme.isDesktopViewport ? 'center' : undefined,
}))

const StyledLi = styled(Li)({
  marginLeft: getSpacing(1),
  marginTop: getSpacing(1),
  marginBottom: getSpacing(1),
})

const FilterSelectedIcon = styled(Check).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.designSystem.color.icon.default,
}))``

const StyledSingleFilterButton = styled(SingleFilterButton).attrs((props) => ({
  icon: props.isSelected ? (
    <FilterSelectedIcon testID={props.testID ? `${props.testID}Icon` : 'filterButtonIcon'} />
  ) : undefined,
}))``
