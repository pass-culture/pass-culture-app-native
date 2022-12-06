import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { AgeSelectionOther } from 'features/onboarding/pages/AgeSelectionOther'
import { env } from 'libs/environment/__mocks__/envFixtures'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, waitFor } from 'tests/utils'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('AgeSelectionOther', () => {
  it('should render correctly', () => {
    const renderAPI = render(<AgeSelectionOther />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate to FAQ when pressing "Je suis un parent"', async () => {
    const { getByTestId } = render(<AgeSelectionOther />)
    const button = getByTestId('Je suis un parent')

    fireEvent.press(button)
    await waitFor(() => {
      expect(openUrl).toHaveBeenCalledWith(env.FAQ_LINK_LEGAL_GUARDIAN, undefined)
    })
  })

  it('should log analytics when pressing "Je suis un parent"', () => {
    const { getByTestId } = render(<AgeSelectionOther />)
    const button = getByTestId('Je suis un parent')

    fireEvent.press(button)
    expect(analytics.logGoToParentsFAQ).toHaveBeenCalledWith('ageselectionother')
  })

  it('should log analytics when pressing "j’ai moins de 15 ans"', () => {
    const { getByText } = render(<AgeSelectionOther />)
    const button = getByText('moins de 15 ans')

    fireEvent.press(button)
    expect(analytics.logSelectAge).toHaveBeenCalledWith('under_15')
  })

  it('should log analytics when pressing "j’ai plus de 18 ans"', () => {
    const { getByText } = render(<AgeSelectionOther />)
    const button = getByText('plus de 18 ans')

    fireEvent.press(button)
    expect(analytics.logSelectAge).toHaveBeenCalledWith('over_18')
  })
})
