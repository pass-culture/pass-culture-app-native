import React from 'react'

import { BookingListItem } from 'features/bookings/components/BookingListItem'
import { BookingListItemLabel } from 'features/bookings/components/BookingListItemLabel'
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { render, screen } from 'tests/utils'

const useRemoteConfigSpy = jest
  .spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')
  .mockReturnValue(remoteConfigResponseFixture)

const label = <BookingListItemLabel text="Avant dernier jour pour retirer" alert icon="clock" />

describe('<BookingLisItem />', () => {
  beforeEach(() => {
    useRemoteConfigSpy.mockReturnValue({
      ...remoteConfigResponseFixture,
      data: {
        ...DEFAULT_REMOTE_CONFIG,
        shouldLogInfo: true,
      },
    })
  })

  it('should render full ticket', async () => {
    render(
      <BookingListItem
        imageUrl="url"
        title="Parasites"
        subtitle="Librairie La Brèche"
        display="full">
        {label}
      </BookingListItem>
    )

    expect(screen.getByTestId('full_booking_list_item')).toBeOnTheScreen()
  })
})
