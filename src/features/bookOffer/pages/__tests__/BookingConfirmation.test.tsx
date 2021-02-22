import { render } from '@testing-library/react-native'
import React from 'react'

import { BookingConfirmation } from '../BookingConfirmation'

describe('<BookingConfirmation />', () => {
  it('should render correctly', () => {
    const page = render(<BookingConfirmation />)
    expect(page).toMatchSnapshot()
  })
})
