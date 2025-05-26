import React from 'react'

import { HomepageLabelNameEnumv2 } from 'api/gen'
import { render, screen } from 'tests/utils'
import { Tag } from 'ui/components/Tag/Tag'
import { ThumbUpFilled } from 'ui/svg/icons/ThumbUpFilled'

import { PlaylistCardOffer } from './PlaylistCardOffer'

const props = {
  categoryLabel: HomepageLabelNameEnumv2.MUSIQUE,
  distance: '1,2km',
  date: 'Dès le 12 mars 2020',
  name: 'The fall guys',
  isDuo: false,
  price: 'Dés 15,60 €',
  thumbUrl: 'https://www.example.com/image.jpg',
  width: 100,
  height: 100,
}

describe('PlaylistCardOffer component', () => {
  it('should display interaction tag when specified', () => {
    render(
      <PlaylistCardOffer {...props} interactionTag={<Tag label="100" Icon={ThumbUpFilled} />} />
    )

    expect(screen.getByTestId('tagIcon')).toBeOnTheScreen()
  })

  it('should not display interaction tag when not specified', () => {
    render(<PlaylistCardOffer {...props} />)

    expect(screen.queryByTestId('tagIcon')).not.toBeOnTheScreen()
  })
})
