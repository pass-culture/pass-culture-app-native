import { t } from '@lingui/macro'
import React, { useState, useMemo, useRef, useEffect } from 'react'
import { isDesktop } from 'react-device-detect'
import Picker from 'react-mobile-picker'
import {
  Calendar as RNCalendar,
  CalendarTheme,
  DateObject,
  LocaleConfig,
} from 'react-native-calendars'
import styled from 'styled-components/native'

import {
  monthNamesShort,
  generateDays,
  YEAR_LIST,
  monthNames,
  dayNames,
  dayNamesShort,
  today,
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
  today,
}
LocaleConfig.defaultLocale = 'fr'

const renderArrow = (direction: 'left' | 'right') => {
  switch (direction) {
    case 'left':
      return <ArrowPrevious />

    case 'right':
      return <ArrowNext />

    default:
      return <React.Fragment />
  }
}

const calendarHeaderStyle = {
  'stylesheet.calendar.header': {
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 6,
      alignItems: 'center',
    },
  },
} as CalendarTheme

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

export const CalendarPicker: React.FC<Props> = ({
  selectedDate,
  visible,
  hideCalendar,
  setSelectedDate,
}) => {
  const ref = useRef<Node>(null)
  const [currentDate, setCurrentDate] = useState(selectedDate)

  const currentDay = selectedDate.getDate()
  const currentMonth = selectedDate.getMonth()
  const currentYear = selectedDate.getFullYear()

  const [markedDates, setMarkedDates] = useState<{ [name: string]: { selected: boolean } }>({})
  const [valueGroups, setValueGroups] = useState({
    day: currentDay,
    month: monthNamesShort[currentMonth],
    year: currentYear,
  })

  const optionGroups = useMemo(() => {
    return {
      day: generateDays(currentMonth + 1, currentYear),
      month: monthNamesShort,
      year: YEAR_LIST,
    }
  }, [selectedDate])

  const handleChange = (name: string, value: number | string) => {
    const nextValueGroups = {
      ...valueGroups,
      [name]: value,
    }
    setValueGroups(nextValueGroups)

    const nextCurrentDate = new Date()
    nextCurrentDate.setDate(valueGroups.day)
    nextCurrentDate.setMonth(monthNamesShort.indexOf(valueGroups.month))
    nextCurrentDate.setFullYear(valueGroups.year)
    setCurrentDate(nextCurrentDate)
  }

  const handleCalendarChange = (result: DateObject) => {
    const nextValueGroups = {
      day: result.day,
      month: monthNamesShort[result.month],
      year: result.year,
    }
    setValueGroups(nextValueGroups)
    setCurrentDate(new Date(result.dateString))
  }

  const onValidate = () => {
    if (hideCalendar) {
      setSelectedDate(currentDate)
      hideCalendar()
    }
  }

  useEffect(() => {
    setValueGroups({
      day: currentDay,
      month: monthNamesShort[currentMonth],
      year: currentYear,
    })
  }, [selectedDate])
  useEffect(() => {
    if (ref.current) {
      const root = document.querySelector('#root')
      if (root) root.append(ref.current)
    }
  }, [ref.current])

  useEffect(() => {
    const currentDateStr = currentDate.toISOString().replace(/T.*/gi, '')
    setMarkedDates({
      [currentDateStr]: {
        selected: true,
      },
    })
  }, [currentDate])
  const RNCalendarTheme = { marginHorizontal: getSpacing(-2) }

  return (
    <AppModal visible={visible} title="" rightIcon={Close} onRightIconPress={hideCalendar}>
      {isDesktop ? (
        <CalendarPickerWrapperDesktop>
          <RNCalendar
            style={RNCalendarTheme}
            current={selectedDate}
            firstDay={1}
            enableSwipeMonths={true}
            renderHeader={(date) => <MonthHeader date={date} />}
            hideExtraDays={true}
            renderArrow={renderArrow}
            theme={calendarHeaderStyle}
            markedDates={markedDates}
            onDayPress={handleCalendarChange}
          />
        </CalendarPickerWrapperDesktop>
      ) : (
        <CalendarPickerWrapper>
          <Picker optionGroups={optionGroups} valueGroups={valueGroups} onChange={handleChange} />
        </CalendarPickerWrapper>
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
