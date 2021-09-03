import React from 'react'

import { VenueTypeCode } from 'api/gen'
import { mapVenueTypeToIcon, parseType } from 'libs/parsers'
import { render } from 'tests/utils'

import { IconWithCaption } from '../IconWithCaption'

const typeLabel = parseType(VenueTypeCode.MOVIE)
const typeLabelNull = parseType(null)
const icon = mapVenueTypeToIcon(VenueTypeCode.MOVIE)

describe('IconWithCaption', () => {
  it('should render correctly', () => {
    const { toJSON } = render(
      <IconWithCaption Icon={icon} caption={typeLabel} testID={typeLabel} />
    )
    expect(toJSON()).toMatchSnapshot()
  })

  it('should display a default label "Autre" for venue type if type is null', async () => {
    const { getByText } = render(<IconWithCaption Icon={icon} caption={typeLabelNull} />)
    expect(getByText('Autre')).toBeTruthy()
  })

  it('should display correct label for venue type if type is not null', () => {
    const { getByText } = render(<IconWithCaption Icon={icon} caption={typeLabel} />)
    expect(getByText('Cinéma - Salle de projections')).toBeTruthy()
  })

  it('should render different when isDisabled is true', () => {
    const enabled = render(<IconWithCaption Icon={icon} caption={typeLabel} />).toJSON()
    const disabled = render(<IconWithCaption Icon={icon} caption={typeLabel} isDisabled />).toJSON()
    expect(enabled).toMatchDiffSnapshot(disabled)
  })
})
