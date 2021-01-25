import { t } from '@lingui/macro'
import DateTimePicker from '@react-native-community/datetimepicker'
import React, { useState } from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'

import { Props } from './CalendarPicker.d'

export const CalendarPicker: React.FC<Props> = ({
  setSelectedDate,
  selectedDate,
  visible,
  hideCalendar,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(selectedDate)

  const onChange = (_event: Event, newDate: Date | undefined) => {
    setCurrentDate(newDate || currentDate)
  }

  const onValidate = () => {
    setSelectedDate(currentDate)
    hideCalendar()
  }

  return (
    <AppModal visible={visible} title="" rightIcon={Close} onRightIconPress={hideCalendar}>
      <Container>
        <DateTimePicker
          testID="dateTimePicker"
          value={currentDate}
          mode="date"
          is24Hour={true}
          display="spinner"
          onChange={onChange}
          textColor={ColorsEnum.BLACK}
        />
      </Container>
      <Spacer.Column numberOfSpaces={2} />
      <ButtonPrimary title={_(t`Valider la date`)} onPress={onValidate} />
    </AppModal>
  )
}

const Container = styled.View({ width: '100%', marginTop: -getSpacing(8) })
