import colorAlpha from 'color-alpha'
import React, { useMemo } from 'react'
import { View, ViewProps } from 'react-native'
import styled from 'styled-components/native'

import { MovieCalendarBottomBar } from 'features/offer/components/MovieCalendar/components/MovieCalendarBottomBar'
import { useMovieCalendarDayV2 } from 'features/offer/components/MovieCalendar/hooks/useMovieCalendarDayV2'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { getComputedAccessibilityLabel } from 'shared/accessibility/helpers/getComputedAccessibilityLabel'
import { styledButton } from 'ui/components/buttons/styledButton'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Typo } from 'ui/theme'

type Props = {
  date: string
  onTabChange: (date: string) => void
  selectedDate?: string
  onLayout?: ViewProps['onLayout']
  disabled?: boolean
}

export const MovieCalendarDayV2: React.FC<Props> = ({
  date,
  selectedDate,
  onTabChange,
  onLayout,
  disabled,
}) => {
  const { weekDay, dayDate, month, accessibilityLabel, isSelected } = useMovieCalendarDayV2(
    date,
    selectedDate
  )

  const CalendarText = useMemo(() => {
    if (disabled) {
      return DisabledCalendarText
    }
    if (isSelected) {
      return SelectedCalendarText
    }
    return DefaultCalendarText
  }, [disabled, isSelected])

  const computedAccessibilityLabel = getComputedAccessibilityLabel(
    accessibilityLabel,
    isSelected ? 'sélectionné' : undefined
  )

  return (
    <CalendarCell
      disabled={disabled}
      onLayout={onLayout}
      testID="movie-calendar-day"
      onPress={() => onTabChange(date)}
      accessibilityLabel={computedAccessibilityLabel}
      accessibilityRole={AccessibilityRole.BUTTON}
      accessible={!disabled}
      accessibilityElementsHidden={disabled} // Hide element in iOS
      importantForAccessibility={disabled ? 'no-hide-descendants' : 'auto'} // Hide element in Android
    >
      <CalendarTextView>
        <CalendarText numberOfLines={1}>{weekDay}</CalendarText>
        <CalendarText numberOfLines={1}>{dayDate}</CalendarText>
        <CalendarText numberOfLines={1}>{month}</CalendarText>
      </CalendarTextView>
      {isSelected ? <SelectedBottomBar disabled={disabled} /> : null}
    </CalendarCell>
  )
}

const SelectedBottomBar = styled(MovieCalendarBottomBar)<{ disabled?: boolean }>(
  ({ theme, disabled }) => ({
    backgroundColor: disabled
      ? theme.designSystem.color.background.disabled
      : theme.designSystem.color.background.brandPrimary,
    borderRadius: theme.designSystem.size.borderRadius.s,
  })
)

const CalendarTextView = styled(View)(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.l,
  marginBottom: theme.designSystem.size.spacing.s,
}))

const CalendarCell = styledButton(TouchableOpacity)({
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
  '&:hover': {
    textDecorationLine: 'none',
  },
})

const DefaultCalendarText = styled(Typo.BodyAccent)({
  textAlign: 'center',
})

const SelectedCalendarText = styled(DefaultCalendarText)(({ theme }) => ({
  color: theme.designSystem.color.text.brandPrimary,
}))

// UX decision: align with disabled background token for the muted state
const DisabledCalendarText = styled(DefaultCalendarText)(({ theme }) => ({
  color: colorAlpha(theme.designSystem.color.text.disabled, 0.4),
}))
