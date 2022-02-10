import React from 'react'

import { VenueTypeCodeKey } from 'api/gen'
import { mapVenueTypeToIcon, parseType } from 'libs/parsers'
import { render } from 'tests/utils/web'

import { IconWithCaption } from '../IconWithCaption'

const typeLabel = parseType(VenueTypeCodeKey.MOVIE)
const typeLabelNull = parseType(null)
const icon = mapVenueTypeToIcon(VenueTypeCodeKey.MOVIE)

describe('IconWithCaption', () => {
  it('should render correctly', () => {
    const renderAPI = render(<IconWithCaption Icon={icon} caption={typeLabel} testID={typeLabel} />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should display a default label "Autre type de lieu" for venue type if type is null', async () => {
    const { getByText } = render(<IconWithCaption Icon={icon} caption={typeLabelNull} />)
    expect(getByText('Autre type de lieu')).toBeTruthy()
  })

  it('should display correct label for venue type if type is not null', () => {
    const { getByText } = render(<IconWithCaption Icon={icon} caption={typeLabel} />)
    expect(getByText('Cinéma - Salle de projections')).toBeTruthy()
  })

  it('should render different when isDisabled is true', () => {
    const enabled = render(<IconWithCaption Icon={icon} caption={typeLabel} />)
    const disabled = render(<IconWithCaption Icon={icon} caption={typeLabel} isDisabled />)
    expect(enabled).toMatchDiffSnapshot(disabled)
  })
})
