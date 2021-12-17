import React from 'react'

import { render } from 'tests/utils'

import { ExBeneficiaryHeader } from './ExBeneficiaryHeader'

describe('ExBeneficiaryHeader', () => {
  it('should render properly', () => {
    const { getByText } = render(
      <ExBeneficiaryHeader firstName="Rosa" lastName="Bonheur" depositExpirationDate="25/12/2020" />
    )

    getByText('Rosa Bonheur')
    getByText('crédit expiré le 25/12/2020')
    getByText('Mon crédit est expiré, que faire\u00a0?')
    getByText('Ton crédit pass Culture est arrivé à expiration mais l’aventure continue\u00a0!')
    getByText('Tu peux toujours réserver les offres gratuites exclusives au pass Culture.')
    getByText(
      "Tu peux aussi découvrir les autres activités culturelles sur l'application mais leur réservation s'effectuera sur les sites de nos partenaires\u00a0!"
    )
  })
})
