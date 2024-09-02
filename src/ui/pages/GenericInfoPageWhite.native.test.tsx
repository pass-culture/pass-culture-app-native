import React from 'react'

import { fireEvent, render, screen } from 'tests/utils'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'

const onSkip = jest.fn()

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<GenericInfoPageWhite />', () => {
  it('should render correctly', () => {
    render(<GenericInfoPageWhite title="GenericInfoPageWhite" icon={BicolorPhonePending} />)

    expect(screen).toMatchSnapshot()
  })

  it('should call skip when onSkip is provided', () => {
    render(
      <GenericInfoPageWhite
        title="GenericInfoPageWhite"
        icon={BicolorPhonePending}
        onSkip={onSkip}
      />
    )

    const skipButton = screen.getByText('Passer')
    fireEvent.press(skipButton)

    expect(onSkip).toHaveBeenCalledTimes(1)
  })
})
