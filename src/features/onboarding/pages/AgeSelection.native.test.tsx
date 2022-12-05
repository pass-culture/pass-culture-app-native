import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { AgeSelection } from 'features/onboarding/pages/AgeSelection'
import { env } from 'libs/environment/__mocks__/envFixtures'
import { fireEvent, render } from 'tests/utils'

const AGES = [15, 16, 17, 18]

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('AgeSelection', () => {
  it('should render correctly', () => {
    const renderAPI = render(<AgeSelection />)
    expect(renderAPI).toMatchSnapshot()
  })

  it.each(AGES)(
    'should navigate to AgeInformation page with params age=%s when pressing "j’ai %s ans"',
    (age) => {
      const { getByText } = render(<AgeSelection />)
      const button = getByText(`${age} ans`)

      fireEvent.press(button)
      expect(navigate).toHaveBeenCalledWith('AgeInformation', { age })
    }
  )

  it('should navigate to AgeSelectionOther page when pressing "Autre"', () => {
    const { getByText } = render(<AgeSelection />)
    const button = getByText('Autre')

    fireEvent.press(button)
    expect(navigate).toHaveBeenCalledWith('AgeSelectionOther', undefined)
  })

  it('should navigate to FAQ when pressing "Je suis un parent"', () => {
    const { getByTestId } = render(<AgeSelection />)
    const button = getByTestId('Je suis un parent')

    fireEvent.press(button)
    expect(openUrl).toHaveBeenCalledWith(env.FAQ_LINK_LEGAL_GUARDIAN, undefined)
  })
})
