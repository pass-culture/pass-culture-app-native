import React from 'react'

import { VenueTypeCodeKey } from 'api/gen'
import { mapVenueTypeToIcon, parseType } from 'libs/parsers'
import { render, screen } from 'tests/utils'

import { IconWithCaption } from './IconWithCaption'

const typeLabel = parseType(VenueTypeCodeKey.MOVIE)
const typeLabelNull = parseType(null)
const icon = mapVenueTypeToIcon(VenueTypeCodeKey.MOVIE)

describe('IconWithCaption', () => {
  it('should display a default label "Autre type de lieu" for venue type if type is null', async () => {
    render(
      <IconWithCaption Icon={icon} caption={typeLabelNull} accessibilityLabel="Type de lieu" />
    )

    expect(screen.getByText('Autre type de lieu')).toBeOnTheScreen()
  })

  it('should display correct label for venue type if type is not null', () => {
    render(<IconWithCaption Icon={icon} caption={typeLabel} accessibilityLabel="Type de lieu" />)

    expect(screen.getByText('Cinéma - Salle de projections')).toBeOnTheScreen()
  })
})
