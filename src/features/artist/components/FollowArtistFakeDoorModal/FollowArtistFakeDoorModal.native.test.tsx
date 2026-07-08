import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'

import {
  FOLLOW_ARTIST_FAKE_DOOR_SURVEY,
  FollowArtistFakeDoorModal,
} from 'features/artist/components/FollowArtistFakeDoorModal/FollowArtistFakeDoorModal'
import { render, screen, userEvent } from 'tests/utils'
import { theme } from 'theme'

jest.mock('libs/firebase/analytics/analytics')

const asyncStorageSpyOn = jest.spyOn(AsyncStorage, 'getItem')
const asyncStorageSetItemSpy = jest.spyOn(AsyncStorage, 'setItem')

const user = userEvent.setup()

jest.useFakeTimers()

describe('FollowArtistFakeDoorModal', () => {
  describe('When user has not seen survey', () => {
    it('should display circled clock icon', () => {
      render(<FollowArtistFakeDoorModal visible close={jest.fn()} />)

      expect(screen.getByTestId('CircledClock')).toBeOnTheScreen()
    })

    it('should display specific body text', () => {
      render(<FollowArtistFakeDoorModal visible close={jest.fn()} />)

      expect(
        screen.getByText(/Cette fonctionnalité n’est pas encore disponible/i)
      ).toBeOnTheScreen()
    })

    it('should display primary button', () => {
      render(<FollowArtistFakeDoorModal visible close={jest.fn()} />)

      const button = screen.getByLabelText('Donner mon avis')

      expect(button.props.style.backgroundColor).toEqual(
        theme.designSystem.color.background.brandPrimary
      )
    })

    it('should mark the survey as seen when pressing "Donner mon avis" button', async () => {
      const mockClose = jest.fn()
      render(<FollowArtistFakeDoorModal visible close={mockClose} />)

      await user.press(screen.getByLabelText('Donner mon avis'))

      expect(asyncStorageSetItemSpy).toHaveBeenCalledWith(FOLLOW_ARTIST_FAKE_DOOR_SURVEY, 'true')
      expect(mockClose).toHaveBeenCalledWith()
    })
  })

  describe('When user has seen survey', () => {
    beforeEach(() => {
      asyncStorageSpyOn.mockResolvedValueOnce('true')
    })

    it('should display circle checked icon', async () => {
      render(<FollowArtistFakeDoorModal visible close={jest.fn()} />)

      expect(await screen.findByTestId('CircleChecked')).toBeOnTheScreen()
    })

    it('should display specific body text', async () => {
      render(<FollowArtistFakeDoorModal visible close={jest.fn()} />)

      expect(
        await screen.findByText(/Il semble que tu aies déjà répondu au questionnaire/i)
      ).toBeOnTheScreen()
    })

    it('should display secondary button', async () => {
      render(<FollowArtistFakeDoorModal visible close={jest.fn()} />)

      const button = await screen.findByLabelText('Répondre au questionnaire')

      expect(button.props.style.backgroundColor).toEqual(
        theme.designSystem.color.background.default
      )
    })

    it('should display close button', async () => {
      render(<FollowArtistFakeDoorModal visible close={jest.fn()} />)

      expect(await screen.findByText('Fermer')).toBeOnTheScreen()
    })
  })
})
