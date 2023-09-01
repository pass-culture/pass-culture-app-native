import React from 'react'
import { Linking } from 'react-native'
import Share, { Social } from 'react-native-share'

import * as GetInstalledAppsAPI from 'features/offer/helpers/getInstalledApps/getInstalledApps'
import { eventMonitoring } from 'libs/monitoring'
import { render, screen, act, fireEvent } from 'tests/utils'
import { Network } from 'ui/components/ShareMessagingApp'

import { InstalledMessagingApps } from './InstalledMessagingApps'

const shareMessage = 'Retrouve cette offre sur le passCulture'
const shareUrl = 'https://passculture.app/accueil'
const logShareMock = jest.fn()

const props = { shareMessage, shareUrl, messagingAppAnalytics: logShareMock }
const canOpenURLSpy = jest.spyOn(Linking, 'canOpenURL')
const mockShareSingle = jest.spyOn(Share, 'shareSingle')
const getInstalledAppsMock = jest.spyOn(GetInstalledAppsAPI, 'getInstalledApps')

describe('<InstalledMessagingApps />', () => {
  it('should display social medium when installed', async () => {
    canOpenURLSpy.mockResolvedValueOnce(true)
    render(<InstalledMessagingApps {...props} />)

    expect(await screen.findByText(`Envoyer sur ${[Network.instagram]}`)).toBeOnTheScreen()
  })

  it('should hide social medium when not installed', async () => {
    canOpenURLSpy.mockResolvedValueOnce(false)
    render(<InstalledMessagingApps {...props} />)
    await act(async () => {})

    expect(screen.queryByText(`Envoyer sur ${[Network.instagram]}`)).toBeNull()
  })

  it('should not display more than 3 social media apps', async () => {
    canOpenURLSpy
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)

    render(<InstalledMessagingApps {...props} />)

    expect(await screen.findAllByText(/Envoyer sur/)).toHaveLength(3)
  })

  it('should open social medium on share button press', async () => {
    canOpenURLSpy.mockResolvedValueOnce(true)
    render(<InstalledMessagingApps {...props} />)

    await act(async () => {
      fireEvent.press(await screen.findByText(`Envoyer sur ${[Network.instagram]}`))
    })

    expect(mockShareSingle).toHaveBeenCalledWith({
      social: Social.Instagram,
      message: encodeURI(
        'Retrouve cette offre sur le passCulture\nhttps://passculture.app/accueil'
      ),
      type: 'text',
      url: undefined,
    })
  })

  it('should open social medium on share button press with offer url even when web url is defined', async () => {
    canOpenURLSpy.mockResolvedValueOnce(true).mockResolvedValueOnce(true) // First mock for Instagram, second for Whatsapp
    render(<InstalledMessagingApps {...props} />)

    await act(async () => {
      fireEvent.press(await screen.findByText(`Envoyer sur ${[Network.whatsapp]}`))
    })

    expect(mockShareSingle).toHaveBeenCalledWith({
      social: Social.Whatsapp,
      message: 'Retrouve cette offre sur le passCulture',
      url: 'https://passculture.app/accueil',
    })
  })

  it('should log analytics on social press', async () => {
    canOpenURLSpy.mockResolvedValueOnce(true)
    render(<InstalledMessagingApps {...props} />)

    await act(async () => {
      fireEvent.press(await screen.findByText(`Envoyer sur ${[Network.instagram]}`))
    })

    expect(logShareMock).toHaveBeenCalledWith(Social.Instagram)
  })

  it('should log to sentry when an error occurs during installed apps check', async () => {
    const error = new Error('error message')
    getInstalledAppsMock.mockRejectedValueOnce(error)
    render(<InstalledMessagingApps {...props} />)
    await act(async () => {})

    expect(eventMonitoring.captureException).toHaveBeenCalledWith(`Installed apps: ${error}`)
  })

  it('should log to sentry when an error occurs when clicking on messaging app', async () => {
    const error = new Error('error message')
    mockShareSingle.mockRejectedValueOnce(error)
    canOpenURLSpy.mockResolvedValueOnce(true)
    render(<InstalledMessagingApps {...props} />)

    await act(async () => {
      const socialMediumButton = await screen.findByText(`Envoyer sur ${[Network.instagram]}`)
      fireEvent.press(socialMediumButton)
    })

    expect(eventMonitoring.captureException).toHaveBeenCalledWith(`MessagingApp click: ${error}`)
  })
})
