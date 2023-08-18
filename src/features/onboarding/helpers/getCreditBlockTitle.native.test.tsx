import React from 'react'
import { View } from 'react-native'

import { getCreditBlockTitle } from 'features/onboarding/helpers/getCreditBlockTitle'
import { render, screen } from 'tests/utils'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

describe('getCreditBlockTitle', () => {
  it('should return correct text for expired credit', () => {
    const result = getCreditBlockTitle({ age: 15, userAge: 16, deposit: '20\u00a0€' })

    render(<View>{result}</View>)

    expect(screen.queryByText('20\u00a0€')).toBeTruthy()
  })

  it('should return correct text for ongoing credit', () => {
    const result = getCreditBlockTitle({ age: 16, userAge: 16, deposit: '20\u00a0€' })

    render(<View>{result}</View>)

    expect(screen.queryByText('20\u00a0€')).toBeTruthy()
  })

  it('should return secondary text for ongoing credit', () => {
    const result = getCreditBlockTitle({ age: 15, userAge: 15, deposit: '20\u00a0€' })

    render(<View>{result}</View>)

    expect(screen.getByText('20\u00a0€')).toHaveStyle({ color: ColorsEnum.SECONDARY })
  })

  it('should return correct text for coming credit', () => {
    const result = getCreditBlockTitle({ age: 17, userAge: 16, deposit: '20\u00a0€' })

    render(<View>{result}</View>)

    expect(screen.queryByText('+ 20\u00a0€')).toBeTruthy()
  })
})
