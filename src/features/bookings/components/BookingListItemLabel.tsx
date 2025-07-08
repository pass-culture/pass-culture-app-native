import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Stock } from 'ui/svg/icons/Stock'
import { Typo, getSpacing } from 'ui/theme'

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

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  gap: getSpacing(2),
})

const StyledText = styled(Typo.BodyAccentXs)<{ color }>(({ color }) => ({
  color,
}))
