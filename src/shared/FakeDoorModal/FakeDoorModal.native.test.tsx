import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'

import { FakeDoorModal } from 'shared/FakeDoorModal/FakeDoorModal'
import { render, screen, userEvent } from 'tests/utils'
import { theme } from 'theme'

jest.mock('libs/firebase/analytics/analytics')

const asyncStorageSpyOn = jest.spyOn(AsyncStorage, 'getItem')
const asyncStorageSetItemSpy = jest.spyOn(AsyncStorage, 'setItem')

const user = userEvent.setup()

jest.useFakeTimers()

describe('FakeDoorModal', () => {
  describe('When user has not seen survey', () => {
    it('should display circled clock icon', () => {
      render(
        <FakeDoorModal
          surveyKey="has_seen_follow_venue_fake_door_survey"
          surveyUrl="https://passculture.qualtrics.com/"
          visible
          close={jest.fn()}
        />
      )

      expect(screen.getByTestId('CircledClock')).toBeOnTheScreen()
    })

    it('should display specific body text', () => {
      render(
        <FakeDoorModal
          surveyKey="has_seen_follow_venue_fake_door_survey"
          surveyUrl="https://passculture.qualtrics.com/"
          visible
          close={jest.fn()}
        />
      )

      expect(
        screen.getByText(/Cette fonctionnalité n’est pas encore disponible/i)
      ).toBeOnTheScreen()
    })

    it('should display primary button', () => {
      render(
        <FakeDoorModal
          surveyKey="has_seen_follow_venue_fake_door_survey"
          surveyUrl="https://passculture.qualtrics.com/"
          visible
          close={jest.fn()}
        />
      )

      const button = screen.getByLabelText('Répondre au questionnaire')

      expect(button.props.style.backgroundColor).toEqual(
        theme.designSystem.color.background.brandPrimary
      )
    })

    it('should mark the survey as seen when pressing "Répondre au questionnaire" button', async () => {
      const mockClose = jest.fn()
      render(
        <FakeDoorModal
          surveyKey="has_seen_follow_venue_fake_door_survey"
          surveyUrl="https://passculture.qualtrics.com/"
          visible
          close={mockClose}
        />
      )

      await user.press(screen.getByLabelText('Répondre au questionnaire'))

      expect(asyncStorageSetItemSpy).toHaveBeenCalledWith(
        'has_seen_follow_venue_fake_door_survey',
        'true'
      )
      expect(mockClose).toHaveBeenCalledWith()
    })
  })

  describe('When user has seen survey', () => {
    beforeEach(() => {
      asyncStorageSpyOn.mockResolvedValueOnce('true')
    })

    it('should display circle checked icon', async () => {
      render(
        <FakeDoorModal
          surveyKey="has_seen_follow_venue_fake_door_survey"
          surveyUrl="https://passculture.qualtrics.com/"
          visible
          close={jest.fn()}
        />
      )

      expect(await screen.findByTestId('CircleChecked')).toBeOnTheScreen()
    })

    it('should display specific body text', async () => {
      render(
        <FakeDoorModal
          surveyKey="has_seen_follow_venue_fake_door_survey"
          surveyUrl="https://passculture.qualtrics.com/"
          visible
          close={jest.fn()}
        />
      )

      expect(
        await screen.findByText(/Il semble que tu aies déjà répondu au questionnaire/i)
      ).toBeOnTheScreen()
    })

    it('should display secondary button', async () => {
      render(
        <FakeDoorModal
          surveyKey="has_seen_follow_venue_fake_door_survey"
          surveyUrl="https://passculture.qualtrics.com/"
          visible
          close={jest.fn()}
        />
      )

      const button = await screen.findByLabelText('Répondre au questionnaire')

      expect(button.props.style.backgroundColor).toEqual(
        theme.designSystem.color.background.default
      )
    })

    it('should display close button', async () => {
      render(
        <FakeDoorModal
          surveyKey="has_seen_follow_venue_fake_door_survey"
          surveyUrl="https://passculture.qualtrics.com/"
          visible
          close={jest.fn()}
        />
      )

      expect(await screen.findByText('Fermer')).toBeOnTheScreen()
    })
  })
})
