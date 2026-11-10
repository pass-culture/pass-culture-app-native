import React from 'react'
import { Linking } from 'react-native'

import {
  dispatch,
  getState,
  goBack,
  StackActions,
  useRoute,
} from '__mocks__/@react-navigation/native'
import { Activity } from 'api/gen'
import * as venueSurveyAccessStorage from 'features/venue/helpers/venueSurveyAccessStorage'
import { render, screen, userEvent } from 'tests/utils'

import { VenueSurveyModal } from './VenueSurveyModal'

const openURLSpy = jest.spyOn(Linking, 'openURL')
const markVenueSurveyAccessSpy = jest.spyOn(venueSurveyAccessStorage, 'markVenueSurveyAccess')

const user = userEvent.setup()

jest.useFakeTimers()

describe('VenueSurveyModal', () => {
  beforeEach(() => {
    getState.mockReturnValue({
      routes: [{ key: 'Offer' }, { key: 'Venue' }, { key: 'VenueSurveyModal' }],
    })
    useRoute.mockReturnValue({
      params: {
        activity: Activity.BOOKSTORE,
      },
    })
  })

  it('should not render modal when no activity param', () => {
    useRoute.mockReturnValueOnce({
      params: {
        activity: null,
      },
    })

    render(<VenueSurveyModal />)

    expect(screen.toJSON()).toBeNull()
  })

  it('should render modal correctly', () => {
    render(<VenueSurveyModal />)

    expect(screen.getByText('Avant de partir...')).toBeOnTheScreen()
  })

  it('should mark survey access and pop 2 screens when navigation stack has 3 or more routes', async () => {
    render(<VenueSurveyModal />)

    await user.press(screen.getByLabelText('Fermer la fenêtre'))

    expect(dispatch).toHaveBeenNthCalledWith(1, StackActions.pop(2))
    expect(goBack).not.toHaveBeenCalled()
  })

  it('should mark survey access and call goBack when navigation stack has fewer than 3 routes', async () => {
    getState.mockReturnValueOnce({
      routes: [{ key: 'Venue' }, { key: 'VenueSurveyModal' }],
    })

    render(<VenueSurveyModal />)

    await user.press(screen.getByLabelText('Fermer la fenêtre'))

    expect(goBack).toHaveBeenCalledTimes(1)
    expect(dispatch).not.toHaveBeenCalled()
  })

  it('should open survey url in browser, mark survey access and pop 2 screens', async () => {
    render(<VenueSurveyModal />)

    await user.press(screen.getByLabelText('Donner mon avis'))

    expect(openURLSpy).toHaveBeenNthCalledWith(
      1,
      'https://passculture.qualtrics.com/jfe/form/SV_eVFob8fL2Qpd5ga'
    )
    expect(markVenueSurveyAccessSpy).toHaveBeenCalledWith('BOOKSHOP_AND_LIBRARY')
    expect(dispatch).toHaveBeenCalledWith(StackActions.pop(2))
  })
})
