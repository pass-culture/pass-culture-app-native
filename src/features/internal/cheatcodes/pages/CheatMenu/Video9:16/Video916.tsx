import React from 'react'
import { useSharedValue } from 'react-native-reanimated'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CategoryIdEnum } from 'api/gen'
import { AttachedOfferCardButton } from 'features/home/components/AttachedOfferCardButton'
import { CarouselBar } from 'ui/CarouselBar/CarouselBar'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing, Spacer } from 'ui/theme'

const numberOfBarsToDisplay = [1, 2, 3, 4]

export const Video916Cheatcodes = () => {
  const carouselDotId = uuidv4()
  const progressValue = useSharedValue<number>(0)

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
      <Spacer.Column numberOfSpaces={2} />
      <PaginationContainer gap={0}>
        {numberOfBarsToDisplay.map((_, index) => (
          <CarouselBar animValue={progressValue} index={index} key={index + carouselDotId} />
        ))}
      </PaginationContainer>
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
  backgroundColor: theme.colors.coralLight,
  width: getSpacing(73.75),
  margin: getSpacing(10),
}))

const PaginationContainer = styled(ViewGap)({
  flexDirection: 'row',
  alignSelf: 'center',
  alignItems: 'center',
})
