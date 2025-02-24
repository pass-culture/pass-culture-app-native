import React from 'react'

import { render, screen, userEvent } from 'tests/utils'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'

const onSkip = jest.fn()
const user = userEvent.setup()
jest.useFakeTimers()

describe('<GenericInfoPageWhite />', () => {
  it('should render correctly', () => {
    render(<GenericInfoPageWhite title="GenericInfoPageWhite" icon={BicolorPhonePending} />)

    expect(screen).toMatchSnapshot()
  })

  it('should call skip when onSkip is provided', async () => {
    render(
      <GenericInfoPageWhite
        title="GenericInfoPageWhite"
        icon={BicolorPhonePending}
        onSkip={onSkip}
      />
    )

    const skipButton = screen.getByText('Passer')
    await user.press(skipButton)

    expect(onSkip).toHaveBeenCalledTimes(1)
  })
})
