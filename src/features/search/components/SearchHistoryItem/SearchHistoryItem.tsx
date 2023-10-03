import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { Highlight } from 'features/search/components/Highlight/Highlight'
import { Highlighted, HistoryItem } from 'features/search/types'
import { Li } from 'ui/components/Li'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Typo, getSpacing } from 'ui/theme'

type Props = {
  item: Highlighted<HistoryItem>
  queryHistory: string
  onPress: (item: Highlighted<HistoryItem>) => void
}

export function SearchHistoryItem({ item, queryHistory, onPress }: Props) {
  const shouldDisplaySearchGroupOrNativeCategory = Boolean(
    item.nativeCategoryLabel || item.categoryLabel
  )

  return (
    <StyledLi>
      <HistoryItemTouchable onPress={() => onPress(item)}>
        <ClockIconContainer>
          <ClockFilledIcon />
        </ClockIconContainer>
        <StyledText numberOfLines={1}>
          {queryHistory === '' ? (
            <ItalicText testID="withoutUsingHighlight">{item.query}</ItalicText>
          ) : (
            <Highlight historyItem={item} />
          )}
          {!!shouldDisplaySearchGroupOrNativeCategory && (
            <React.Fragment>
              <ItalicText> dans </ItalicText>
              <BoldItalicText>{item.nativeCategoryLabel ?? item.categoryLabel}</BoldItalicText>
            </React.Fragment>
          )}
        </StyledText>
      </HistoryItemTouchable>
    </StyledLi>
  )
}

const StyledLi = styled(Li)({
  flex: 1,
})

const HistoryItemTouchable = styled.TouchableOpacity({
  flexDirection: 'row',
  alignItems: 'center',
})

const StyledText = styled(Text)({
  marginLeft: getSpacing(2),
  flex: 1,
})

const ItalicText = styled(Typo.Body)(({ theme }) => ({
  ...theme.typography.placeholder,
  color: theme.colors.black,
}))

const BoldItalicText = styled(Typo.Body)(({ theme }) => theme.typography.bodyBoldItalic)

const ClockIconContainer = styled.View({ flexShrink: 0 })

const ClockFilledIcon = styled(ClockFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.colors.greyDark,
}))``
