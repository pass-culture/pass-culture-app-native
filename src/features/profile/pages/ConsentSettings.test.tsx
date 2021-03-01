import { StackScreenProps } from '@react-navigation/stack'
import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { goBack } from '__mocks__/@react-navigation/native'
import { RootStackParamList } from 'features/navigation/RootNavigator'

import { ConsentSettings } from './ConsentSettings'

describe('ConsentSettings', () => {
  it('should save on press', () => {
    const onGoBack = jest.fn() as () => void
    const navigationProps = {
      route: {
        params: { onGoBack },
      },
    } as StackScreenProps<RootStackParamList, 'ConsentSettings'>
    const { getByText } = render(<ConsentSettings {...navigationProps} />)

    const saveButton = getByText('Enregistrer')
    fireEvent.press(saveButton)
    expect(goBack).toBeCalled()
  })
})
