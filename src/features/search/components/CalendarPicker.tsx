import { t } from '@lingui/macro'
import DateTimePicker from '@react-native-community/datetimepicker'
import React, { useState } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { DateFilterModal } from 'features/offer/components/DateFilterModal'
import { DateFilter } from 'features/search/atoms/Buttons'
import { _ } from 'libs/i18n'
import { formatToCompleteFrenchDate } from 'libs/parsers/formatDates'
import { useModal } from 'ui/components/modals/useModal'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

export const CalendarPicker: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(Date.now()))
  const [show, setShow] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState(new Date(Date.now()))
  const [isSelected, setIsSelected] = useState<boolean>(false)

  const { visible, showModal, hideModal } = useModal(false)

  const onChange = (_event: Event, selectedDate: Date | undefined) => {
    const chosenDate = selectedDate || currentDate
    //ANDROID --- Datepicker doesn't work on multiple click without the following line
    setShow(Platform.OS === 'ios')
    setCurrentDate(chosenDate)
  }

  const showDatepicker = () => {
    setShow(true)
    setIsSelected(true)
    showModal()
  }

  const onValidate = () => {
    setSelectedDate(currentDate)
    hideModal()
  }

  const renderDatePicker = (): JSX.Element | undefined => {
    if (!show) return

    if (Platform.OS === 'android') {
      return (
        <DateTimePicker
          testID="dateTimePicker"
          value={currentDate}
          mode="date"
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
          mode="date"
          onChange={onChange}
          date={currentDate}
          onValidate={onValidate}
        />
      )
    }
  }

  return (
    <React.Fragment>
      <ChosenDateContainer>
        <DateFilter text={_(t`Date précise`)} onPress={showDatepicker} />
        {isSelected && (
          <Typo.Body color={ColorsEnum.BLACK}>
            {formatToCompleteFrenchDate(selectedDate.getTime())}
          </Typo.Body>
        )}
      </ChosenDateContainer>
      {renderDatePicker()}
    </React.Fragment>
  )
}

const ChosenDateContainer = styled.View({ marginHorizontal: getSpacing(6) })
