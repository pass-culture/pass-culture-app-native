import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { AttachedOfferCardButton } from 'features/home/components/AttachedOfferCardButton'
import { render, screen, fireEvent } from 'tests/utils'

const onPress = jest.fn()

describe('<AttachedOfferCardButton>', () => {
  it('should call onPress when pressing the button', () => {
    render(
      <AttachedOfferCardButton
        geoloc={{
          lat: 48.94476,
          lng: 2.25055,
        }}
        withRightArrow
        imageUrl="https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW"
        price="Gratuit"
        categoryText="Musée"
        categoryId={CategoryIdEnum.MUSIQUE_LIVE}
        title="Soirée super trop drôle de fou malade&nbsp;!"
        date="Du 12/06 au 24/06"
        onPress={onPress}
      />
    )

    const Button = screen.getByLabelText('Carte offre "Soirée super trop drôle de fou malade !"')
    fireEvent.press(Button)

    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
