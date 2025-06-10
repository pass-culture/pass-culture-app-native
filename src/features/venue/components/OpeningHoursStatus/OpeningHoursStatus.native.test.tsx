import React from 'react'
import { AppState } from 'react-native'

import { OpeningHoursStatus } from 'features/venue/components/OpeningHoursStatus/OpeningHoursStatus'
import { act, render, screen } from 'tests/utils'

jest.unmock('libs/appState')
const appStateSpy = jest.spyOn(AppState, 'addEventListener')

const CURRENT_DATE = new Date('2024-05-31T08:30:00')
const TIMEZONE = 'UTC'

jest.useFakeTimers().setSystemTime(CURRENT_DATE)

describe('<OpeningHoursStatus />', () => {
  it('should render nothing if text is falsy (empty string)', () => {
    const openingHours = { FRIDAY: undefined }
    const { toJSON } = render(
      <OpeningHoursStatus
        openingHours={openingHours}
        currentDate={CURRENT_DATE}
        timezone={TIMEZONE}
      />
    )

    expect(toJSON()).toBeNull()
  })

  it('should render nothing if state is "not-applicable"', () => {
    const openingHours = { SUNDAY: undefined }
    jest.mock('./getOpeningHoursStatus', () => ({
      getOpeningHoursStatus: jest.fn(() => ({
        openingState: 'not-applicable',
        openingLabel: 'Label',
        nextChangeTime: null,
      })),
    }))

    const { toJSON } = render(
      <OpeningHoursStatus
        openingHours={openingHours}
        currentDate={CURRENT_DATE}
        timezone={TIMEZONE}
      />
    )

    expect(toJSON()).toBeNull()
  })

  it('should not update state automatically when state change is in more than 30 minutes', async () => {
    const openingHours = {
      FRIDAY: [{ open: '09:01', close: '19:00' }],
    }
    render(
      <OpeningHoursStatus
        openingHours={openingHours}
        currentDate={CURRENT_DATE}
        timezone={TIMEZONE}
      />
    )

    expect(screen.getByText('Ouvre bientôt - 9h01')).toBeOnTheScreen()

    await act(async () => jest.advanceTimersByTime(31 * 60 * 1000))

    expect(await screen.findByText('Ouvre bientôt - 9h01')).toBeOnTheScreen()
  })

  it('should set timer to 0 when app is in background for longer than remaining time', async () => {
    const openingHours = {
      FRIDAY: [{ open: '09:01', close: '19:00' }],
    }
    render(
      <OpeningHoursStatus
        openingHours={openingHours}
        currentDate={CURRENT_DATE}
        timezone={TIMEZONE}
      />
    )

    expect(screen.getByText('Ouvre bientôt - 9h01')).toBeOnTheScreen()

    // @ts-expect-error: because of noUncheckedIndexedAccess
    const mockCurrentAppState = appStateSpy.mock.calls[0][1]
    mockCurrentAppState('active')

    await act(async () => {
      mockCurrentAppState('background')
      jest.advanceTimersByTime(31 * 60 * 1000)
      mockCurrentAppState('active')
    })

    expect(await screen.findByText('Ouvert jusqu’à 19h')).toBeOnTheScreen()
  })
})
