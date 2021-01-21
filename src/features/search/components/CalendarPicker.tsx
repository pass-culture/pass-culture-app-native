import { t } from '@lingui/macro'
import DateTimePicker from '@react-native-community/datetimepicker'
import React, { useState } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { DateFilterModal } from 'features/offer/components/DateFilterModal'
import { _ } from 'libs/i18n'
import { formatToCompleteFrenchDate } from 'libs/parsers/formatDates'
import { useModal } from 'ui/components/modals/useModal'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

import { DateFilterButton } from '../atoms/DateFilterButton'

export const CalendarPicker: React.FC = () => {
  const [date, setDate] = useState(new Date(Date.now()))
  const [show, setShow] = useState<boolean>(false)
  const [isSelected, setIsSelected] = useState<boolean>(false)

  const onChange = (_event: Event, selectedDate: Date | undefined) => {
    const chosenDate = selectedDate || date
    setShow(Platform.OS === 'ios')
    setDate(chosenDate)
  }

  const showMode = () => {
    setShow(true)
    setIsSelected(true)
  }

  const showDatepicker = () => {
    showMode()
    showModal()
  }

  const { visible, showModal, hideModal } = useModal(false)

  const renderDatePicker = (): JSX.Element | undefined => {
    if (!show) return

    if (Platform.OS === 'android') {
      return (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={'date'}
          is24Hour={true}
          display="spinner"
          onChange={onChange}
        />
      )
    } else {
      return (
        <DateFilterModal
          visible={visible}
          dismissModal={hideModal}
          mode={'date'}
          onChange={onChange}
          date={date}
        />
      )
    }
  }

  return (
    <React.Fragment>
      <DateFilterButton text={_(t`Date précise`)} onPress={showDatepicker} />
      {isSelected && (
        <ChosenDateContainer>
          <Typo.Body color={ColorsEnum.BLACK}>
            {formatToCompleteFrenchDate(date.getTime())}
          </Typo.Body>
        </ChosenDateContainer>
      )}
      {renderDatePicker()}
    </React.Fragment>
  )
}

const ChosenDateContainer = styled.View({
  marginHorizontal: getSpacing(6),
})
