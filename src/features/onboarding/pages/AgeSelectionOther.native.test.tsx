import React from 'react'

import { reset } from '__mocks__/@react-navigation/native'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { OnboardingWrapper } from 'features/onboarding/context/OnboardingWrapper'
import { AgeSelectionOther } from 'features/onboarding/pages/AgeSelectionOther'
import { analytics } from 'libs/analytics'
import { storage } from 'libs/storage'
import { fireEvent, render, waitFor } from 'tests/utils'

const mockShowModal = jest.fn()
jest.mock('ui/components/modals/useModal', () => ({
  useModal: () => ({
    visible: false,
    showModal: mockShowModal,
    hideModal: jest.fn(),
  }),
}))

describe('AgeSelectionOther', () => {
  beforeEach(async () => {
    await storage.clear('user_age')
  })

  it('should render correctly', () => {
    const renderAPI = renderAgeSelectionOther()
    expect(renderAPI).toMatchSnapshot()
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
      expect(reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: homeNavConfig[0] }] })
    })
  })

  it('should navigate to home when pressing "j’ai plus de 18 ans"', async () => {
    const { getByText } = renderAgeSelectionOther()
    const button = getByText('plus de 18 ans')

    fireEvent.press(button)
    await waitFor(() => {
      expect(reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: homeNavConfig[0] }] })
    })
  })

  it('should log analytics when pressing "j’ai plus de 18 ans"', () => {
    const { getByText } = renderAgeSelectionOther()
    const button = getByText('plus de 18 ans')

    fireEvent.press(button)
    expect(analytics.logSelectAge).toHaveBeenCalledWith('over_18')
  })

  it('should save user age to local storage "j’ai moins de 15 ans"', async () => {
    const { getByText } = renderAgeSelectionOther()
    const button = getByText('moins de 15 ans')

    fireEvent.press(button)
    const userAge = await storage.readObject('user_age')
    expect(userAge).toBe('under_15')
  })

  it('should save user age to local storage when pressing "j’ai plus de 18 ans"', async () => {
    const { getByText } = renderAgeSelectionOther()
    const button = getByText('plus de 18 ans')

    fireEvent.press(button)
    const userAge = await storage.readObject('user_age')
    expect(userAge).toBe('over_18')
  })
})

const renderAgeSelectionOther = () =>
  render(
    <OnboardingWrapper>
      <AgeSelectionOther />
    </OnboardingWrapper>
  )
