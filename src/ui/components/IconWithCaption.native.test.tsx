import React from 'react'

import { VenueTypeCodeKey } from 'api/gen'
import { mapVenueTypeToIcon, parseType } from 'libs/parsers'
import { render } from 'tests/utils'

import { IconWithCaption } from './IconWithCaption'

const typeLabel = parseType(VenueTypeCodeKey.MOVIE)
const typeLabelNull = parseType(null)
const icon = mapVenueTypeToIcon(VenueTypeCodeKey.MOVIE)

describe('IconWithCaption', () => {
  it('should display a default label "Autre type de lieu" for venue type if type is null', async () => {
    const { getByText } = render(
      <IconWithCaption Icon={icon} caption={typeLabelNull} accessibilityLabel="Type de lieu" />
    )
    expect(getByText('Autre type de lieu')).toBeTruthy()
  })

  it('should display correct label for venue type if type is not null', () => {
    const { getByText } = render(
      <IconWithCaption Icon={icon} caption={typeLabel} accessibilityLabel="Type de lieu" />
    )
    expect(getByText('Cinéma - Salle de projections')).toBeTruthy()
  })
})
