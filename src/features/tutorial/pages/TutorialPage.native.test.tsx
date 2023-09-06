import React from 'react'

import { fireEvent, render } from 'tests/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

import { TutorialPage } from './TutorialPage'

describe('TutorialPage', () => {
  it('should render correctly', () => {
    const renderAPI = renderTutorialPage()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should trigger onPress when clicking on button', async () => {
    const { getByLabelText } = renderTutorialPage()

    const button = getByLabelText('Continuer')
    fireEvent.press(button)

    expect(onPress).toHaveBeenCalledTimes(1)
  })
})

const onPress = jest.fn()
const renderTutorialPage = () =>
  render(
    <TutorialPage
      title="Titre"
      subtitle="Sous-titre"
      buttons={[<ButtonPrimary key={1} wording="Continuer" onPress={onPress} />]}
    />
  )
