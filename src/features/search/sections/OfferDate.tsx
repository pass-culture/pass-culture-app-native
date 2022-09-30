import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Platform, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CalendarPicker } from 'features/search/components'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { formatToCompleteFrenchDate } from 'libs/parsers'
import { Li } from 'ui/components/Li'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { VerticalUl } from 'ui/components/Ul'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  setScrollEnabled?: ((setScrollEnabled: boolean) => void) | Dispatch<SetStateAction<boolean>>
}

export function OfferDate({ setScrollEnabled }: Props) {
  const { searchState, dispatch } = useStagedSearch()
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false)
  const logUseFilter = useLogFilterOnce(SectionTitle.OfferDate)
  const { isTouch } = useTheme()
  const titleID = uuidv4()

  useEffect(() => {
    if (setScrollEnabled && isTouch && Platform.OS === 'web') {
      setScrollEnabled(!showTimePicker)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <Typo.Title4 {...getHeadingAttrs(3)} nativeID={titleID}>
          {SectionTitle.OfferDate}
        </Typo.Title4>
        <Spacer.Column numberOfSpaces={4} />
        <View accessibilityRole={AccessibilityRole.RADIOGROUP} aria-labelledby={titleID}>
          <VerticalUl>
            <Li>
              <RadioButton
                label="Aujourd’hui"
                isSelected={option === DATE_FILTER_OPTIONS.TODAY}
                onSelect={selectDateFilterOption(DATE_FILTER_OPTIONS.TODAY)}
              />
              <Spacer.Column numberOfSpaces={4} />
            </Li>
            <Li>
              <RadioButton
                label="Cette semaine"
                isSelected={option === DATE_FILTER_OPTIONS.CURRENT_WEEK}
                onSelect={selectDateFilterOption(DATE_FILTER_OPTIONS.CURRENT_WEEK)}
              />
              <Spacer.Column numberOfSpaces={4} />
            </Li>
            <Li>
              <RadioButton
                label="Ce week-end"
                isSelected={option === DATE_FILTER_OPTIONS.CURRENT_WEEK_END}
                onSelect={selectDateFilterOption(DATE_FILTER_OPTIONS.CURRENT_WEEK_END)}
              />
              <Spacer.Column numberOfSpaces={4} />
            </Li>
            <Li>
              <RadioButton
                label="Date précise"
                isSelected={option === DATE_FILTER_OPTIONS.USER_PICK}
                onSelect={selectDateFilterOption(DATE_FILTER_OPTIONS.USER_PICK)}
                description={
                  option === DATE_FILTER_OPTIONS.USER_PICK
                    ? formatToCompleteFrenchDate(selectedDate)
                    : undefined
                }
                testID="dateFilter"
              />
            </Li>
          </VerticalUl>
        </View>
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
