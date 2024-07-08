import React from 'react'

import { DAYS } from 'shared/date/days'
import { MONTHS } from 'shared/date/months'
import { render, screen } from 'tests/utils'

import { NextScreeningButton } from './NextScreeningButton'

describe('NextScreeningButton', () => {
  it('should display date properly', async () => {
    const dateToDisplay = new Date()
    render(<NextScreeningButton date={dateToDisplay} />)

    const weekDay = DAYS[dateToDisplay.getDay()]
    const dayDate = dateToDisplay.getDate()
    const month = MONTHS[dateToDisplay.getMonth()]

    expect(await screen.findByText(`${weekDay} ${dayDate} ${month}`)).toBeOnTheScreen()
  })
})
