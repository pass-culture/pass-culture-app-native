import React from 'react'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { AttachedOfferCardButton } from 'features/home/components/AttachedOfferCardButton'
import { getSpacing, Spacer } from 'ui/theme'

export const Video916Cheatcodes = () => {
  return (
    <CheatcodeView>
      <Spacer.Column numberOfSpaces={10} />
      <AttachedOfferCardButton
        offerLocation={{
          lat: 48.94476,
          lng: 2.25055,
        }}
        showImage
        withRightArrow
        imageUrl="https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW"
        price="Gratuit"
        categoryText="Musée"
        categoryId={CategoryIdEnum.MUSIQUE_LIVE}
        title="Soirée super trop drôle de fou malade&nbsp;!"
        date="Du 12/06 au 24/06"
        onPress={() => {
          return
        }}
      />
      <Spacer.Column numberOfSpaces={10} />
      <AttachedOfferCardButton
        offerLocation={{
          lat: 48.94476,
          lng: 2.25055,
        }}
        withRightArrow
        price="Gratuit"
        showImage
        categoryText="Musée"
        categoryId={CategoryIdEnum.MUSIQUE_LIVE}
        title="C’est une tuile sans datas image mais avec un super long titre!"
        date="Du 12/06 au 24/06"
        onPress={() => {
          return
        }}
      />
      <Spacer.Column numberOfSpaces={10} />
      <AttachedOfferCardButton
        withRightArrow
        price="Gratuit"
        categoryText="Musée"
        categoryId={CategoryIdEnum.MUSIQUE_LIVE}
        title="C’est une tuile sans datas image mais avec un super long titre!"
        onPress={() => {
          return
        }}
      />
      <Spacer.Column numberOfSpaces={10} />
      <AttachedOfferCardButton
        categoryText="Musée"
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
