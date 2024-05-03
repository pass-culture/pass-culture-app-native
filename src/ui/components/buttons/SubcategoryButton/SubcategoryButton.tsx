import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { getSearchStackConfig } from 'features/navigation/SearchStackNavigator/helpers'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getShadow, Typo } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'
import { getSpacing } from 'ui/theme/spacing'

type SubcategoryButtonProps = {
  label: string
  colors: (string | number)[]
  accessibilityLabel?: string
}
const HEIGHT = getSpacing(14)

export const SubcategoryButton = ({
  label,
  accessibilityLabel,
  colors,
}: SubcategoryButtonProps) => {
  const searchStackConfig = getSearchStackConfig('SearchResults')
  return (
    <StyledTouchable
      navigateTo={{
        screen: searchStackConfig[0],
        params: searchStackConfig[1],
      }}
      testID={`SubcategoryButton ${label}`}
      accessibilityLabel={accessibilityLabel}>
      <Color colors={colors} />
      <TextContainer>
        <StyledText>{label}</StyledText>
      </TextContainer>
    </StyledTouchable>
  )
}

const StyledTouchable: typeof InternalTouchableLink = styled(InternalTouchableLink)<{
  isFocus?: boolean
}>(({ theme, isFocus }) => ({
  maxWidth: getSpacing(39),
  height: HEIGHT,
  borderRadius: theme.borderRadius.radius,
  borderRightWidth: 1,
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderColor: theme.colors.greySemiDark,
  backgroundColor: theme.colors.white,
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
  ...getShadow({
    shadowOffset: { width: 0, height: getSpacing(1) },
    shadowRadius: getSpacing(1),
    shadowColor: theme.colors.greyDark,
    shadowOpacity: 0.2,
  }),
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
}))

const Color = styled(LinearGradient)(({ theme }) => ({
  top: 0,
  left: 0,
  height: HEIGHT,
  width: getSpacing(2),
  borderTopLeftRadius: theme.borderRadius.radius,
  borderBottomLeftRadius: theme.borderRadius.radius,
}))

const TextContainer = styled.View({
  flexShrink: 1,
  justifyContent: 'center',
  padding: getSpacing(4),
  paddingLeft: getSpacing(2),
  flexWrap: 'wrap',
  textAlign: 'left',
})

const StyledText = styled(Typo.Caption).attrs({
  ellipsizeMode: 'tail',
  numberOfLines: 2,
})<{ isHover?: boolean }>(({ theme, isHover }) => ({
  ...getHoverStyle(theme.colors.black, isHover),
}))
