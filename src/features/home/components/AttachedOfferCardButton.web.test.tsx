import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { AttachedOfferCardButton } from 'features/home/components/AttachedOfferCardButton'
import { render, screen, fireEvent } from 'tests/utils/web'

describe('Accessibility', () => {
  it('should not have focus when clicked', async () => {
    renderAttachedOfferCardButton()
    const button = screen.getByLabelText('Carte offre "Soirée super trop drôle de fou malade !"')
    fireEvent.click(button)

    expect(button).not.toHaveFocus()
  })
})

const renderAttachedOfferCardButton = () => {
  return render(
    <AttachedOfferCardButton
      distanceToOffer="à 120 m"
      withRightArrow
      imageUrl="https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW"
      price="Gratuit"
      tag="Musée"
      categoryId={CategoryIdEnum.MUSIQUE_LIVE}
      title="Soirée super trop drôle de fou malade&nbsp;!"
      date="Du 12/06 au 24/06"
      onBeforeNavigate={() => {
        jest.fn()
      }}
      navigateTo={{ screen: 'Offer', params: { id: '84f0548f-6603-4276-932d-4fab718d36fc' } }}
    />
  )
}
