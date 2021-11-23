import { t } from '@lingui/macro'
import React, { useState, useMemo, useRef, useEffect } from 'react'
import Picker from 'react-mobile-picker'
import { Calendar as RNCalendar, LocaleConfig } from 'react-native-calendars'
import { DateData, Theme } from 'react-native-calendars/src/types'
import styled, { useTheme } from 'styled-components/native'

import {
  monthNamesShort,
  getListOfDatesInMonth,
  YEAR_LIST,
  monthNames,
  dayNames,
  dayNamesShort,
} from 'features/bookOffer/components/Calendar/Calendar.utils'
import { MonthHeader } from 'features/bookOffer/components/Calendar/MonthHeader'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { Spacer } from 'ui/components/spacer/Spacer'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing } from 'ui/theme'

import { Props } from './CalendarPicker.d'

LocaleConfig.locales['fr'] = {
  monthNames,
  monthNamesShort,
  dayNames,
  dayNamesShort,
}
LocaleConfig.defaultLocale = 'fr'

function renderArrow(direction: 'left' | 'right') {
  if (direction === 'left') return <ArrowPrevious />
  if (direction === 'right') return <ArrowNext />
  return <React.Fragment />
}

const RNCalendarTheme = { marginHorizontal: getSpacing(-2) }
const calendarHeaderStyle = {
  'stylesheet.calendar.header': {
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 6,
      alignItems: 'center',
    },
  },
} as Theme

export const CalendarPicker: React.FC<Props> = ({
  selectedDate,
  visible,
  hideCalendar,
  setSelectedDate,
}) => {
  const { isTouch } = useTheme()

  const ref = useRef<Node>(null)
  const [markedDates, setMarkedDates] = useState<{ [name: string]: { selected: boolean } }>({})
  const [desktopCalendarDate, setDesktopCalendarDate] = useState(selectedDate)
  const [mobileDateValues, setMobileDateValues] = useState({
    day: selectedDate.getDate(),
    month: monthNamesShort[selectedDate.getMonth()],
    year: selectedDate.getFullYear(),
  })

  useEffect(() => {
    if (ref.current) {
      const root = document.querySelector('#root')
      if (root) root.append(ref.current)
    }
  }, [ref.current])

  useEffect(() => {
    const DateStr = desktopCalendarDate.toISOString().replace(/T.*/gi, '')
    setMarkedDates({ [DateStr]: { selected: true } })
  }, [desktopCalendarDate])

  const optionGroups = useMemo(
    () => ({
      day: getListOfDatesInMonth(
        monthNamesShort.indexOf(mobileDateValues.month),
        mobileDateValues.year
      ),
      month: monthNamesShort,
      year: YEAR_LIST,
    }),
    [mobileDateValues.month, mobileDateValues.year, monthNamesShort, YEAR_LIST]
  )

  function handleMobileDateChange(name: string, value: number | string) {
    setMobileDateValues((prevMobileDateValues) => ({ ...prevMobileDateValues, [name]: value }))
  }

  function handleDesktopDateChange(result: DateData) {
    setDesktopCalendarDate(new Date(result.dateString))
  }

  function onValidate() {
    if (!hideCalendar) return
    if (isTouch) {
      const { year, month, day } = mobileDateValues
      const monthIndex = monthNamesShort.indexOf(month)
      setSelectedDate(new Date(year, monthIndex, day))
    } else {
      setSelectedDate(desktopCalendarDate)
    }
    hideCalendar()
  }

  return (
    <AppModal
      visible={visible}
      title=""
      leftIconAccessibilityLabel={undefined}
      leftIcon={undefined}
      onLeftIconPress={undefined}
      rightIconAccessibilityLabel={t`Fermer le calendrier`}
      rightIcon={Close}
      onRightIconPress={hideCalendar}>
      {isTouch ? (
        <CalendarPickerWrapper>
          <Picker
            optionGroups={optionGroups}
            valueGroups={mobileDateValues}
            onChange={handleMobileDateChange}
          />
        </CalendarPickerWrapper>
      ) : (
        <CalendarPickerWrapperDesktop>
          <RNCalendar
            style={RNCalendarTheme}
            current={(selectedDate as unknown) as LocaleConfig}
            firstDay={1}
            enableSwipeMonths={true}
            renderHeader={(date) => <MonthHeader date={(date as unknown) as Date} />}
            hideExtraDays={true}
            renderArrow={renderArrow}
            theme={calendarHeaderStyle}
            markedDates={markedDates}
            onDayPress={handleDesktopDateChange}
          />
        </CalendarPickerWrapperDesktop>
      )}

      <CalendarButtonWrapper>
        <ButtonPrimary
          testId={'validationButton'}
          title={t`Valider la date`}
          onPress={onValidate}
          adjustsFontSizeToFit={true}
        />
      </CalendarButtonWrapper>
      <Spacer.BottomScreen />
    </AppModal>
  )
}

const CalendarPickerWrapper = styled.View({
  alignSelf: 'stretch',
  flexDirection: 'row',
  alignItems: 'stretch',
  fontFamily: 'Montserrat-Regular',
})

const CalendarPickerWrapperDesktop = styled.View({
  alignSelf: 'stretch',
  flexDirection: 'column',
  alignItems: 'center',
  fontFamily: 'Montserrat-Regular',
})

const CalendarButtonWrapper = styled.View({
  margin: 20,
  alignItems: 'center',
  alignSelf: 'stretch',
})
