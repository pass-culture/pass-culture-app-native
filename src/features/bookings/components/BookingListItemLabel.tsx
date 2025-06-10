import React from 'react'
import styled from 'styled-components/native'

import { theme } from 'theme'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Stock } from 'ui/svg/icons/Stock'
import { Typo, getSpacing } from 'ui/theme'

type BookingListItemLabelProps = { alert?: boolean; text: string; icon: 'clock' | 'tickets' }

export const BookingListItemLabel = ({ alert, text, icon }: BookingListItemLabelProps) => {
  const colorToDisplay = alert
    ? theme.designSystem.color.text.error
    : theme.designSystem.color.text.default

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
