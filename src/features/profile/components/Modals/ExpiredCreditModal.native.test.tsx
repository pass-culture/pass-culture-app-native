import React from 'react'

import { ExpiredCreditModal } from 'features/profile/components/Modals/ExpiredCreditModal'
import { fireEvent, render } from 'tests/utils'

const hideModalMock = jest.fn()

describe('<ExpiredCreditModal/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<ExpiredCreditModal visible hideModal={hideModalMock} />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should display nothing if modal is not visible', () => {
    const renderAPI = render(<ExpiredCreditModal visible={false} hideModal={hideModalMock} />)
    expect(renderAPI.toJSON()).toBeNull()
  })

  it('should call hideModal function when clicking on Close icon', () => {
    const { getByTestId } = render(<ExpiredCreditModal visible hideModal={hideModalMock} />)
    const rightIcon = getByTestId('Fermer la modale')
    fireEvent.press(rightIcon)
    expect(hideModalMock).toHaveBeenCalledTimes(1)
  })
})
