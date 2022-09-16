import React from 'react'

import { BirthdayInformationModal } from 'features/auth/signup/SetBirthday/BirthdayInformationModal/BirthdayInformationModal'
import { render } from 'tests/utils'

jest.mock('features/auth/api', () => {
  const originalModule = jest.requireActual('features/auth/api')
  return {
    ...originalModule,
    useDepositAmountsByAge: jest.fn().mockReturnValue({
      fifteenYearsOldDeposit: '20\u00a0€',
      sixteenYearsOldDeposit: '30\u00a0€',
      seventeenYearsOldDeposit: '30\u00a0€',
      eighteenYearsOldDeposit: '300\u00a0€',
    }),
  }
})

describe('<BirthdayInformationModal />', () => {
  it('should render properly', () => {
    const renderAPI = render(<BirthdayInformationModal visible hideModal={jest.fn()} />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should show the correct deposit amount', () => {
    const { queryByText } = render(<BirthdayInformationModal visible hideModal={jest.fn()} />)
    expect(queryByText(new RegExp('20\u00a0€'))).toBeTruthy()
    expect(queryByText(new RegExp('300\u00a0€'))).toBeTruthy()
  })
})
