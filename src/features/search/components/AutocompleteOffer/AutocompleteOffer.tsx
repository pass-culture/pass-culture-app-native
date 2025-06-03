import { SearchGroupNameEnumv2 } from 'api/gen'
import { useAlgoliaSimilarOffers } from 'features/offer/api/useAlgoliaSimilarOffers'
import { Highlight } from 'features/search/components/Highlight/Highlight'
import { CreateHistoryItem } from 'features/search/types'
import { AlgoliaSuggestionHit } from 'libs/algolia/types'
import React, { FunctionComponent } from 'react'
import { UseInfiniteHitsProps } from 'react-instantsearch-core'
import { Text } from 'react-native'
import styled from 'styled-components/native'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { MagnifyingGlassFilled } from 'ui/svg/icons/MagnifyingGlassFilled'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

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
  const suggestedPrompts = [
    'Concert de rap ce weekend à Marseille',
    'Expo à Paris ce soir',
    'Festival en Dordogne cet été',
  ]
  return (
    <React.Fragment>
      <AutocompleteOfferTitleText>Suggestions</AutocompleteOfferTitleText>
      <StyledVerticalUl>
        {suggestedPrompts.map((item) => (
          <Li key={item}>
            <AutocompleteItemTouchable testID={'testID'} onPress={() => {}}>
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
