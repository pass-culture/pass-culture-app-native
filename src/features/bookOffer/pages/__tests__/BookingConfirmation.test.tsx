import { render } from '@testing-library/react-native'
import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { BookingConfirmation } from '../BookingConfirmation'

jest.mock('features/home/services/useAvailableCredit', () => ({
  useAvailableCredit: jest.fn(() => ({ isExpired: false, amount: 2000 })),
}))

describe('<BookingConfirmation />', () => {
  it('should render correctly', () => {
    const page = render(reactQueryProviderHOC(<BookingConfirmation />))
    expect(page).toMatchSnapshot()
  })
})
