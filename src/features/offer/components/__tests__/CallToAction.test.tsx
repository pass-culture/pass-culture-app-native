import { render } from '@testing-library/react-native'
import React from 'react'

import { CategoryType } from 'api/gen'

import { CallToAction } from '../CallToAction'

jest.mock('features/offer/services/useCtaWording', () => ({
  useCtaWording: (_: { categoryType: CategoryType }) => 'Wording to display',
}))
describe('<CallToAction />', () => {
  it('should render', () => {
    const { toJSON, queryByText } = render(<CallToAction categoryType={CategoryType.Event} />)
    expect(queryByText('Wording to display')).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })
})
