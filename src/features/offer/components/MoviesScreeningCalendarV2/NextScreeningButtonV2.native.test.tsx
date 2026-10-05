import React from 'react'

import { render, screen } from 'tests/utils'

import { NextScreeningButtonV2 } from './NextScreeningButtonV2'

describe('NextScreeningButtonV2', () => {
  it('should display date properly', async () => {
    const dateToDisplay = '2026-09-02'
    render(<NextScreeningButtonV2 date={dateToDisplay} onPress={jest.fn()} />)

    expect(await screen.findByText('Mercredi 2 septembre')).toBeOnTheScreen()
  })
})
