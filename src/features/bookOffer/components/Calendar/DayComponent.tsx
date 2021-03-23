import debounce from 'lodash.debounce'
import React, { useRef } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { DateObject } from 'react-native-calendars'
import styled from 'styled-components/native'

import { useBooking } from 'features/bookOffer/pages/BookingOfferWrapper'
import { Step } from 'features/bookOffer/pages/reducer'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

import { OfferStatus } from '../../services/utils'

import { DiagonalStripe } from './DiagonalStripe'

interface Props {
  status: OfferStatus
  selected: boolean
  date: DateObject
}

const hitSlop = { top: 8, bottom: 8, left: 8, right: 8 }

export const DayComponent: React.FC<Props> = ({ status, selected, date }) => {
  const { dispatch } = useBooking()
  const debouncedDispatch = useRef(debounce(dispatch, 300)).current

  const selectDate = () => {
    dispatch({ type: 'SELECT_DATE', payload: new Date(date.year, date.month - 1, date.day) })
    debouncedDispatch({ type: 'CHANGE_STEP', payload: Step.HOUR })
  }

  if (selected)
    return (
      <SelectedDay>
        <TouchableOpacity activeOpacity={ACTIVE_OPACITY} onPress={selectDate} hitSlop={hitSlop}>
          <SelectedDayNumber color={ColorsEnum.WHITE}>{date.day}</SelectedDayNumber>
        </TouchableOpacity>
      </SelectedDay>
    )

  if (status === OfferStatus.BOOKABLE)
    return (
      <DayContainer>
        <TouchableOpacity activeOpacity={ACTIVE_OPACITY} onPress={selectDate} hitSlop={hitSlop}>
          <Day color={ColorsEnum.PRIMARY}>{date.day}</Day>
        </TouchableOpacity>
      </DayContainer>
    )

  if (status === OfferStatus.NOT_BOOKABLE)
    return (
      <DiagonalStripe>
        <DayContainer>
          <Day color={ColorsEnum.GREY_DARK}>{date.day}</Day>
        </DayContainer>
      </DiagonalStripe>
    )

  return (
    <DayContainer>
      <Typo.Body color={ColorsEnum.GREY_DARK}>{date.day}</Typo.Body>
    </DayContainer>
  )
}

const Day = styled(Typo.ButtonText)({
  textAlign: 'center',
  minWidth: getSpacing(6),
})

const SelectedDay = styled(View)({
  backgroundColor: ColorsEnum.PRIMARY,
  borderRadius: getSpacing(3),
  width: getSpacing(6),
  height: getSpacing(6),
  alignSelf: 'center',
  justifyContent: 'center',
})

const SelectedDayNumber = styled(Typo.ButtonText)({
  alignSelf: 'center',
})

const DayContainer = styled(View)({
  height: getSpacing(6),
  justifyContent: 'center',
})
