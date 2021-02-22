import { render } from '@testing-library/react-native'
import React from 'react'

import { CallToAction } from '../CallToAction'

describe('<CallToAction />', () => {
  it('should render not disabled', () => {
    const { toJSON, queryByText } = render(
      <CallToAction
        wording="Wording to display"
        // eslint-disable-next-line no-console
        onPress={() => console.log('test')}
        isDisabled={false}
      />
    )
    expect(queryByText('Wording to display')).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render disabled', () => {
    const { toJSON, queryByText } = render(
      <CallToAction wording="Wording to display" onPress={undefined} isDisabled={true} />
    )
    expect(queryByText('Wording to display')).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })
})
