import React from 'react'

import { OnboardingPage } from 'features/onboarding/pages/OnboardingPage'
import { fireEvent, render } from 'tests/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

describe('OnboardingPage', () => {
  it('should render correctly', () => {
    const renderAPI = renderOnBoardingPage()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should trigger onPress when clicking on button', async () => {
    const { getByLabelText } = renderOnBoardingPage()

    const button = getByLabelText('Continuer')
    fireEvent.press(button)

    expect(onPress).toHaveBeenCalledTimes(1)
  })
})

const onPress = jest.fn()
const renderOnBoardingPage = () =>
  render(
    <OnboardingPage
      title="Titre"
      subtitle="Sous-titre"
      buttons={[<ButtonPrimary key={1} wording="Continuer" onPress={onPress} />]}
    />
  )
