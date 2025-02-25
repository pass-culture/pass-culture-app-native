import React from 'react'

import { render, screen, userEvent } from 'tests/utils'

import { MarketingModal } from './MarketingModal'

const props = {
  visible: true,
  title: 'Titre',
  imageSource: { uri: '' },
  onBackdropPress: jest.fn(),
}

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})
const user = userEvent.setup()
jest.useFakeTimers()

describe('MarketingModal', () => {
  it('should render correctly', () => {
    render(<MarketingModal {...props} />)

    expect(screen).toMatchSnapshot()
  })

  it('should call onBackdropPress when clicking outside modal', async () => {
    render(<MarketingModal {...props} />)
    const clickAwayArea = screen.getByTestId('clickaway-area')
    await user.press(clickAwayArea)

    expect(props.onBackdropPress).toHaveBeenCalledTimes(1)
  })
})
