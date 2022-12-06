import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { OnboardingWrapper } from 'features/onboarding/context/OnboardingWrapper'
import { AgeSelectionOther } from 'features/onboarding/pages/AgeSelectionOther'
import { env } from 'libs/environment/__mocks__/envFixtures'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, waitFor } from 'tests/utils'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

const mockShowModal = jest.fn()
jest.mock('ui/components/modals/useModal', () => ({
  useModal: () => ({
    visible: false,
    showModal: mockShowModal,
    hideModal: jest.fn(),
  }),
}))

describe('AgeSelectionOther', () => {
  it('should render correctly', () => {
    const renderAPI = renderAgeSelectionOther()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate to FAQ when pressing "Je suis un parent"', async () => {
    const { getByTestId } = renderAgeSelectionOther()
    const button = getByTestId('Je suis un parent')

    fireEvent.press(button)
    await waitFor(() => {
      expect(openUrl).toHaveBeenCalledWith(env.FAQ_LINK_LEGAL_GUARDIAN, undefined)
    })
  })

  it('should log analytics when pressing "Je suis un parent"', async () => {
    const { getByTestId } = renderAgeSelectionOther()
    const button = getByTestId('Je suis un parent')

    fireEvent.press(button)
    expect(analytics.logGoToParentsFAQ).toHaveBeenCalledWith('ageselectionother')
  })

  it('should show modal when pressing "j’ai moins de 15 ans"', () => {
    const { getByText } = renderAgeSelectionOther()
    const button = getByText('moins de 15 ans')

    fireEvent.press(button)
    expect(mockShowModal).toHaveBeenCalledTimes(1)
  })

  it('should show modal when pressing "j’ai plus de 18 ans"', () => {
    const { getByText } = renderAgeSelectionOther()
    const button = getByText('plus de 18 ans')

    fireEvent.press(button)
    expect(mockShowModal).toHaveBeenCalledTimes(1)
  })

  it('should navigate to home when pressing "j’ai moins de 15 ans"', async () => {
    const { getByText } = renderAgeSelectionOther()
    const button = getByText('moins de 15 ans')

    fireEvent.press(button)
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(...homeNavConfig)
    })
  })

  it('should navigate to home when pressing "j’ai plus de 18 ans"', async () => {
    const { getByText } = renderAgeSelectionOther()
    const button = getByText('plus de 18 ans')

    fireEvent.press(button)
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(...homeNavConfig)
    })
  })

  it('should log analytics when pressing "j’ai moins de 15 ans"', () => {
    const { getByText } = renderAgeSelectionOther()
    const button = getByText('moins de 15 ans')

    fireEvent.press(button)
    expect(analytics.logSelectAge).toHaveBeenCalledWith('under_15')
  })

  it('should log analytics when pressing "j’ai plus de 18 ans"', () => {
    const { getByText } = renderAgeSelectionOther()
    const button = getByText('plus de 18 ans')

    fireEvent.press(button)
    expect(analytics.logSelectAge).toHaveBeenCalledWith('over_18')
  })
})

const renderAgeSelectionOther = () =>
  render(
    <OnboardingWrapper>
      <AgeSelectionOther />
    </OnboardingWrapper>
  )
