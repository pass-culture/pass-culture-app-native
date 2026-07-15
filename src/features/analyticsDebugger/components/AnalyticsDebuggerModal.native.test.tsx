import React from 'react'

import {
  analyticsDebuggerActions,
  analyticsDebuggerSelectors,
} from 'features/analyticsDebugger/store/analyticsDebuggerStore'
import { copyToClipboard } from 'libs/copyToClipboard/copyToClipboard'
import { render, screen, userEvent } from 'tests/utils'

import { AnalyticsDebuggerModal } from './AnalyticsDebuggerModal'

jest.mock('libs/copyToClipboard/copyToClipboard')

const user = userEvent.setup()

describe('<AnalyticsDebuggerModal />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    analyticsDebuggerActions.setCaptureEnabled(true)
    analyticsDebuggerActions.showOverlay()
  })

  afterEach(() => {
    analyticsDebuggerActions.clearEvents()
    analyticsDebuggerActions.setCaptureEnabled(false)
    analyticsDebuggerActions.hideOverlay()
  })

  it('should display an empty state when no event was captured', () => {
    render(<AnalyticsDebuggerModal />)

    expect(screen.getByText(/Aucun événement capturé/)).toBeOnTheScreen()
  })

  it('should display captured events with their params', () => {
    analyticsDebuggerActions.captureEvent('ConsultArtist', { artistId: '42', from: 'offer' })

    render(<AnalyticsDebuggerModal />)

    expect(screen.getByText(/ConsultArtist/)).toBeOnTheScreen()
    expect(screen.getByText(/artistId: "42", from: "offer"/)).toBeOnTheScreen()
  })

  it('should copy the visible events when pressing "Copier"', async () => {
    analyticsDebuggerActions.captureEvent('ConsultArtist', { artistId: '42' })

    render(<AnalyticsDebuggerModal />)

    await user.press(screen.getByText('Copier'))

    expect(copyToClipboard).toHaveBeenCalledWith(
      expect.objectContaining({
        textToCopy: expect.stringContaining('ConsultArtist → { artistId: "42" }'),
      })
    )
  })

  it('should open the event detail with formatted params when pressing an event', async () => {
    analyticsDebuggerActions.captureEvent('ConsultArtist', { artistId: '42' })

    render(<AnalyticsDebuggerModal />)

    await user.press(screen.getByLabelText('Voir le détail de l’événement ConsultArtist'))

    expect(screen.getByText(/"artistId": "42"/)).toBeOnTheScreen()
  })

  it('should copy the event params from the detail view', async () => {
    analyticsDebuggerActions.captureEvent('ConsultArtist', { artistId: '42' })

    render(<AnalyticsDebuggerModal />)

    await user.press(screen.getByLabelText('Voir le détail de l’événement ConsultArtist'))
    await user.press(screen.getByText('Copier'))

    expect(copyToClipboard).toHaveBeenCalledWith(
      expect.objectContaining({
        textToCopy: expect.stringContaining('"artistId": "42"'),
      })
    )
  })

  it('should go back to the list from the detail view', async () => {
    analyticsDebuggerActions.captureEvent('ConsultArtist', { artistId: '42' })

    render(<AnalyticsDebuggerModal />)

    await user.press(screen.getByLabelText('Voir le détail de l’événement ConsultArtist'))
    await user.press(screen.getByLabelText('Revenir à la liste des événements'))

    expect(screen.getByText('Analytics debugger')).toBeOnTheScreen()
    expect(screen.getByLabelText('Voir le détail de l’événement ConsultArtist')).toBeOnTheScreen()
  })

  it('should filter the events by name', async () => {
    analyticsDebuggerActions.captureEvent('ConsultArtist', { artistId: '42' })
    analyticsDebuggerActions.captureEvent('SeeAllClicked', { moduleName: 'Livres' })

    render(<AnalyticsDebuggerModal />)

    await user.type(screen.getByLabelText(/Filtrer par nom d’événement/), 'artist')

    expect(screen.getByText(/ConsultArtist/)).toBeOnTheScreen()
    expect(screen.queryByText(/SeeAllClicked/)).not.toBeOnTheScreen()
  })

  it('should clear the events when pressing "Vider"', async () => {
    analyticsDebuggerActions.captureEvent('ConsultArtist', { artistId: '42' })

    render(<AnalyticsDebuggerModal />)

    await user.press(screen.getByText('Vider'))

    expect(analyticsDebuggerSelectors.selectEvents()).toEqual([])
    expect(screen.getByText(/Aucun événement capturé/)).toBeOnTheScreen()
  })

  it('should hide the overlay when pressing the close button', async () => {
    render(<AnalyticsDebuggerModal />)

    await user.press(screen.getByLabelText('Fermer la modale'))

    expect(analyticsDebuggerSelectors.selectOverlayVisible()).toBe(false)
  })

  it('should toggle event capture with the switch', async () => {
    render(<AnalyticsDebuggerModal />)

    await user.press(
      screen.getByTestId(/Activer la capture des événements analytics - Interrupteur à bascule/)
    )

    expect(analyticsDebuggerSelectors.selectCaptureEnabled()).toBe(false)
  })
})
