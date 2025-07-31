import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Stock } from 'ui/svg/icons/Stock'
import { Typo } from 'ui/theme'

type BookingListItemLabelProps = { alert?: boolean; text: string; icon: 'clock' | 'tickets' }

export const BookingListItemLabel = ({ alert, text, icon }: BookingListItemLabelProps) => {
  const { designSystem } = useTheme()
  const colorToDisplay = alert ? designSystem.color.text.error : designSystem.color.text.default
  return (
    <Row>
      {icon === 'clock' ? <ClockFilled color={colorToDisplay} /> : <Stock color={colorToDisplay} />}
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
