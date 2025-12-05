import React from 'react'

import { Activity } from 'api/gen'
import { mapActivityToIcon, parseActivity } from 'libs/parsers/activity'
import { render, screen } from 'tests/utils'

import { IconWithCaption } from './IconWithCaption'

const typeLabel = parseActivity(Activity.CINEMA)
const typeLabelNull = parseActivity(null)
const icon = mapActivityToIcon(Activity.CINEMA)

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
