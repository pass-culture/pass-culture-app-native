import { t } from '@lingui/macro'
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
  const [mode, setMode] = useState<'time' | 'date' | undefined>('date')
  const [show, setShow] = useState<boolean>(false)
  const [isSelected, setIsSelected] = useState<boolean>(false)

  const onChange = (event: Event, selectedDate: Date | undefined) => {
    const chosenDate = selectedDate || date
    setShow(Platform.OS === 'ios')
    setDate(chosenDate)
  }

  const showMode = (currentMode: 'time' | 'date' | undefined) => {
    setShow(true)
    setMode(currentMode)
    setIsSelected(true)
  }

  const showDatepicker = () => {
    showMode('date')
    showDateFilterModal()
  }

  const { visible: dateFilterModalVisible, showModal: showDateFilterModal, hideModal } = useModal(
    false
  )

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
      {show && (
        <DateFilterModal
          visible={dateFilterModalVisible}
          dismissModal={hideModal}
          mode={mode}
          onChange={onChange}
          date={date}
        />
      )}
    </React.Fragment>
  )
}

const ChosenDateContainer = styled.View({
  marginHorizontal: getSpacing(6),
})
