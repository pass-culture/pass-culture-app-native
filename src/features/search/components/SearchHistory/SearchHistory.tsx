import React from 'react'
import styled from 'styled-components/native'

import { SearchHistoryItem } from 'features/search/components/SearchHistoryItem/SearchHistoryItem'
import { addHighlightedAttribute } from 'features/search/helpers/addHighlightedAttribute/addHighlightedAttribute'
import { Highlighted, HistoryItem } from 'features/search/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { VerticalUl } from 'ui/components/Ul'
import { Close as DefaultClose } from 'ui/svg/icons/Close'
import { Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  history: HistoryItem[]
  queryHistory: string
  removeItem: (item: HistoryItem) => void
  onPress: (item: Highlighted<HistoryItem>) => void
}

export function SearchHistory({ history, queryHistory, removeItem, onPress }: Props) {
  return history.length > 0 ? (
    <React.Fragment>
      <SearchHistoryTitleText>Historique de recherche</SearchHistoryTitleText>

      <StyledVerticalUl>
        {history.map((item) => (
          <Container key={item.createdAt} testID="searchHistoryItem">
            <SearchHistoryItem
              item={addHighlightedAttribute({ item, query: queryHistory })}
              queryHistory={queryHistory}
              onPress={onPress}
            />
            {queryHistory === '' && (
              <RemoveButton
                accessibilityLabel={`Supprimer ${item.label} de l’historique`}
                onPress={() => removeItem(item)}>
                <Close />
              </RemoveButton>
            )}
          </Container>
        ))}
      </StyledVerticalUl>
    </React.Fragment>
  ) : null
}

const StyledVerticalUl = styled(VerticalUl)({
  marginTop: getSpacing(4),
})

const SearchHistoryTitleText = styled(Typo.Caption).attrs(getHeadingAttrs(2))(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: getSpacing(4),
})

const RemoveButton = styledButton(Touchable)({
  maxWidth: getSpacing(10),
  justifyContent: 'center',
  alignItems: 'center',
})

const Close = styled(DefaultClose).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
