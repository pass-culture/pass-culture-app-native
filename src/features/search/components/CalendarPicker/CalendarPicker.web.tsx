import { format } from 'date-fns'
import React, { useState, useMemo, useRef, useEffect } from 'react'
import Picker from 'react-mobile-picker'
import { Calendar as RNCalendar, LocaleConfig } from 'react-native-calendars'
import { Theme as RNCalendarTheme, DateData } from 'react-native-calendars/src/types'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import {
  monthNamesShort,
  getDatesInMonth,
  getYears,
  monthNames,
  dayNames,
  dayNamesShort,
} from 'features/bookOffer/components/Calendar/Calendar.utils'
import { MonthHeader } from 'features/bookOffer/components/Calendar/MonthHeader'
import { isBeforeToday } from 'features/search/helpers/isBeforeToday/isBeforeToday'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InputError } from 'ui/components/inputs/InputError'
import { AppModal } from 'ui/components/modals/AppModal'
import { Spacer } from 'ui/components/spacer/Spacer'
import { ArrowNext as DefaultArrowNext } from 'ui/svg/icons/ArrowNext'
import { ArrowPrevious as DefaultArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing } from 'ui/theme'

import { Props } from './CalendarPicker.d'

LocaleConfig.locales['fr'] = {
  monthNames,
  monthNamesShort,
  dayNames,
  dayNamesShort,
  today: 'Aujourd’hui',
} as typeof LocaleConfig.locales
LocaleConfig.defaultLocale = 'fr'

function renderArrow(direction: 'left' | 'right') {
  if (direction === 'left') return <ArrowPrevious />
  if (direction === 'right') return <ArrowNext />
  return <React.Fragment />
}

const RN_CALENDAR_STYLE: React.ComponentProps<typeof RNCalendar>['style'] = {
  marginHorizontal: getSpacing(-2),
}

export const CalendarPicker: React.FC<Props> = ({
  selectedDate,
  visible,
  hideCalendar,
  setSelectedDate,
}) => {
  const { isTouch, fontFamily, colors } = useTheme()
  const calendarTheme: RNCalendarTheme = useMemo(
    () => ({
      textSectionTitleColor: colors.greyDark,
      textDisabledColor: colors.greyMedium,
      todayTextColor: colors.primaryDark,
      dayTextColor: colors.black,
      selectedDayBackgroundColor: colors.primary,
      textDayHeaderFontSize: getSpacing(4),
      textDayHeaderFontFamily: fontFamily.bold,
      textDayFontFamily: fontFamily.regular,
      textMonthFontFamily: fontFamily.regular,
      todayButtonFontFamily: fontFamily.regular,
    }),
    [fontFamily, colors]
  )

  const minDate = format(new Date(), 'yyyy-MM-dd')
  const ref = useRef<Node>(null)
  const [markedDates, setMarkedDates] = useState<{
    [name: string]: { selected: boolean; accessibilityLabel: string }
  }>({})
  const [desktopCalendarDate, setDesktopCalendarDate] = useState(selectedDate)
  const [mobileDateValues, setMobileDateValues] = useState({
    day: selectedDate.getDate(),
    month: monthNamesShort[selectedDate.getMonth()],
    year: selectedDate.getFullYear(),
  })
  const bookingDateChoiceErrorId = uuidv4()

  useEffect(() => {
    if (ref.current) {
      const root = document.querySelector('#root')
      if (root) root.append(ref.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current])

  useEffect(() => {
    const DateStr = desktopCalendarDate.toISOString().replace(/T.*/gi, '')
    setMarkedDates({ [DateStr]: { selected: true, accessibilityLabel: 'sélectionné' } })
  }, [desktopCalendarDate])

  const { isMobileDateInvalid, optionGroups } = useMemo(() => {
    const {
      day: selectedMobileDay,
      month: selectedMobileMonth,
      year: selectedMobileYear,
    } = mobileDateValues
    const selectedMobileMonthIndex = monthNamesShort.indexOf(selectedMobileMonth)
    const currentYear = new Date().getFullYear()

    const invalid = isBeforeToday(selectedMobileYear, selectedMobileMonthIndex, selectedMobileDay)

    return {
      isMobileDateInvalid: invalid && isTouch,
      optionGroups: {
        day: getDatesInMonth(selectedMobileMonthIndex, selectedMobileYear),
        month: monthNamesShort,
        year: getYears(currentYear, 10),
      },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileDateValues, monthNamesShort, getYears])

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
      title="Choisis une date"
      rightIconAccessibilityLabel="Fermer le calendrier"
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
            minDate={minDate}
            style={RN_CALENDAR_STYLE}
            current={format(selectedDate, 'yyyy-MM-dd')}
            firstDay={1}
            enableSwipeMonths
            renderHeader={(date) => <MonthHeader date={date as unknown as Date} />}
            hideExtraDays
            renderArrow={renderArrow}
            theme={calendarTheme}
            markedDates={markedDates}
            onDayPress={handleDesktopDateChange}
            aria-describedby={bookingDateChoiceErrorId}
            disableAllTouchEventsForDisabledDays
          />
        </CalendarPickerWrapperDesktop>
      )}

      <CalendarButtonWrapper>
        <ButtonPrimary
          testID="validationButton"
          wording="Valider la date"
          disabled={isMobileDateInvalid}
          onPress={onValidate}
          adjustsFontSizeToFit
        />
        <InputError
          visible={isMobileDateInvalid}
          messageId="Choisis une date dans le futur"
          numberOfSpacesTop={2}
          relatedInputId={bookingDateChoiceErrorId}
        />
        {isMobileDateInvalid ? (
          <Spacer.Column numberOfSpaces={1} />
        ) : (
          <Spacer.Column numberOfSpaces={7} />
        )}
      </CalendarButtonWrapper>
      <Spacer.BottomScreen />
    </AppModal>
  )
}

const CalendarPickerWrapper = styled.View(({ theme }) => ({
  alignSelf: 'stretch',
  flexDirection: 'row',
  alignItems: 'stretch',
  fontFamily: theme.fontFamily.regular,
  userSelect: 'none',
}))

const CalendarPickerWrapperDesktop = styled.View(({ theme }) => ({
  minHeight: 390,
  alignSelf: 'stretch',
  flexDirection: 'column',
  alignItems: 'center',
  fontFamily: theme.fontFamily.regular,
}))

const CalendarButtonWrapper = styled.View({
  alignItems: 'center',
  alignSelf: 'stretch',
})

const ArrowNext = styled(DefaultArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
  accessibilityLabel: 'Mois suivant',
}))``

const ArrowPrevious = styled(DefaultArrowPrevious).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
  accessibilityLabel: 'Mois précédent',
}))``
