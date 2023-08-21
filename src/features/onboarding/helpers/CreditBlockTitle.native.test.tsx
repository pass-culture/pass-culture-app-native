import React from 'react'

import { CreditBlockTitle } from 'features/onboarding/helpers/CreditBlockTitle'
import { render, screen } from 'tests/utils'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

describe('CreditBlockTitle', () => {
  it('should return correct text for expired credit', () => {
    render(<CreditBlockTitle age={15} userAge={16} deposit={'20\u00a0€'} />)

    expect(screen.queryByText('20\u00a0€')).toBeTruthy()
  })

  it('should return correct text for ongoing credit', () => {
    render(<CreditBlockTitle age={16} userAge={16} deposit={'20\u00a0€'} />)

    expect(screen.queryByText('20\u00a0€')).toBeTruthy()
  })

  it('should return correct text for 18 years old credit', () => {
    render(<CreditBlockTitle age={18} userAge={16} deposit={'300\u00a0€'} />)

    expect(screen.queryByText('300\u00a0€')).toBeTruthy()
  })

  it('should return secondary text for ongoing credit', () => {
    render(<CreditBlockTitle age={15} userAge={15} deposit={'20\u00a0€'} />)

    expect(screen.getByText('20\u00a0€')).toHaveStyle({ color: ColorsEnum.SECONDARY })
  })

  it('should return correct text for coming credit', () => {
    render(<CreditBlockTitle age={17} userAge={16} deposit={'20\u00a0€'} />)

    expect(screen.queryByText('+ 20\u00a0€')).toBeTruthy()
  })
})
