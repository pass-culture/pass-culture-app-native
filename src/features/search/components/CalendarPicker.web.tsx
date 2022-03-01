import { t } from '@lingui/macro'
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
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InputError } from 'ui/components/inputs/InputError'
import { AppModal } from 'ui/components/modals/AppModal'
import { Spacer } from 'ui/components/spacer/Spacer'
import { ArrowNext as DefaultArrowNext } from 'ui/svg/icons/ArrowNext'
import { ArrowPrevious as DefaultArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing } from 'ui/theme'

import { Props } from './CalendarPicker.d'

LocaleConfig.locales['fr'] = { monthNames, monthNamesShort, dayNames, dayNamesShort }
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
      textDayHeaderFontSize: 16,
      textDayHeaderFontFamily: fontFamily.bold,
      textDayFontFamily: fontFamily.regular,
      textMonthFontFamily: fontFamily.regular,
      todayButtonFontFamily: fontFamily.regular,
    }),
    [fontFamily, colors]
  )

  const minDate = new Date()
  minDate.setHours(0, 0, 0, 0)
  const ref = useRef<Node>(null)
  const [markedDates, setMarkedDates] = useState<{ [name: string]: { selected: boolean } }>({})
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
  }, [ref.current])

  useEffect(() => {
    const DateStr = desktopCalendarDate.toISOString().replace(/T.*/gi, '')
    setMarkedDates({ [DateStr]: { selected: true } })
  }, [desktopCalendarDate])

  const { isMobileDateInvalid, optionGroups } = useMemo(() => {
    const {
      day: selectedMobileDay,
      month: selectedMobileMonth,
      year: selectedMobileYear,
    } = mobileDateValues
    const selectedMobileMonthIndex = monthNamesShort.indexOf(selectedMobileMonth)
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()
    const currentDate = now.getDate()

    let invalid = false
    if (selectedMobileYear < currentYear) {
      invalid = true
    } else if (selectedMobileMonthIndex < currentMonth && currentYear === selectedMobileYear) {
      invalid = true
    } else if (
      selectedMobileDay < currentDate &&
      currentMonth === selectedMobileMonthIndex &&
      currentYear === selectedMobileYear
    ) {
      invalid = true
    }
    return {
      isMobileDateInvalid: invalid && isTouch,
      optionGroups: {
        day: getDatesInMonth(selectedMobileMonthIndex, selectedMobileYear),
        month: monthNamesShort,
        year: getYears(currentYear, 10),
      },
    }
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
            minDate={minDate}
            style={RN_CALENDAR_STYLE}
            current={selectedDate as unknown as LocaleConfig}
            firstDay={1}
            enableSwipeMonths={true}
            renderHeader={(date) => <MonthHeader date={date as unknown as Date} />}
            hideExtraDays={true}
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
          testID={'validationButton'}
          wording={t`Valider la date`}
          disabled={isMobileDateInvalid}
          onPress={onValidate}
          adjustsFontSizeToFit={true}
        />
        {isMobileDateInvalid ? (
          <React.Fragment>
            <InputError
              visible
              messageId={t`Choisis une date dans le futur`}
              numberOfSpacesTop={2}
              relatedInputId={bookingDateChoiceErrorId}
            />
            <Spacer.Column numberOfSpaces={1} />
          </React.Fragment>
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
  margin: 10,
  marginBottom: 0,
  alignItems: 'center',
  alignSelf: 'stretch',
})

const ArrowNext = styled(DefaultArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const ArrowPrevious = styled(DefaultArrowPrevious).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``
