import React from 'react'

import { VenueTypeCode } from 'api/gen'
import { mapTypeToIcon, parseType } from 'libs/parsers'
import { render } from 'tests/utils'

import { IconWithCaption } from '../IconWithCaption'

const typeLabel = parseType(VenueTypeCode.MOVIE)
const icon = mapTypeToIcon(VenueTypeCode.MOVIE)

describe('IconWithCaption', () => {
  it('should render correctly', () => {
    const { toJSON } = render(
      <IconWithCaption Icon={icon} caption={typeLabel} testID={typeLabel} />
    )
    expect(toJSON()).toMatchSnapshot()
  })

  it('should display a correctly caption', () => {
    const { getByText } = render(<IconWithCaption Icon={icon} caption={typeLabel} />)
    expect(getByText('Cinéma - Salle de projections')).toBeTruthy()
  })
})
