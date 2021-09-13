import { t } from '@lingui/macro'
import React, { useState, useMemo, useRef, useEffect } from 'react'
import Picker from 'react-mobile-picker'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import {
  monthNamesShort,
  generateDays,
  YEAR_LIST,
} from 'features/bookOffer/components/Calendar/Calendar.utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Spacer } from 'ui/components/spacer/Spacer'

import { Props } from './CalendarPicker.d'

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

  const currentDay = selectedDate.getDate()
  const currentMonth = selectedDate.getMonth()
  const currentYear = selectedDate.getFullYear()

  const [isVisible, setIsVisible] = useState(false)
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
    setValueGroups({
      ...valueGroups,
      [name]: value,
    })
  }

  const onValidate = () => {
    if (hideCalendar) {
      const newDate = new Date()
      newDate.setDate(valueGroups.day)
      newDate.setMonth(monthNamesShort.indexOf(valueGroups.month))
      newDate.setFullYear(valueGroups.year)

      setSelectedDate(newDate)
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
  const display = visible || isVisible ? 'flex' : 'none'
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
          <Picker optionGroups={optionGroups} valueGroups={valueGroups} onChange={handleChange} />
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
