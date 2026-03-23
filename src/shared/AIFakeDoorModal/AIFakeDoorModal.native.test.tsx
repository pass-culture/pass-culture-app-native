import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'

import { AIFakeDoorModal, AI_FAKE_DOOR_SURVEY } from 'shared/AIFakeDoorModal/AIFakeDoorModal'
import { render, screen, userEvent } from 'tests/utils'
import { theme } from 'theme'

jest.mock('libs/firebase/analytics/analytics')

const asyncStorageSpyOn = jest.spyOn(AsyncStorage, 'getItem')
const asyncStorageSetItemSpy = jest.spyOn(AsyncStorage, 'setItem')

const user = userEvent.setup()

jest.useFakeTimers()

describe('AIFakeDoorModal', () => {
  describe('When user has not seen survey', () => {
    it('should display circled clock icon', () => {
      render(<AIFakeDoorModal visible close={jest.fn()} userLocation={null} />)

      expect(screen.getByTestId('CircledClock')).toBeOnTheScreen()
    })

    it('should display specific body text', () => {
      render(<AIFakeDoorModal visible close={jest.fn()} userLocation={null} />)

      expect(
        screen.getByText(/Cette fonctionnalité n’est pas encore disponible/i)
      ).toBeOnTheScreen()
    })

    it('should display primary button', () => {
      render(<AIFakeDoorModal visible close={jest.fn()} userLocation={null} />)

      const button = screen.getByLabelText('Répondre au questionnaire')

      expect(button.props.style.backgroundColor).toEqual(
        theme.designSystem.color.background.brandPrimary
      )
    })

    it('should mark the survey as seen when pressing "Répondre au questionnaire" button', async () => {
      const mockClose = jest.fn()
      render(<AIFakeDoorModal visible close={mockClose} userLocation={null} />)

      await user.press(screen.getByLabelText('Répondre au questionnaire'))

      expect(asyncStorageSetItemSpy).toHaveBeenCalledWith(AI_FAKE_DOOR_SURVEY, 'true')
      expect(mockClose).toHaveBeenCalledWith()
    })
  })

  describe('When user has seen survey', () => {
    beforeEach(() => {
      asyncStorageSpyOn.mockResolvedValueOnce('true')
    })

    it('should display circle checked icon', async () => {
      render(<AIFakeDoorModal visible close={jest.fn()} userLocation={null} />)

      expect(await screen.findByTestId('CircleChecked')).toBeOnTheScreen()
    })

    it('should display specific body text', async () => {
      render(<AIFakeDoorModal visible close={jest.fn()} userLocation={null} />)

      expect(
        await screen.findByText(/Il semble que tu aies déjà répondu au questionnaire/i)
      ).toBeOnTheScreen()
    })

    it('should display secondary button', async () => {
      render(<AIFakeDoorModal visible close={jest.fn()} userLocation={null} />)

      const button = await screen.findByLabelText('Répondre au questionnaire')

      expect(button.props.style.backgroundColor).toEqual(
        theme.designSystem.color.background.default
      )
    })

    it('should display close button', async () => {
      render(<AIFakeDoorModal visible close={jest.fn()} userLocation={null} />)

      expect(await screen.findByText('Fermer')).toBeOnTheScreen()
    })
  })
})
