import { t } from '@lingui/macro'
import DatePicker from 'react-native-date-picker'
import React, { useState } from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer } from 'ui/theme'

import { Props } from './CalendarPicker.d'

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
      title=""
      leftIconAccessibilityLabel={undefined}
      leftIcon={undefined}
      onLeftIconPress={undefined}
      rightIconAccessibilityLabel={t`Fermer le calendrier`}
      rightIcon={Close}
      onRightIconPress={hideCalendar}>
      <StyledDatePicker
        testID="dateTimePicker"
        date={currentDate}
        mode="date"
        onDateChange={setCurrentDate}
        locale="fr-FR"
      />
      <Spacer.Column numberOfSpaces={2} />
      <ButtonPrimary wording={t`Valider la date`} onPress={onValidate} />
    </AppModal>
  )
}

const StyledDatePicker = styled(DatePicker).attrs(({ theme }) => ({
  textColor: theme.colors.black,
}))({ width: '100%', marginTop: -getSpacing(8) })
