import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { EligibleFooter } from 'features/tutorial/components/profileTutorial/EligibleFooter'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { fireEvent, render, screen } from 'tests/utils'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag')

describe('<EligibleFooter />', () => {
  beforeEach(() => {
    activateFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
  })

  it('should display correct deposit for 15 years old', () => {
    render(<EligibleFooter age={15} />)

    expect(
      screen.getByText('Vérifie ton identité et active tes 20 € de crédit dès maintenant !')
    ).toBeOnTheScreen()
  })

  it('should display correct deposit for 18 years old', () => {
    render(<EligibleFooter age={18} />)

    expect(
      screen.getByText('Vérifie ton identité et active tes 300 € de crédit dès maintenant !')
    ).toBeOnTheScreen()
  })

  it('should navigate to Stepper when user press "Activer mon crédit"', () => {
    render(<EligibleFooter age={18} />)

    fireEvent.press(screen.getByText('Activer mon crédit'))

    expect(navigate).toHaveBeenCalledWith('Stepper', { from: 'Tutorial' })
  })
})

const activateFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
  useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
}
