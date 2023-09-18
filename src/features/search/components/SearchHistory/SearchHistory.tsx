import React from 'react'
import styled from 'styled-components/native'

import { SearchHistoryItem } from 'features/search/components/SearchHistoryItem/SearchHistoryItem'
import { HistoryItem } from 'features/search/types'
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
}

export function SearchHistory({ history, queryHistory, removeItem }: Props) {
  const nbHistoryResults = queryHistory === '' ? 20 : 3

  return history.length > 0 ? (
    <React.Fragment>
      <SearchHistoryTitleText>Historique de recherches</SearchHistoryTitleText>

      <StyledVerticalUl>
        {history.slice(0, nbHistoryResults).map((item) => (
          <Container key={item.addedDate}>
            <SearchHistoryItem item={item} />
            {queryHistory === '' && (
              <DeleteButton
                accessibilityLabel="Supprimer la ligne de l’historique"
                onPress={() => removeItem(item)}>
                <Close />
              </DeleteButton>
            )}
          </Container>
        ))}
      </StyledVerticalUl>
    </React.Fragment>
  ) : (
    <React.Fragment />
  )
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

const DeleteButton = styledButton(Touchable)({
  flexGrow: 1,
  maxWidth: getSpacing(10),
  justifyContent: 'center',
  alignItems: 'center',
})

const Close = styled(DefaultClose).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
