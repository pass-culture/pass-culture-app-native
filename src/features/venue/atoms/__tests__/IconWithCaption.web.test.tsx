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
    const renderAPI = render(
      <IconWithCaption
        Icon={icon}
        caption={typeLabel}
        testID={typeLabel}
        accessibilityLabel="Type de lieu"
      />
    )
    expect(renderAPI).toMatchSnapshot()
  })

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

  it('should render different when isDisabled is true', () => {
    const enabled = render(
      <IconWithCaption Icon={icon} caption={typeLabel} accessibilityLabel="Type de lieu" />
    )
    const disabled = render(
      <IconWithCaption
        Icon={icon}
        caption={typeLabel}
        isDisabled
        accessibilityLabel="Type de lieu"
      />
    )
    expect(enabled).toMatchDiffSnapshot(disabled)
  })
})
