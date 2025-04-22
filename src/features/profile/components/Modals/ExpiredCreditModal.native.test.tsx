import React from 'react'

import { ExpiredCreditModal } from 'features/profile/components/Modals/ExpiredCreditModal'
import { render, screen, userEvent } from 'tests/utils'

const hideModalMock = jest.fn()

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()

jest.useFakeTimers()

describe('<ExpiredCreditModal/>', () => {
  it('should render correctly', () => {
    render(<ExpiredCreditModal visible hideModal={hideModalMock} />)

    expect(screen).toMatchSnapshot()
  })

  it('should display nothing if modal is not visible', () => {
    render(<ExpiredCreditModal visible={false} hideModal={hideModalMock} />)

    expect(screen.toJSON()).not.toBeOnTheScreen()
  })

  it('should call hideModal function when clicking on Close icon', async () => {
    render(<ExpiredCreditModal visible hideModal={hideModalMock} />)
    const rightIcon = screen.getByTestId('Fermer la modale')
    await user.press(rightIcon)

    expect(hideModalMock).toHaveBeenCalledTimes(1)
  })
})
