import { StackScreenProps } from '@react-navigation/stack'
import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { goBack } from '__mocks__/@react-navigation/native'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { storage } from 'libs/storage'

import { ConsentSettings } from './ConsentSettings'

describe('ConsentSettings', () => {
  afterEach(() => {
    storage.clear('has_accepted_cookie')
  })

  it('should save has_accepted_cookie to true (default) and go back on press', async () => {
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
    expect(await storage.readObject('has_accepted_cookie')).toBe(true)
  })

  it('should save has_accepted_cookie to false and go back on press', async () => {
    const onGoBack = jest.fn() as () => void
    const navigationProps = {
      route: {
        params: { onGoBack },
      },
    } as StackScreenProps<RootStackParamList, 'ConsentSettings'>
    const { getByText, getByTestId } = render(<ConsentSettings {...navigationProps} />)
    const toggleButton = getByTestId('filterSwitch')
    fireEvent.press(toggleButton)
    const saveButton = getByText('Enregistrer')
    fireEvent.press(saveButton)

    expect(goBack).toBeCalled()
    expect(await storage.readObject('has_accepted_cookie')).toBe(false)
  })
})
