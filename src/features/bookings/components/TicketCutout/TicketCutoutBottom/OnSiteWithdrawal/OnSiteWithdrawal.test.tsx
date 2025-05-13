import React from 'react'

import { OnSiteWithdrawal } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/OnSiteWithdrawal/OnSiteWithdrawal'
import { render, screen } from 'tests/utils'

describe('<OnSiteWithdrawal>', () => {
  it.each`
    isDuo | withdrawalDelay | expected
    ${true} | ${null} | ${`Présente le code ci-dessus à l’accueil du lieu indiqué avant le début de l’événement pour
  récupérer tes billets.`}
    ${false} | ${null} | ${`Présente le code ci-dessus à l’accueil du lieu indiqué avant le début de l’événement pour
  récupérer ton billet.`}
    ${false} | ${1200} | ${`Présente le code ci-dessus à l’accueil du lieu indiqué 20 minutes avant le début de l’événement pour
  récupérer ton billet.`}
  `(
    'should render plural or singular and delay correctly',
    ({ isDuo, withdrawalDelay, expected }) => {
      render(<OnSiteWithdrawal token="NBFJ55K8" isDuo={isDuo} withdrawalDelay={withdrawalDelay} />)

      expect(screen.getByText(expected)).toBeOnTheScreen()
    }
  )
})
