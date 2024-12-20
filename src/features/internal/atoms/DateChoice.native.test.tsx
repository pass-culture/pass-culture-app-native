import React from 'react'

import { DateChoice } from 'features/internal/atoms/DateChoice'
import { render, screen } from 'tests/utils'

jest.useFakeTimers()

describe('<DateChoice />', () => {
  it('should render null in native', () => {
    render(<DateChoice onChange={jest.fn()} />)

    expect(screen.toJSON()).toBeNull()
  })
})
