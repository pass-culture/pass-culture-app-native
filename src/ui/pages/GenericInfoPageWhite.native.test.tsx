import React from 'react'

import { fireEvent, render } from 'tests/utils'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'

const onSkip = jest.fn()
describe('<GenericInfoPageWhite />', () => {
  it('should render correctly', () => {
    const renderAPI = render(
      <GenericInfoPageWhite title="GenericInfoPageWhite" icon={BicolorPhonePending} />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should call skip when onSkip is provided', () => {
    const { getByText } = render(
      <GenericInfoPageWhite
        title="GenericInfoPageWhite"
        icon={BicolorPhonePending}
        onSkip={onSkip}
      />
    )

    const skipButton = getByText('Passer')
    fireEvent.press(skipButton)

    expect(onSkip).toHaveBeenCalledTimes(1)
  })
})
