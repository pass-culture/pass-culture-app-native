import React, { useCallback } from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { HistoryItemHighlight } from 'features/search/components/Highlight/Highlight'
import { Highlighted, HistoryItem } from 'features/search/types'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { getSpacing, Typo } from 'ui/theme'

interface Props {
  item: Highlighted<HistoryItem>
  queryHistory: string
  onPress: (item: Highlighted<HistoryItem>) => void
}

export function SearchHistoryItem({ item, queryHistory, onPress }: Props) {
  const shouldDisplaySearchGroupOrNativeCategory = Boolean(
    item.nativeCategoryLabel || item.categoryLabel
  )

  const handlePress = useCallback(() => {
    onPress(item)
  }, [item, onPress])

  return (
    <Container>
      <HistoryItemTouchable onPress={handlePress}>
        <ClockIconContainer>
          <ClockFilledIcon />
        </ClockIconContainer>
        <StyledText numberOfLines={1}>
          {queryHistory === '' ? (
            <Typo.BodyItalic testID="withoutUsingHighlight">{item.query}</Typo.BodyItalic>
          ) : (
            <HistoryItemHighlight historyItem={item} />
          )}
          {shouldDisplaySearchGroupOrNativeCategory ? (
            <React.Fragment>
              <Typo.BodyItalic> dans </Typo.BodyItalic>
              <Typo.BodyItalicAccent>
                {item.nativeCategoryLabel ?? item.categoryLabel}
              </Typo.BodyItalicAccent>
            </React.Fragment>
          ) : null}
        </StyledText>
      </HistoryItemTouchable>
    </Container>
  )
}

const Container = styled.View({
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

const ClockIconContainer = styled.View({ flexShrink: 0 })

const ClockFilledIcon = styled(ClockFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.colors.greyDark,
}))``
