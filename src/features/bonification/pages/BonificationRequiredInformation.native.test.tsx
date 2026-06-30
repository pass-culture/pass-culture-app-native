import React from 'react'

import { goBack, navigate, useRoute } from '__mocks__/@react-navigation/native'
import { BonificationType } from 'features/bonification/enums'
import { BonificationRequiredInformation } from 'features/bonification/pages/BonificationRequiredInformation'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { env } from 'libs/environment/env'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('BonificationRequiredInformation', () => {
  describe('Family quotient bonification', () => {
    beforeEach(() => {
      useRoute.mockReturnValue({ params: { bonificationType: BonificationType.FAMILY_QUOTIENT } })
    })

    it('should navigate to BonificationNames when pressing "Commencer"', async () => {
      render(<BonificationRequiredInformation />)

      const button = screen.getByText('Commencer')
      await userEvent.press(button)

      expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
        params: undefined,
        screen: 'BonificationNames',
      })
    })

    it('should correct wording', () => {
      render(<BonificationRequiredInformation />)

      const title = screen.getByText(
        'Quelles sont les informations requises d’un de tes parents ou représentants légaux\u00a0?'
      )
      const dataPrivacyText = screen.getByText(
        /Toi ou tes représentants légaux pouvez en savoir plus/
      )

      expect(dataPrivacyText).toBeOnTheScreen()
      expect(title).toBeOnTheScreen()
    })
  })

  describe('Disability bonification', () => {
    beforeEach(() => {
      useRoute.mockReturnValue({ params: { bonificationType: BonificationType.DISABILITY } })
    })

    it('should navigate to BonificationBirthPlace when pressing "Commencer"', async () => {
      render(<BonificationRequiredInformation />)

      const button = screen.getByText('Commencer')
      await userEvent.press(button)

      expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
        params: { bonificationType: BonificationType.DISABILITY },
        screen: 'BonificationBirthPlace',
      })
    })

    it('should correct wording', () => {
      render(<BonificationRequiredInformation />)

      const title = screen.getByText('Nous avons besoins de quelques informations supplémentaires')
      const dataPrivacyText = screen.getByText(
        /Tu peux en savoir plus sur la collecte de données et tes droits/
      )

      expect(dataPrivacyText).toBeOnTheScreen()
      expect(title).toBeOnTheScreen()
    })
  })

  it('should navigate to bonification FAQ when pressing "Consulter l’article d’aide"', async () => {
    render(<BonificationRequiredInformation />)

    const button = screen.getByText('Consulter l’article d’aide')
    await userEvent.press(button)

    expect(openUrl).toHaveBeenNthCalledWith(
      1,
      env.FAQ_BONIFICATION_LEGAL_GUARDIAN_BIRTH_INFORMATIONS,
      undefined,
      true
    )
  })

  it('should navigate to personal data chart when pressing "notre charte dédiée"', async () => {
    render(<BonificationRequiredInformation />)

    const button = screen.getByText('notre charte dédiée')
    await userEvent.press(button)

    expect(openUrl).toHaveBeenCalledWith('https://passculture.data-privacy-chart', undefined, true)
  })

  it('should go back when pressing go back button', async () => {
    render(<BonificationRequiredInformation />)

    const button = screen.getByLabelText('Revenir en arrière')
    await userEvent.press(button)

    expect(goBack).toHaveBeenCalledTimes(1)
  })
})
