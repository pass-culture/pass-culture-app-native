import { t } from '@lingui/macro'
import DateTimePicker from '@react-native-community/datetimepicker'
import React, { useState } from 'react'
import styled from 'styled-components/native'

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
    <AppModal
      visible={visible}
      title=""
      leftIconAccessibilityLabel={undefined}
      leftIcon={undefined}
      onLeftIconPress={undefined}
      rightIconAccessibilityLabel={t`Fermer le calendrier`}
      rightIcon={Close}
      onRightIconPress={hideCalendar}>
      <Container>
        <DateTimePicker
          testID="dateTimePicker"
          value={currentDate}
          mode="date"
          is24Hour={true}
          display="spinner"
          // @ts-expect-error FIXME: Type '(_event: Event, newDate: Date | undefined) => void' is not assignable to type '(event: Event, date?: Date | undefined) => void'. Added with PR #1272 when adding Web support
          onChange={onChange}
          textColor={ColorsEnum.BLACK}
          locale="fr-FR"
        />
      </Container>
      <Spacer.Column numberOfSpaces={2} />
      <ButtonPrimary title={t`Valider la date`} onPress={onValidate} />
    </AppModal>
  )
}

const Container = styled.View({ width: '100%', marginTop: -getSpacing(8) })
