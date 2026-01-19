import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Digital } from 'ui/svg/icons/Digital'
import { Stock } from 'ui/svg/icons/Stock'
import { Typo } from 'ui/theme'

type BookingListItemLabelIcon = 'clock' | 'tickets' | 'digital'

type BookingListItemLabelProps = {
  alert?: boolean
  text: string
  icon: BookingListItemLabelIcon
}

const ICON_MAPING: Record<BookingListItemLabelIcon, FunctionComponent<{ color: string }>> = {
  clock: ClockFilled,
  tickets: Stock,
  digital: Digital,
}

export const BookingListItemLabel = ({ alert, text, icon }: BookingListItemLabelProps) => {
  const { designSystem } = useTheme()
  const colorToDisplay = alert ? designSystem.color.text.error : designSystem.color.text.default

  const Icon = ICON_MAPING[icon]

  return (
    <Row>
      {<Icon color={colorToDisplay} />}
      <StyledText color={colorToDisplay} numberOfLines={2}>
        {text}
      </StyledText>
    </Row>
  )
}

const Row = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.designSystem.size.spacing.s,
}))

const StyledText = styled(Typo.BodyAccentXs)<{ color }>(({ color }) => ({
  color,
}))
