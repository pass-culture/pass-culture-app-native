import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { AttachedOfferCard } from 'features/home/components/AttachedOfferCard'
import { render, screen } from 'tests/utils'

describe('<AttachedOfferCard>', () => {
  it('matches snapshot if all proprieties are defined', () => {
    render(
      <AttachedOfferCard
        distanceToOffer="à 120 m"
        withRightArrow
        imageUrl="https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW"
        price="Gratuit"
        tag="Musée"
        categoryId={CategoryIdEnum.MUSIQUE_LIVE}
        title="Soirée super trop drôle de fou malade&nbsp;!"
        date="Du 12/06 au 24/06"
        onPress={() => {
          return
        }}
      />
    )

    expect(screen).toMatchSnapshot()
  })

  it('matches snapshot if there is no distance and arrow', () => {
    render(
      <AttachedOfferCard
        distanceToOffer="à 120 m"
        imageUrl="https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW"
        price="Gratuit"
        tag="Musée"
        categoryId={CategoryIdEnum.MUSIQUE_LIVE}
        title="Soirée super trop drôle de fou malade&nbsp;!"
        onPress={() => {
          return
        }}
      />
    )

    expect(screen).toMatchSnapshot()
  })
})
