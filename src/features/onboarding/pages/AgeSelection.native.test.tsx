import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { AgeSelection } from 'features/onboarding/pages/AgeSelection'
import { env } from 'libs/environment/__mocks__/envFixtures'
import { analytics } from 'libs/firebase/analytics'
import { storage } from 'libs/storage'
import { fireEvent, render, waitFor } from 'tests/utils'

const AGES = [15, 16, 17, 18]

jest.mock('features/navigation/navigationRef')
const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('AgeSelection', () => {
  beforeEach(async () => {
    await storage.clear('user_age')
  })

  it('should render correctly', () => {
    const renderAPI = render(<AgeSelection />)
    expect(renderAPI).toMatchSnapshot()
  })

  it.each(AGES)(
    'should navigate to AgeInformation page with params age=%s when pressing "j’ai %s ans"',
    async (age) => {
      const { getByText } = render(<AgeSelection />)
      const button = getByText(`${age} ans`)

      fireEvent.press(button)

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('AgeInformation', { age })
      })
    }
  )

  it('should navigate to AgeSelectionOther page when pressing "Autre"', async () => {
    const { getByText } = render(<AgeSelection />)
    const button = getByText('Autre')

    fireEvent.press(button)
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('AgeSelectionOther', undefined)
    })
  })

  it('should navigate to FAQ when pressing "Je suis un parent"', async () => {
    const { getByTestId } = render(<AgeSelection />)
    const button = getByTestId('Je suis un parent')

    fireEvent.press(button)
    await waitFor(() => {
      expect(openUrl).toHaveBeenCalledWith(env.FAQ_LINK_LEGAL_GUARDIAN, undefined)
    })
  })

  it.each(AGES)('should log analytics with params age=%s when pressing "j’ai %s ans"', (age) => {
    const { getByText } = render(<AgeSelection />)
    const button = getByText(`${age} ans`)

    fireEvent.press(button)
    expect(analytics.logSelectAge).toHaveBeenCalledWith(age)
  })

  it('should log analytics when pressing "Autre"', () => {
    const { getByText } = render(<AgeSelection />)
    const button = getByText('Autre')

    fireEvent.press(button)
    expect(analytics.logSelectAge).toHaveBeenCalledWith('other')
  })

  it('should log analytics when pressing "Je suis un parent"', () => {
    const { getByTestId } = render(<AgeSelection />)
    const button = getByTestId('Je suis un parent')

    fireEvent.press(button)
    expect(analytics.logGoToParentsFAQ).toHaveBeenCalledWith('ageselection')
  })

  it.each(AGES)(
    'should set user age to %s in local storage  when pressing "j’ai %s ans"',
    async (age) => {
      const { getByText } = render(<AgeSelection />)
      const button = getByText(`${age} ans`)

      fireEvent.press(button)
      const userAge = await storage.readObject('user_age')
      expect(userAge).toBe(age)
    }
  )
})
