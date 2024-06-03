import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { CategoryIdEnum } from 'api/gen'
import { AttachedOfferCardButton } from 'features/home/components/AttachedOfferCardButton'
import { render, screen, fireEvent, act } from 'tests/utils'

describe('<AttachedOfferCardButton>', () => {
  it('should call onPress when pressing the button', async () => {
    render(
      <AttachedOfferCardButton
        offerLocation={{
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
        onBeforeNavigate={() => {
          return
        }}
        navigateTo={{ screen: 'Offer', params: { id: '84f0548f-6603-4276-932d-4fab718d36fc' } }}
      />
    )

    const button = screen.getByLabelText('Carte offre "Soirée super trop drôle de fou malade !"')
    await act(async () => fireEvent.press(button))

    expect(navigate).toHaveBeenCalledWith('Offer', { id: '84f0548f-6603-4276-932d-4fab718d36fc' })
  })
})
