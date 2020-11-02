import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { IdCheckButton } from 'features/cheatcodes/components/IdCheckButton'

describe('IdCheckButton component', () => {
  it('calls navigate to IdCheck webview when pressed', () => {
    const component = render(<IdCheckButton />)

    const Button = component.getByText('IdCheck')
    fireEvent.press(Button)

    expect(navigate).toHaveBeenCalledWith('IdCheck')
  })
})
