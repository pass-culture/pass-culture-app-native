import React from 'react'

import { ExpiredCreditModal } from 'features/profile/components/Modals/ExpiredCreditModal'
import { fireEvent, render, screen } from 'tests/utils'

const hideModalMock = jest.fn()

describe('<ExpiredCreditModal/>', () => {
  it('should render correctly', () => {
    render(<ExpiredCreditModal visible hideModal={hideModalMock} />)
    expect(screen).toMatchSnapshot()
  })

  it('should display nothing if modal is not visible', () => {
    render(<ExpiredCreditModal visible={false} hideModal={hideModalMock} />)
    expect(screen.toJSON()).not.toBeOnTheScreen()
  })

  it('should call hideModal function when clicking on Close icon', () => {
    render(<ExpiredCreditModal visible hideModal={hideModalMock} />)
    const rightIcon = screen.getByTestId('Fermer la modale')
    fireEvent.press(rightIcon)
    expect(hideModalMock).toHaveBeenCalledTimes(1)
  })
})
