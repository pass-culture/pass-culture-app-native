import { t } from '@lingui/macro'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { TouchableOpacity as TouchableOpacityGestureHandler } from 'react-native-gesture-handler'
import styled, { useTheme } from 'styled-components/native'

import { DateFilter } from 'features/search/atoms/Buttons'
import { CalendarPicker } from 'features/search/components'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { formatToCompleteFrenchDate } from 'libs/parsers'
import { getSpacing, Spacer, Typo } from 'ui/theme'
type Props = {
  setScrollEnabled?: ((setScrollEnabled: boolean) => void) | Dispatch<SetStateAction<boolean>>
}

export function OfferDate({ setScrollEnabled }: Props) {
  const { searchState, dispatch } = useStagedSearch()
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false)
  const logUseFilter = useLogFilterOnce(SectionTitle.OfferDate)
  const { isTouch } = useTheme()

  useEffect(() => {
    if (setScrollEnabled && isTouch && Platform.OS === 'web') {
      setScrollEnabled(!showTimePicker)
    }
  }, [setScrollEnabled, showTimePicker])

  if (!searchState.date) return <React.Fragment />

  const { option, selectedDate } = searchState.date

  const selectDateFilterOption = (payload: DATE_FILTER_OPTIONS) => () => {
    dispatch({ type: 'SELECT_DATE_FILTER_OPTION', payload })
    if (payload === DATE_FILTER_OPTIONS.USER_PICK) {
      setShowTimePicker(true)
    }
    logUseFilter()
  }

  const setSelectedDate = (payload: Date) => dispatch({ type: 'SELECT_DATE', payload })

  return (
    <React.Fragment>
      <Container testID="offerDateContainer">
        <Typo.Title4>{SectionTitle.OfferDate}</Typo.Title4>
        <Spacer.Column numberOfSpaces={4} />
        <DateFilter
          text={t`Aujourd'hui`}
          isSelected={option === DATE_FILTER_OPTIONS.TODAY}
          onPress={selectDateFilterOption(DATE_FILTER_OPTIONS.TODAY)}
        />
        <Spacer.Column numberOfSpaces={4} />
        <DateFilter
          text={t`Cette semaine`}
          isSelected={option === DATE_FILTER_OPTIONS.CURRENT_WEEK}
          onPress={selectDateFilterOption(DATE_FILTER_OPTIONS.CURRENT_WEEK)}
        />
        <Spacer.Column numberOfSpaces={4} />
        <DateFilter
          text={t`Ce week-end`}
          isSelected={option === DATE_FILTER_OPTIONS.CURRENT_WEEK_END}
          onPress={selectDateFilterOption(DATE_FILTER_OPTIONS.CURRENT_WEEK_END)}
        />
        <Spacer.Column numberOfSpaces={4} />
        <DateFilter
          text={t`Date précise`}
          isSelected={option === DATE_FILTER_OPTIONS.USER_PICK}
          onPress={selectDateFilterOption(DATE_FILTER_OPTIONS.USER_PICK)}
        />
        {option === DATE_FILTER_OPTIONS.USER_PICK && (
          <TouchableOpacity testID="pickedDate" onPress={() => setShowTimePicker(true)}>
            <StyledBody>{formatToCompleteFrenchDate(selectedDate)}</StyledBody>
          </TouchableOpacity>
        )}
      </Container>

      <CalendarPicker
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        visible={showTimePicker}
        hideCalendar={() => setShowTimePicker(false)}
      />
    </React.Fragment>
  )
}
const TouchableOpacity = styled(TouchableOpacityGestureHandler).attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))``

const Container = styled.View({ marginHorizontal: getSpacing(6) })

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.black,
}))
