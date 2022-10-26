import React from 'react'

import { render } from 'tests/utils/web'

import { IdentityCheckValidation } from './IdentityCheckValidation'

jest.mock('features/identityCheck/context/SubscriptionContextProvider')
jest.mock('features/identityCheck/useIdentityCheckNavigation')

describe('<IdentityCheckValidation />', () => {
  it('should render IdentityCheckValidation component correctly', () => {
    const renderAPI = render(<IdentityCheckValidation />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should display user infos with props given', () => {
    const { getByText } = render(<IdentityCheckValidation />)
    expect(getByText('John')).toBeTruthy()
    expect(getByText('Doe')).toBeTruthy()
    expect(getByText('28/01/1993')).toBeTruthy()
  })
})
