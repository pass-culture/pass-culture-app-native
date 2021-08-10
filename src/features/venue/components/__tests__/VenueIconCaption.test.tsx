import React from 'react'

import { VenueTypeCode } from 'api/gen'
import { parseType } from 'libs/parsers'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render } from 'tests/utils'

import { VenueIconCaptions } from '../VenueIconCaptions'

const typeLabel = parseType(VenueTypeCode.MOVIE)
const typeLabelNull = parseType(null)

describe('<VenueIconCaptions />', () => {
  it('should match snapshot', async () => {
    const { toJSON } = render(
      reactQueryProviderHOC(<VenueIconCaptions label={typeLabel} type={VenueTypeCode.MOVIE} />)
    )
    expect(toJSON()).toMatchSnapshot()
  })

  it('should display a default label "Autre" if type is null', async () => {
    const { getByText } = render(
      reactQueryProviderHOC(<VenueIconCaptions type={null} label={typeLabelNull} />)
    )
    expect(getByText('Autre')).toBeTruthy()
  })
})
