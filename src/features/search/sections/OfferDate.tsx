import { t } from '@lingui/macro'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { DateFilter } from 'features/search/atoms/Buttons'
import { CalendarPicker } from 'features/search/components'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { DATE_FILTER_OPTIONS } from 'libs/algolia/enums'
import { _ } from 'libs/i18n'
import { formatToCompleteFrenchDate } from 'libs/parsers'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

export const OfferDate: React.FC = () => {
  const { searchState, dispatch } = useStagedSearch()
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false)
  const logUseFilter = useLogFilterOnce(SectionTitle.OfferDate)

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
          text={_(t`Aujourd'hui`)}
          isSelected={option === DATE_FILTER_OPTIONS.TODAY}
          onPress={selectDateFilterOption(DATE_FILTER_OPTIONS.TODAY)}
        />
        <Spacer.Column numberOfSpaces={4} />
        <DateFilter
          text={_(t`Cette semaine`)}
          isSelected={option === DATE_FILTER_OPTIONS.CURRENT_WEEK}
          onPress={selectDateFilterOption(DATE_FILTER_OPTIONS.CURRENT_WEEK)}
        />
        <Spacer.Column numberOfSpaces={4} />
        <DateFilter
          text={_(t`Ce week-end`)}
          isSelected={option === DATE_FILTER_OPTIONS.CURRENT_WEEK_END}
          onPress={selectDateFilterOption(DATE_FILTER_OPTIONS.CURRENT_WEEK_END)}
        />
        <Spacer.Column numberOfSpaces={4} />
        <DateFilter
          text={_(t`Date précise`)}
          isSelected={option === DATE_FILTER_OPTIONS.USER_PICK}
          onPress={selectDateFilterOption(DATE_FILTER_OPTIONS.USER_PICK)}
        />
        {option === DATE_FILTER_OPTIONS.USER_PICK && (
          <TouchableOpacity
            testID="pickedDate"
            activeOpacity={ACTIVE_OPACITY}
            onPress={() => setShowTimePicker(true)}>
            <Typo.Body color={ColorsEnum.BLACK}>
              {formatToCompleteFrenchDate(selectedDate.getTime())}
            </Typo.Body>
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

const Container = styled.View({ marginHorizontal: getSpacing(6) })
