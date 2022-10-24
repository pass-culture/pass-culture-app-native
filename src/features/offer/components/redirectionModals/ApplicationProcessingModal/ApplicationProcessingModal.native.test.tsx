import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { ApplicationProcessingModal } from 'features/offer/components/redirectionModals/ApplicationProcessingModal/ApplicationProcessingModal'
import { fireEvent, render } from 'tests/utils'

describe('<ApplicationProcessingModal />', () => {
  it('should navigate to profile on click on Aller sur mon profil', async () => {
    const { getByLabelText } = render(<ApplicationProcessingModal visible hideModal={jest.fn()} />)
    const button = getByLabelText('Aller sur mon profil')

    fireEvent.press(button)

    await waitForExpect(() => {
      expect(navigate).toHaveBeenCalledWith('TabNavigator', { screen: 'Profile' })
    })
  })
})
