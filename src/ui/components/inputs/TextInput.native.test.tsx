import React from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { render, screen } from 'tests/utils'

import { TextInput } from './TextInput'

describe('<TextInput />', () => {
  const myRef = React.createRef<RNTextInput>()

  it('should render ref correctly', () => {
    render(<TextInput placeholder="placeholder" onChangeText={jest.fn()} ref={myRef} />)

    expect(myRef.current).toBeTruthy()
  })

  it('should display format when format is given', async () => {
    render(
      <TextInput
        placeholder="placeholder"
        onChangeText={jest.fn()}
        ref={myRef}
        format="toto@email.com"
      />
    )

    expect(screen.getByText('Exemple : toto@email.com')).toBeOnTheScreen()
  })

  it('should not display format when no format is given', async () => {
    render(<TextInput placeholder="placeholder" onChangeText={jest.fn()} ref={myRef} />)

    expect(screen.queryByText('Exemple : toto@email.com')).not.toBeOnTheScreen()
  })
})
