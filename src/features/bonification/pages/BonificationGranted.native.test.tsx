import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { BonificationGranted } from 'features/bonification/pages/BonificationGranted'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('BonificationGranted', () => {
  beforeEach(() => setFeatureFlags())

  it('should go navigate to home when pressing "J’en profite"', async () => {
    render(<BonificationGranted />)

    const button = screen.getByText('J’en profite')
    await userEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('TabNavigator', { params: undefined, screen: 'Home' })
  })
})
