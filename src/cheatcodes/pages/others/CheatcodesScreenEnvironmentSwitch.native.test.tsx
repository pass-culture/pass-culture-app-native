import { HotUpdater } from '@hot-updater/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'

import { ENVIRONMENT_OVERRIDE_STORAGE_KEY } from 'libs/environment/envOverride/envOverride'
import * as keychainModule from 'libs/keychain/keychain'
import { render, screen, userEvent } from 'tests/utils'

import { CheatcodesScreenEnvironmentSwitch } from './CheatcodesScreenEnvironmentSwitch'

jest.mock('@hot-updater/react-native', () => ({
  HotUpdater: {
    reload: jest.fn(),
  },
}))

const mockClearRefreshToken = jest
  .spyOn(keychainModule, 'clearRefreshToken')
  .mockResolvedValue(undefined)

const user = userEvent.setup()

describe('<CheatcodesScreenEnvironmentSwitch />', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await AsyncStorage.clear()
  })

  it('should display the build and effective environments', () => {
    render(<CheatcodesScreenEnvironmentSwitch />)

    expect(screen.getByText('Environnement du build :')).toBeOnTheScreen()
    expect(screen.getByText('Environnement effectif :')).toBeOnTheScreen()
  })

  it('should open the confirmation modal when selecting another environment', async () => {
    render(<CheatcodesScreenEnvironmentSwitch />)

    await user.press(screen.getByText('staging'))

    expect(screen.getByText('Changer d’environnement')).toBeOnTheScreen()
  })

  it('should persist the override, purge the session and reload on confirmation', async () => {
    render(<CheatcodesScreenEnvironmentSwitch />)

    await user.press(screen.getByText('staging'))
    await user.press(screen.getByText('Confirmer et redémarrer'))

    expect(await AsyncStorage.getItem(ENVIRONMENT_OVERRIDE_STORAGE_KEY)).toBe('staging')
    expect(await AsyncStorage.getItem('access_token')).toBeNull()
    expect(mockClearRefreshToken).toHaveBeenCalledTimes(1)
    expect(HotUpdater.reload).toHaveBeenCalledTimes(1)
  })

  it('should not persist anything when cancelling', async () => {
    render(<CheatcodesScreenEnvironmentSwitch />)

    await user.press(screen.getByText('staging'))
    await user.press(screen.getByText('Annuler'))

    expect(await AsyncStorage.getItem(ENVIRONMENT_OVERRIDE_STORAGE_KEY)).toBeNull()
    expect(HotUpdater.reload).not.toHaveBeenCalled()
  })
})
