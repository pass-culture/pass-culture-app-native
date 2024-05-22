import React from 'react'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { AttachedOfferCard } from 'features/home/components/AttachedOfferCard'
import { getSpacing, Spacer } from 'ui/theme'

export const Video916Cheatcodes = () => {
  return (
    <CheatcodeView>
      <Spacer.Column numberOfSpaces={10} />
      <AttachedOfferCard
        distanceToOffer="à 120 m"
        showImage
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
      <Spacer.Column numberOfSpaces={10} />
      <AttachedOfferCard
        distanceToOffer="à 120 m"
        withRightArrow
        price="Gratuit"
        showImage
        tag="Musée"
        categoryId={CategoryIdEnum.MUSIQUE_LIVE}
        title="C’est une tuile sans datas image mais avec un super long titre!"
        date="Du 12/06 au 24/06"
        onPress={() => {
          return
        }}
      />
      <Spacer.Column numberOfSpaces={10} />
      <AttachedOfferCard
        withRightArrow
        price="Gratuit"
        tag="Musée"
        categoryId={CategoryIdEnum.MUSIQUE_LIVE}
        title="C’est une tuile sans datas image mais avec un super long titre!"
        onPress={() => {
          return
        }}
      />
      <Spacer.Column numberOfSpaces={10} />
      <AttachedOfferCard
        tag="Musée"
        categoryId={CategoryIdEnum.MUSIQUE_LIVE}
        title="C’est une tuile sans image mais avec un super long titre!"
        date="Du 12/06 au 24/06"
        onPress={() => {
          return
        }}
      />
    </CheatcodeView>
  )
}

const CheatcodeView = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.white,
  width: getSpacing(73.75),
  margin: getSpacing(10),
}))
