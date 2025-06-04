import { SearchGroupNameEnumv2 } from 'api/gen'
import { CreateHistoryItem } from 'features/search/types'
import React from 'react'
import { Keyboard, Text } from 'react-native'
import { UseInfiniteHitsProps } from 'react-instantsearch-core'
import styled from 'styled-components/native'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { MagnifyingGlassFilled } from 'ui/svg/icons/MagnifyingGlassFilled'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { useNavigateToSearch } from 'features/search/helpers/useNavigateToSearch/useNavigateToSearch'
import { useSearch } from 'features/search/context/SearchWrapper'

type AutocompleteOfferProps = UseInfiniteHitsProps & {
  addSearchHistory: (item: CreateHistoryItem) => void
  offerCategories?: SearchGroupNameEnumv2[]
  shouldShowCategory?: boolean
}

export function AutocompleteOffer({
  addSearchHistory,
  offerCategories,
  ...props
}: AutocompleteOfferProps) {
  const { searchState } = useSearch()
  const { navigateToSearch } = useNavigateToSearch('AISearchResults')
  const onPress = () => {
    Keyboard.dismiss()
    navigateToSearch(searchState)
  }
  const suggestedPrompts = [
    'Les festivals à faire autour de Brest',
    'Les expos de ce week-end à Paris',
    'Le spectacle de stand-up ce week-end près de chez moi',
    'Les sorties à faire en famille cet été à Marseille',
  ]
  return (
    <React.Fragment>
      <AutocompleteOfferTitleText>Suggestions</AutocompleteOfferTitleText>
      <StyledVerticalUl>
        {suggestedPrompts.map((item) => (
          <Li key={item}>
            <AutocompleteItemTouchable testID={'testID'} onPress={onPress}>
              <MagnifyingGlassIconContainer>
                <MagnifyingGlassFilledIcon />
              </MagnifyingGlassIconContainer>
              <StyledText numberOfLines={1} ellipsizeMode="tail">
                <Typo.Body testID="highlightedText">{item}</Typo.Body>
              </StyledText>
            </AutocompleteItemTouchable>
          </Li>
        ))}
      </StyledVerticalUl>
    </React.Fragment>
  )
}

const StyledVerticalUl = styled(VerticalUl)({
  marginTop: getSpacing(4),
})

const AutocompleteOfferTitleText = styled(Typo.BodyAccentXs).attrs(getHeadingAttrs(2))(
  ({ theme }) => ({
    color: theme.colors.greyDark,
  })
)

const MagnifyingGlassIconContainer = styled.View({ flexShrink: 0 })

const AutocompleteItemTouchable = styled.TouchableOpacity({
  flexDirection: 'row',
  alignItems: 'center',
  paddingBottom: getSpacing(4),
})

const MagnifyingGlassFilledIcon = styled(MagnifyingGlassFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.colors.greyDark,
}))``

const StyledText = styled(Text)({
  marginLeft: getSpacing(2),
})
