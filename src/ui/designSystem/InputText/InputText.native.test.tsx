import React from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { render, screen } from 'tests/utils'
import { InputText } from 'ui/designSystem/InputText/InputText'
import { Search } from 'ui/svg/icons/Search'

describe('<InputText />', () => {
  const myRef = React.createRef<RNTextInput>()

  it('should display label with asterisk when input required', () => {
    render(
      <InputText
        placeholder="placeholder"
        onChangeText={jest.fn()}
        ref={myRef}
        label="E-mail"
        isRequiredField
      />
    )

    expect(screen.getByText('E-mail *')).toBeOnTheScreen()
  })

  it('should display format when defined', () => {
    render(
      <InputText
        placeholder="placeholder"
        onChangeText={jest.fn()}
        ref={myRef}
        label="E-mail"
        format="Exemple : toto@email.com"
      />
    )

    expect(screen.getByText('Exemple : toto@email.com')).toBeOnTheScreen()
  })

  it('should display left icon when defined', () => {
    render(
      <InputText
        label="E-mail"
        placeholder="placeholder"
        onChangeText={jest.fn()}
        ref={myRef}
        leftComponent={<Search testID="leftIcon" />}
      />
    )

    expect(screen.getByTestId('leftIcon')).toBeOnTheScreen()
  })

  it('should display right button when defined', () => {
    render(
      <InputText
        label="E-mail"
        placeholder="placeholder"
        onChangeText={jest.fn()}
        ref={myRef}
        rightButton={{ icon: Search, accessibilityLabel: 'My right button', onPress: jest.fn() }}
      />
    )

    expect(screen.getByLabelText('My right button')).toBeOnTheScreen()
  })

  it('should display error message when defined', () => {
    render(
      <InputText
        label="E-mail"
        placeholder="placeholder"
        onChangeText={jest.fn()}
        ref={myRef}
        errorMessage="Error !!!"
      />
    )

    expect(screen.getByText('Error !!!')).toBeOnTheScreen()
  })

  it('should display character count when defined', () => {
    render(
      <InputText
        label="E-mail"
        placeholder="placeholder"
        onChangeText={jest.fn()}
        ref={myRef}
        characterCount={10}
      />
    )

    expect(screen.getByText('0/10')).toBeOnTheScreen()
  })
})
