import React from 'react'

import { ExhaustedCreditModal } from 'features/profile/components/Modals/ExhaustedCreditModal'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, waitFor } from 'tests/utils'

const hideModalMock = jest.fn()

describe('<ExhaustedCreditModal/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<ExhaustedCreditModal visible={true} hideModal={hideModalMock} />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should log analytics', async () => {
    render(<ExhaustedCreditModal visible={true} hideModal={hideModalMock} />)

    await waitFor(() => {
      expect(analytics.logConsultModalNoMoreCredit).toBeCalled()
    })
  })

  it('should display nothing if modal is not visible', () => {
    const renderAPI = render(<ExhaustedCreditModal visible={false} hideModal={hideModalMock} />)
    expect(renderAPI.toJSON()).toBeNull()
  })

  it('should call hideModal function when clicking on Close icon', () => {
    const { getByTestId } = render(
      <ExhaustedCreditModal visible={true} hideModal={hideModalMock} />
    )
    const rightIcon = getByTestId('Fermer la modale')
    fireEvent.press(rightIcon)
    expect(hideModalMock).toHaveBeenCalled()
  })
})
