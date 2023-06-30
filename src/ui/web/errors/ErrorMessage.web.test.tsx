import React from 'react'
import { Text } from 'react-native'

import { render } from 'tests/utils/web'

import { ErrorMessage } from './ErrorMessage'

describe('<ErrorMessage />', () => {
  it('should render correctly', () => {
    const renderErrorMessage = render(
      <ErrorMessage relatedInputId="relatedInputId">
        <Text>Error Text Message</Text>
      </ErrorMessage>
    )
    expect(renderErrorMessage).toMatchSnapshot()
  })
})
