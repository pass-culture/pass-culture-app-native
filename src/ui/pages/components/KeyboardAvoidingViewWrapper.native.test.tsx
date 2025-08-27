import React from 'react'
import { Text, Platform } from 'react-native'

import { screen, render } from 'tests/utils'
import { KeyboardAvoidingViewWrapper } from 'ui/pages/components/KeyboardAvoidingViewWrapper'

describe('KeyboardAvoidingViewWrapper', () => {
  beforeEach(() => (Platform.OS = 'ios'))

  describe('platform is android', () => {
    beforeEach(() => (Platform.OS = 'android'))

    it('should render keyboard avoiding view when platform is android', async () => {
      renderKeyboardAvoidingViewWrapper()

      expect(await screen.findByText('Texte de rendu')).toBeOnTheScreen()
      expect(await screen.findByTestId('keyboard-avoiding-view')).toBeOnTheScreen()
    })
  })

  it('should not render keyboard avoiding view when platform is not android', async () => {
    renderKeyboardAvoidingViewWrapper()

    expect(await screen.findByText('Texte de rendu')).toBeOnTheScreen()
    expect(screen.queryByTestId('keyboard-avoiding-view')).not.toBeOnTheScreen()
  })
})

const renderKeyboardAvoidingViewWrapper = () => {
  render(
    <KeyboardAvoidingViewWrapper>
      <Text>Texte de rendu</Text>
    </KeyboardAvoidingViewWrapper>
  )
}
