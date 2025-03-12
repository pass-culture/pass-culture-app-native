import React from 'react'

import { render, screen, userEvent } from 'tests/utils'
import { GenericInfoPageWhiteLegacy } from 'ui/pages/GenericInfoPageWhiteLegacy'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'

const onSkip = jest.fn()
const user = userEvent.setup()
jest.useFakeTimers()

describe('<GenericInfoPageWhiteLegacy />', () => {
  it('should render correctly', () => {
    render(
      <GenericInfoPageWhiteLegacy title="GenericInfoPageWhiteLegacy" icon={BicolorPhonePending} />
    )

    expect(screen).toMatchSnapshot()
  })

  it('should call skip when onSkip is provided', async () => {
    render(
      <GenericInfoPageWhiteLegacy
        title="GenericInfoPageWhiteLegacy"
        icon={BicolorPhonePending}
        onSkip={onSkip}
      />
    )

    const skipButton = screen.getByText('Passer')
    await user.press(skipButton)

    expect(onSkip).toHaveBeenCalledTimes(1)
  })
})
