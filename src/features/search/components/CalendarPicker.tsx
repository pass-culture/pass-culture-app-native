import React, { useState } from 'react'
import DatePicker from 'react-native-date-picker'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer } from 'ui/theme'

import { Props } from './CalendarPicker.d'

const CURRENT_DATE = new Date()

export const CalendarPicker: React.FC<Props> = ({
  setSelectedDate,
  selectedDate,
  visible,
  hideCalendar,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(selectedDate)

  const onValidate = () => {
    setSelectedDate(currentDate)
    hideCalendar()
  }

  return (
    <AppModal
      visible={visible}
      title="Choisis une date"
      rightIconAccessibilityLabel="Fermer le calendrier"
      rightIcon={Close}
      onRightIconPress={hideCalendar}>
      <StyledDatePicker
        testID="dateTimePicker"
        date={currentDate}
        mode="date"
        minimumDate={CURRENT_DATE}
        onDateChange={setCurrentDate}
        locale="fr-FR"
        androidVariant="nativeAndroid"
      />
      <Spacer.Column numberOfSpaces={5} />
      <ButtonPrimary wording="Valider la date" onPress={onValidate} />
    </AppModal>
  )
}

const StyledDatePicker = styled(DatePicker).attrs(({ theme }) => ({
  textColor: theme.colors.black,
}))({ width: '100%', marginTop: -getSpacing(2) })
