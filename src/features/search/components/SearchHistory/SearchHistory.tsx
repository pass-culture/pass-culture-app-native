import React from 'react'
import styled from 'styled-components/native'

import { SearchHistoryItem } from 'features/search/components/SearchHistoryItem/SearchHistoryItem'
import { HistoryItem } from 'features/search/types'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { VerticalUl } from 'ui/components/Ul'
import { Trash } from 'ui/svg/icons/Trash'
import { Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  history: HistoryItem[]
  removeItem: (item: HistoryItem) => void
}

export function SearchHistory({ history, removeItem }: Props) {
  return history.length > 0 ? (
    <React.Fragment>
      <SearchHistoryTitleText>Historique de recherches</SearchHistoryTitleText>

      <StyledVerticalUl>
        {history.slice(0, 5).map((item) => (
          <Container key={item.addedDate}>
            <SearchHistoryItem item={item} />
            <ButtonQuaternaryBlack icon={Trash} onPress={() => removeItem(item)} wording="" />
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
})
