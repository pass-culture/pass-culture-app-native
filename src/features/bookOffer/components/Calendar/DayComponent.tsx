import React, { useCallback } from 'react'
import { View } from 'react-native'
import { DateData } from 'react-native-calendars/src/types'
import styled, { DefaultTheme } from 'styled-components/native'

import { DiagonalStripe } from 'features/bookOffer/components/Calendar/DiagonalStripe'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { OfferStatus } from 'features/bookOffer/helpers/utils'
import { Typo } from 'ui/theme'

interface Props {
  status: OfferStatus
  selected: boolean
  date: DateData
}

type VoidFn = () => void

export const useSelectDay = (): ((props: Props) => VoidFn | undefined) => {
  const { dispatch } = useBookingContext()

  const selectDate = (date: DateData) => () => {
    dispatch({ type: 'SELECT_DATE', payload: new Date(date.year, date.month - 1, date.day) })
  }

  return useCallback<({ date, selected, status }: Props) => (() => void) | undefined>(
    ({ date, selected, status }) => {
      if (selected) return selectDate(date)
      if (status === OfferStatus.BOOKABLE) return selectDate(date)
      return undefined
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
}

export const DayComponent: React.FC<Props> = ({ status, selected, date }) => {
  if (selected) {
    return (
      <SelectedDay>
        <SelectedDayNumber>{date.day}</SelectedDayNumber>
      </SelectedDay>
    )
  }

  if (status === OfferStatus.BOOKABLE) {
    return (
      <DayContainer>
        <Day status={status}>{date.day}</Day>
      </DayContainer>
    )
  }

  if (status === OfferStatus.NOT_BOOKABLE) {
    return (
      <DiagonalStripe>
        <DayContainer>
          <Day status={status}>{date.day}</Day>
        </DayContainer>
      </DiagonalStripe>
    )
  }

  return (
    <DayContainer>
      <Body>{date.day}</Body>
    </DayContainer>
  )
}

function getStatusColor({ designSystem }: DefaultTheme, status: OfferStatus) {
  if (status === OfferStatus.BOOKABLE) return designSystem.color.text.brandPrimary
  if (status === OfferStatus.NOT_BOOKABLE) return designSystem.color.text.disabled
  return designSystem.color.text.subtle
}

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const Day = styled(Typo.Button)<{ status: OfferStatus }>(({ theme, status }) => ({
  textAlign: 'center',
  minWidth: theme.designSystem.size.spacing.xl,
  color: getStatusColor(theme, status),
}))

const SelectedDay = styled(View)(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.brandPrimary,
  borderRadius: theme.designSystem.size.spacing.m,
  minWidth: theme.designSystem.size.spacing.xl,
  minHeight: theme.designSystem.size.spacing.xl,
  paddingHorizontal: theme.designSystem.size.spacing.xs,
  alignSelf: 'center',
  justifyContent: 'center',
}))

const SelectedDayNumber = styled(Typo.Button)(({ theme }) => ({
  alignSelf: 'center',
  color: theme.designSystem.color.text.inverted,
}))

const DayContainer = styled(View)(({ theme }) => ({
  minHeight: theme.designSystem.size.spacing.xl,
  justifyContent: 'center',
}))
