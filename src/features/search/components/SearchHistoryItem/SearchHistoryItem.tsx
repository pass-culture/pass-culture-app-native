import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { HistoryItemHighlight } from 'features/search/components/Highlight/Highlight'
import { Highlighted, HistoryItem } from 'features/search/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useNumberOfLine } from 'shared/accessibility/helpers/zoomHelpers'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Typo } from 'ui/theme'

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

  const numberOfLines = useNumberOfLine(1)

  return (
    <Container>
      <HistoryItemTouchable onPress={handlePress} accessibilityRole={AccessibilityRole.BUTTON}>
        <ClockIconContainer>
          <ClockFilledIcon />
        </ClockIconContainer>
        <StyledText numberOfLines={numberOfLines}>
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

const StyledText = styled(Typo.Body)(({ theme }) => ({
  marginLeft: theme.designSystem.size.spacing.s,
  flex: 1,
}))

const ClockIconContainer = styled.View({ flexShrink: 0 })

const ClockFilledIcon = styled(ClockFilled).attrs(({ theme }) => ({
  size: theme.designSystem.size.icon.s,
  color: theme.designSystem.color.icon.subtle,
}))``
