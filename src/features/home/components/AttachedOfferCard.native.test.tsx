import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { AttachedOfferCard } from 'features/home/components/AttachedOfferCard'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

describe('<AttachedOfferCard>', () => {
  it('matches snapshot if all proprieties are defined', () => {
    render(
      reactQueryProviderHOC(
        <AttachedOfferCard
          categoryText="concert"
          withRightArrow
          imageUrl="https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW"
          price="Gratuit"
          categoryId={CategoryIdEnum.MUSIQUE_LIVE}
          title="Soirée super trop drôle de fou malade&nbsp;!"
          date="Du 12/06 au 24/06"
        />
      )
    )

    expect(screen).toMatchSnapshot()
  })

  it('matches snapshot if there is no distance and arrow', () => {
    render(
      reactQueryProviderHOC(
        <AttachedOfferCard
          categoryText="concert"
          imageUrl="https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW"
          price="Gratuit"
          categoryId={CategoryIdEnum.MUSIQUE_LIVE}
          title="Soirée super trop drôle de fou malade&nbsp;!"
        />
      )
    )

    expect(screen).toMatchSnapshot()
  })
})
