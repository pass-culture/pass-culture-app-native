import React from 'react'
import styled from 'styled-components/native'

import { SearchHistoryItem } from 'features/search/components/SearchHistoryItem/SearchHistoryItem'
import {
  SearchSuggestionsGroup,
  SearchSuggestionsGroupItem,
} from 'features/search/components/SearchSuggestionsListbox/SearchSuggestionsGroup'
import { addHighlightedAttribute } from 'features/search/helpers/addHighlightedAttribute/addHighlightedAttribute'
import { Highlighted, HistoryItem } from 'features/search/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Close as DefaultClose } from 'ui/svg/icons/Close'

type Props = {
  history: HistoryItem[]
  queryHistory: string
  removeItem: (item: HistoryItem) => void
  onPress: (item: Highlighted<HistoryItem>) => void
}

export function SearchHistory({ history, queryHistory, removeItem, onPress }: Props) {
  const isEmptyQuery = queryHistory === ''

  return history.length > 0 ? (
    <SearchSuggestionsGroup title="Historique de recherche">
      {history.map((item) => (
        <Container key={item.createdAt} testID="searchHistoryItem" isEmptyQuery={isEmptyQuery}>
          <SearchHistoryItem
            item={addHighlightedAttribute({ item, query: queryHistory })}
            queryHistory={queryHistory}
            onPress={onPress}
          />
          {isEmptyQuery ? (
            <RemoveButton
              accessibilityLabel={`Supprimer ${item.label} de l’historique`}
              onPress={() => removeItem(item)}>
              <Close />
            </RemoveButton>
          ) : null}
        </Container>
      ))}
    </SearchSuggestionsGroup>
  ) : null
}

const Container = styled(SearchSuggestionsGroupItem)<{ isEmptyQuery: boolean }>(
  ({ isEmptyQuery, theme }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: isEmptyQuery
      ? theme.designSystem.size.spacing.xl
      : theme.designSystem.size.spacing.l,
  })
)

const RemoveButton = styledButton(Touchable)(({ theme }) => ({
  maxWidth: theme.designSystem.size.spacing.xxxl,
  justifyContent: 'center',
  alignItems: 'center',
}))

const Close = styled(DefaultClose).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
