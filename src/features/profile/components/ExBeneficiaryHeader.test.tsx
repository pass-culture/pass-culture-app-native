import { render } from '@testing-library/react-native'
import React from 'react'

import { ExBeneficiaryHeader } from './ExBeneficiaryHeader'

describe('ExBeneficiaryHeader', () => {
  it('should render properly', () => {
    const { getByText } = render(<ExBeneficiaryHeader depositExpirationDate={'25/12/2020'} />)

    getByText('crédit expiré le 25/12/2020')
    getByText('Mon crédit est expiré, que faire ?')
    getByText('Ton crédit pass Culture est arrivé à expiration mais l’aventure continue !')
    getByText('Tu peux toujours réserver les offres gratuites exclusives au pass Culture.')
    getByText(
      "Tu peux toujours découvrir les autres activités culturelles sur l'application " +
        "mais leur réservation s'effectuera sur les sites de nos partenaires !"
    )
  })
})
