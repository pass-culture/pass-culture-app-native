import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'

import { CheatcodesScreenAsyncStorage } from 'cheatcodes/pages/others/CheatcodesScreenAsyncStorage'
import { render, screen, userEvent } from 'tests/utils'

const user = userEvent.setup()

jest.useFakeTimers()

describe('<CheatcodesScreenAsyncStorage/>', () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
  })

  it('should display stored keys and values', async () => {
    await AsyncStorage.setItem('FollowArtistFakeDoorSurvey', 'true')

    render(<CheatcodesScreenAsyncStorage />)

    expect(await screen.findByText('FollowArtistFakeDoorSurvey')).toBeOnTheScreen()
    expect(screen.getByText('true')).toBeOnTheScreen()
  })

  it('should display empty label when storage is empty', async () => {
    render(<CheatcodesScreenAsyncStorage />)

    expect(await screen.findByText('L’AsyncStorage est vide.')).toBeOnTheScreen()
  })

  it('should remove only the targeted key when pressing its delete button', async () => {
    await AsyncStorage.setItem('keyA', 'valueA')
    await AsyncStorage.setItem('keyB', 'valueB')

    render(<CheatcodesScreenAsyncStorage />)

    await user.press(await screen.findByLabelText('Supprimer la clé keyA'))

    expect(await AsyncStorage.getItem('keyA')).toBeNull()
    expect(await AsyncStorage.getItem('keyB')).toBe('valueB')
    expect(screen.queryByText('keyA')).not.toBeOnTheScreen()
    expect(screen.getByText('keyB')).toBeOnTheScreen()
  })

  it('should remove all keys when pressing "Tout supprimer" button', async () => {
    await AsyncStorage.setItem('keyA', 'valueA')
    await AsyncStorage.setItem('keyB', 'valueB')

    render(<CheatcodesScreenAsyncStorage />)
    await screen.findByText('keyA')

    await user.press(screen.getByText('Tout supprimer'))

    expect(await screen.findByText('L’AsyncStorage est vide.')).toBeOnTheScreen()
    expect(await AsyncStorage.getAllKeys()).toEqual([])
  })
})
