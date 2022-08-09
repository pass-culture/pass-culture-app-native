import React from 'react'

import { ExpiredCreditModal } from 'features/profile/components/Modals/ExpiredCreditModal'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, waitFor } from 'tests/utils'

const hideModalMock = jest.fn()

describe('<ExpiredCreditModal/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<ExpiredCreditModal visible={true} hideModal={hideModalMock} />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should log analytics', async () => {
    render(<ExpiredCreditModal visible={true} hideModal={hideModalMock} />)

    await waitFor(() => {
      expect(analytics.logConsultModalExpiredGrant).toBeCalled()
    })
  })

  it('should display nothing if modal is not visible', () => {
    const renderAPI = render(<ExpiredCreditModal visible={false} hideModal={hideModalMock} />)
    expect(renderAPI.toJSON()).toBeNull()
  })

  it('should call hideModal function when clicking on Close icon', () => {
    const { getByTestId } = render(<ExpiredCreditModal visible={true} hideModal={hideModalMock} />)
    const rightIcon = getByTestId('Fermer la modale')
    fireEvent.press(rightIcon)
    expect(hideModalMock).toHaveBeenCalled()
  })
})
