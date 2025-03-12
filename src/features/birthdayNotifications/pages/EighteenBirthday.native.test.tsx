import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { setSettings } from 'features/auth/tests/setSettings'
import { nonBeneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { storage } from 'libs/storage'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

import { EighteenBirthday } from './EighteenBirthday'

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/firebase/analytics/analytics')

afterEach(() => {
  storage.clear('has_seen_eligible_card')
})

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.useFakeTimers()

describe('<EighteenBirthday />', () => {
  beforeEach(() => {
    setSettings({ wipEnableCreditV3: false })
    setFeatureFlags()
  })

  it('should render eighteen birthday', () => {
    render(reactQueryProviderHOC(<EighteenBirthday />))

    expect(screen).toMatchSnapshot()
  })

  it('should set `has_seen_eligible_card` to true in storage', async () => {
    expect(await storage.readObject('has_seen_eligible_card')).toBe(null)

    render(reactQueryProviderHOC(<EighteenBirthday />))

    expect(await storage.readObject('has_seen_eligible_card')).toBe(true)
  })

  it('should navigate to Stepper on button press', async () => {
    render(reactQueryProviderHOC(<EighteenBirthday />))

    await userEvent.setup().press(screen.getByText('Confirmer mes informations'))

    expect(navigate).toHaveBeenCalledWith('Stepper', undefined)
  })

  it('should render right wording when user require IdCheck', () => {
    mockAuthContextWithUser({ ...nonBeneficiaryUser, requiresIdCheck: true })

    render(reactQueryProviderHOC(<EighteenBirthday />))

    expect(screen.getByText('Vérifie ton identité pour débloquer tes 300 €.')).toBeOnTheScreen()
    expect(screen.getByText('Vérifier mon identité')).toBeOnTheScreen()
  })

  it('should display reset message', () => {
    render(reactQueryProviderHOC(<EighteenBirthday />))

    const subtitle = 'Ton crédit précédent a été remis à 0 €.'

    expect(screen.getByText(subtitle)).toBeOnTheScreen()
  })

  describe('when enableCreditV3 activated', () => {
    beforeEach(() => {
      setSettings({ wipEnableCreditV3: true })
    })

    it('should not display reset message', () => {
      render(reactQueryProviderHOC(<EighteenBirthday />))

      const subtitle = 'Ton crédit précédent a été remis à 0 €.'

      expect(screen.queryByText(subtitle)).not.toBeOnTheScreen()
    })
  })
})
