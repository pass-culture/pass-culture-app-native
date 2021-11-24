import debounce from 'lodash.debounce'
import React, { useCallback, useRef } from 'react'
import { View } from 'react-native'
import { DateData } from 'react-native-calendars/src/types'
import styled from 'styled-components/native'

import { useBooking } from 'features/bookOffer/pages/BookingOfferWrapper'
import { Step } from 'features/bookOffer/pages/reducer'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

import { OfferStatus } from '../../services/utils'

import { DiagonalStripe } from './DiagonalStripe'

interface Props {
  status: OfferStatus
  selected: boolean
  date: DateData
}

type VoidFn = () => void

export const useSelectDay = (): ((props: Props) => VoidFn | undefined) => {
  const { dispatch } = useBooking()
  const debouncedDispatch = useRef(debounce(dispatch, 300)).current

  const selectDate = (date: DateData) => () => {
    dispatch({ type: 'SELECT_DATE', payload: new Date(date.year, date.month - 1, date.day) })
    debouncedDispatch({ type: 'CHANGE_STEP', payload: Step.HOUR })
  }

  return useCallback(({ date, selected, status }: Props) => {
    if (selected) return selectDate(date)
    if (status === OfferStatus.BOOKABLE) return selectDate(date)
    return undefined
  }, [])
}

export const DayComponent: React.FC<Props> = ({ status, selected, date }) => {
  if (selected)
    return (
      <SelectedDay>
        <SelectedDayNumber color={ColorsEnum.WHITE}>{date.day}</SelectedDayNumber>
      </SelectedDay>
    )

  if (status === OfferStatus.BOOKABLE)
    return (
      <DayContainer>
        <Day color={ColorsEnum.PRIMARY}>{date.day}</Day>
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

const SelectedDayNumber = styled(Typo.ButtonText)({ alignSelf: 'center' })

const DayContainer = styled(View)({
  height: getSpacing(6),
  justifyContent: 'center',
})
