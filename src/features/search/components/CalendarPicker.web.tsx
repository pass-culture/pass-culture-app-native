import { t } from '@lingui/macro'
import React, { useState, useMemo, useRef, useEffect } from 'react'
import Picker from 'react-mobile-picker'
import { Animated, useWindowDimensions } from 'react-native'
import { Calendar as RNCalendar, CalendarTheme, LocaleConfig } from 'react-native-calendars'
import styled from 'styled-components/native'

const MINIMUM_WINDOW_WIDTH = 400

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
import { Spacer } from 'ui/components/spacer/Spacer'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
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

const renderArrow = (direction: string) => {
  if (direction === 'left') return <ArrowPrevious />
  if (direction === 'right') return <ArrowNext />
  return <React.Fragment />
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

const Container = styled(Animated.View)({
  backgroundColor: 'rgba(0,0,0,0.2)',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'flex-end',
  width: '100vw',
  height: '100vh',
  zIndex: 100000,
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
})

const CalendarWrapper = styled(Animated.View)({
  backgroundColor: '#FFF',
  position: 'relative',
})

const CalendarPickerWrapper = styled.View({
  flexDirection: 'row',
  alignItems: 'stretch',
  fontFamily: 'Montserrat-Regular',
})

const CalendarButtonWrapper = styled.View({
  margin: 20,
  alignItems: 'center',
})

export const CalendarPicker: React.FC<Props> = ({
  selectedDate,
  visible,
  hideCalendar,
  setSelectedDate,
}) => {
  const ref = useRef<Node>(null)
  const { width: windowWidth } = useWindowDimensions()
  const [currentDate, setCurrentDate] = useState(selectedDate)

  const currentDay = selectedDate.getDate()
  const currentMonth = selectedDate.getMonth()
  const currentYear = selectedDate.getFullYear()

  const [isVisible, setIsVisible] = useState(false)
  const [markedDates, setMarkedDates] = useState<{ [name: string]: { selected: boolean } }>({})
  const [wrapperHeight, setWrapperHeight] = useState(0)
  const animation = useMemo(() => new Animated.Value(0), [])
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

  const onValidate = () => {
    if (hideCalendar) {
      setSelectedDate(currentDate)
      hideCalendar()
    }
  }

  const show = () => {
    animation.setValue(0)
    setIsVisible(true)
    Animated.timing(animation, {
      toValue: 1,
      useNativeDriver: false,
      duration: 400,
    }).start()
  }

  const hide = () => {
    animation.setValue(1)
    Animated.timing(animation, {
      toValue: 0,
      useNativeDriver: false,
      duration: 400,
    }).start(() => {
      /*const root = document.querySelector('#root')
      if (root) root.removeChild(ref.current)*/
      requestAnimationFrame(() => setIsVisible(false))
    })
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
    if (visible) {
      animation.setValue(0)
      if (wrapperHeight && !isVisible) {
        show()
      }
    } else if (wrapperHeight && isVisible) {
      hide()
    }
  }, [visible, wrapperHeight])

  useEffect(() => {
    const currentDateStr = new Date().toISOString().replace(/T.*/gi, '')
    setMarkedDates({
      [currentDateStr]: {
        selected: true,
      },
    })
  }, [currentDate])
  const display = visible || isVisible ? 'flex' : 'none'
  const RNCalendarTheme = { marginHorizontal: getSpacing(-2) }

  return (
    <Container
      testID={'calendarPickerContainer'}
      ref={ref}
      style={{
        display,
        opacity: animation.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 1, 1],
          extrapolate: 'clamp',
        }),
      }}>
      <CalendarWrapper
        style={{
          transform: wrapperHeight
            ? [
                {
                  translateY: animation.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [wrapperHeight, wrapperHeight, 0],
                    extrapolate: 'clamp',
                  }),
                },
              ]
            : undefined,
        }}
        onLayout={({
          nativeEvent: {
            layout: { height },
          },
        }) => {
          setWrapperHeight(height)
        }}>
        <CalendarPickerWrapper>
          {windowWidth > MINIMUM_WINDOW_WIDTH ? (
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
            />
          ) : (
            <Picker optionGroups={optionGroups} valueGroups={valueGroups} onChange={handleChange} />
          )}
        </CalendarPickerWrapper>
        <CalendarButtonWrapper>
          <ButtonPrimary
            testId={'validationButton'}
            title={t`Valider la date`}
            onPress={onValidate}
            adjustsFontSizeToFit={true}
          />
        </CalendarButtonWrapper>
        <Spacer.BottomScreen />
      </CalendarWrapper>
    </Container>
  )
}
