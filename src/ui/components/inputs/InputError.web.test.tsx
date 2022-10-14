import React from 'react'

import { render } from 'tests/utils/web'

import { InputError } from './InputError'

describe('InputError Component', () => {
  it('should display the given message', () => {
    const { queryByText } = render(
      <InputError
        visible
        messageId="message"
        numberOfSpacesTop={1}
        relatedInputId="relatedInputId"
      />
    )

    const text = queryByText('message')
    expect(text).toBeTruthy()
  })
  it('should hide the given message', () => {
    const { queryByText } = render(
      <InputError
        visible={false}
        messageId="message"
        numberOfSpacesTop={1}
        relatedInputId="relatedInputId"
      />
    )

    const text = queryByText('message')
    expect(text).toBeFalsy()
  })
})
