import React from 'react'
import styled from 'styled-components/native'

import { SearchHistoryItem } from 'features/search/components/SearchHistoryItem/SearchHistoryItem'
import { addHighlightedAttribute } from 'features/search/helpers/addHighlightedAttribute/addHighlightedAttribute'
import { Highlighted, HistoryItem } from 'features/search/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { VerticalUl } from 'ui/components/Ul'
import { Close as DefaultClose } from 'ui/svg/icons/Close'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  history: HistoryItem[]
  queryHistory: string
  removeItem: (item: HistoryItem) => void
  onPress: (item: Highlighted<HistoryItem>) => void
}

export function SearchHistory({ history, queryHistory, removeItem, onPress }: Props) {
  const isEmptyQuery = queryHistory === ''

  return history.length > 0 ? (
    <React.Fragment>
      <SearchHistoryTitleText>Historique de recherche</SearchHistoryTitleText>
      <StyledVerticalUl>
        {history.map((item) => (
          <Container
            key={item.createdAt}
            testID="searchHistoryItem"
            isEmptyQuery={isEmptyQuery}
            accessibilityRole={AccessibilityRole.LISTITEM}>
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
      </StyledVerticalUl>
    </React.Fragment>
  ) : null
}

const StyledVerticalUl = styled(VerticalUl)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))

const SearchHistoryTitleText = styled(Typo.BodyAccentXs).attrs(getHeadingAttrs(2))(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const Container = styled.View<{ isEmptyQuery: boolean }>(({ isEmptyQuery, theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: isEmptyQuery
    ? theme.designSystem.size.spacing.xl
    : theme.designSystem.size.spacing.l,
}))

const RemoveButton = styledButton(Touchable)(({ theme }) => ({
  maxWidth: theme.designSystem.size.spacing.xxxl,
  justifyContent: 'center',
  alignItems: 'center',
}))

const Close = styled(DefaultClose).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
