import { t } from '@lingui/macro'
import DateTimePicker from '@react-native-community/datetimepicker'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer } from 'ui/theme'

interface Props {
  visible: boolean
  dismissModal: () => void
  date: Date
  mode: 'time' | 'date' | undefined
  onChange: (event: Event, selectedDate: Date | undefined) => void
  onValidate: () => void
}

export const DateFilterModal: FunctionComponent<Props> = ({
  visible,
  dismissModal,
  date,
  mode,
  onChange,
  onValidate,
}) => {
  return (
    <AppModal visible={visible} title="" rightIcon={Close} onRightIconPress={dismissModal}>
      <Container>
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="spinner"
          onChange={onChange}
        />
      </Container>
      <Spacer.Column numberOfSpaces={2} />
      <ButtonPrimary title={_(t`Valider la date`)} onPress={onValidate} />
    </AppModal>
  )
}

const Container = styled.View({ width: '100%', marginTop: -getSpacing(8) })
