import mockdate from 'mockdate'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import {
  CreditHeader,
  CreditHeaderProps,
} from 'features/profile/components/Header/CreditHeader/CreditHeader'
import {
  domains_credit_v1,
  domains_exhausted_credit_v1,
} from 'features/profile/fixtures/domainsCredit'
import * as ProfileUtils from 'features/profile/helpers/useIsUserUnderageBeneficiary'
import { formatToSlashedFrenchDate, setDateOneDayEarlier } from 'libs/dates'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('features/profile/api/useResetRecreditAmountToShow')
jest.mock('libs/firebase/remoteConfig/RemoteConfigProvider', () => ({
  useRemoteConfigContext: jest
    .fn()
    .mockReturnValue({ homeEntryIdFreeOffers: 'homeEntryIdFreeOffers' }),
}))

const mockUseIsUserUnderageBeneficiary = jest
  .spyOn(ProfileUtils, 'useIsUserUnderageBeneficiary')
  .mockReturnValue(false)

const dateInPast = '2022-08-01T18:00:00'
const dateInFuture = '2100-02-09T11:17:14.786670'
const today = '2023-02-10T21:00:00'
const tomorrow = '2023-02-11T21:00:00'

describe('CreditHeader', () => {
  describe('Beneficiary is not underage', () => {
    it('should render correctly with valid non exhausted credit', () => {
      renderCreditHeader({ age: 18 })
      expect(screen).toMatchSnapshot()
    })

    it('should render correctly with expired credit', () => {
      renderCreditHeader({ depositExpirationDate: dateInPast, age: 18 })
      expect(screen).toMatchSnapshot()
    })

    it('should render correctly with exhausted credit', () => {
      renderCreditHeader({ domainsCredit: domains_exhausted_credit_v1, age: 18 })
      expect(screen).toMatchSnapshot()
    })

    it('should display user name', () => {
      const { queryByText } = renderCreditHeader({ age: 18 })
      const name = queryByText('Rosa Bonheur')
      expect(name).toBeOnTheScreen()
    })

    it('should display deposit expiration date', () => {
      const { queryByText } = renderCreditHeader({ age: 18 })
      const depositExpirationDate = queryByText(
        formatToSlashedFrenchDate(setDateOneDayEarlier(dateInFuture))
      )
      expect(depositExpirationDate).toBeOnTheScreen()
    })

    it('should display credit ceilings', () => {
      const { queryByTestId } = renderCreditHeader({ age: 18 })
      const digitalCredit = queryByTestId('domains-credit-digital')
      const physicalCredit = queryByTestId('domains-credit-physical')
      expect(digitalCredit).toBeOnTheScreen()
      expect(physicalCredit).toBeOnTheScreen()
    })

    it('should display credit info', () => {
      const { queryByTestId } = renderCreditHeader({ age: 18 })
      const creditInfo = queryByTestId('credit-info')
      expect(creditInfo).toBeOnTheScreen()
    })

    it('should display tutorial button', () => {
      const { queryByTestId } = renderCreditHeader({ age: 18 })
      const explanationButton = queryByTestId('Comment ça marche ?')
      expect(explanationButton).toBeOnTheScreen()
    })

    it('should not display credit info and ceilings for expired credit', () => {
      const { queryByTestId } = renderCreditHeader({ depositExpirationDate: dateInPast, age: 18 })
      const creditInfo = queryByTestId('credit-info')
      const digitalCredit = queryByTestId('domains-credit-digital')
      const physicalCredit = queryByTestId('domains-credit-physical')
      expect(creditInfo).not.toBeOnTheScreen()
      expect(digitalCredit).not.toBeOnTheScreen()
      expect(physicalCredit).not.toBeOnTheScreen()
    })

    it('should not display coming credit for 18-year-old beneficiary', () => {
      renderCreditHeader({ age: 18 })

      expect(screen.queryByText(/À venir pour tes/)).not.toBeOnTheScreen()
    })

    it('should navigate to thematic home with remote config homeId on banner press', () => {
      renderCreditHeader({ domainsCredit: domains_exhausted_credit_v1, age: 18 })

      fireEvent.press(screen.getByText('L’aventure continue !'))

      expect(navigate).toHaveBeenCalledWith('ThematicHome', {
        homeId: 'homeEntryIdFreeOffers',
        from: 'profile',
      })
    })
  })

  describe('Beneficiary is underage', () => {
    beforeEach(() => {
      mockUseIsUserUnderageBeneficiary.mockReturnValueOnce(true)
      mockUseIsUserUnderageBeneficiary.mockReturnValueOnce(true)
    })

    it.each([15, 16, 17])('should render correctly for %s year-old', (age) => {
      renderCreditHeader({ age })
      expect(screen).toMatchSnapshot({})
    })

    it.each([15, 16, 17])('should not display credit ceilings for %s year-old', (age) => {
      const { queryByTestId } = renderCreditHeader({ age })
      const digitalCredit = queryByTestId('domains-credit-digital')
      const physicalCredit = queryByTestId('domains-credit-physical')
      expect(digitalCredit).not.toBeOnTheScreen()
      expect(physicalCredit).not.toBeOnTheScreen()
    })

    it.each([15, 16, 17])(
      'should render correctly with exhausted credit for %s year-old',
      (age) => {
        renderCreditHeader({ domainsCredit: domains_exhausted_credit_v1, age })
        expect(screen).toMatchSnapshot()
      }
    )

    it('should display coming credit for 17-year-old beneficiary', () => {
      renderCreditHeader({ age: 17 })

      expect(screen.queryByText('À venir pour tes 18 ans : 300 €')).toBeOnTheScreen()
    })

    it('should display coming credit for 16-year-old beneficiary', () => {
      renderCreditHeader({ age: 16 })

      expect(screen.queryByText('À venir pour tes 17 ans : + 30 €')).toBeOnTheScreen()
    })

    it('should display coming credit for 15-year-old beneficiary', () => {
      renderCreditHeader({ age: 15 })

      expect(screen.queryByText('À venir pour tes 16 ans : + 30 €')).toBeOnTheScreen()
    })

    it('should display time left when credit expires soon', () => {
      mockdate.set(new Date(today))
      renderCreditHeader({ depositExpirationDate: tomorrow, age: 17 })
      expect(
        screen.getByText(
          'Ton crédit sera remis à 0 aujourd’hui. Profite de ton crédit restant\u00a0!'
        )
      ).toBeOnTheScreen()
    })
  })
})

const renderCreditHeader = (props?: Partial<CreditHeaderProps>) =>
  render(
    <CreditHeader
      firstName="Rosa"
      lastName="Bonheur"
      depositExpirationDate={dateInFuture}
      domainsCredit={domains_credit_v1}
      {...props}
    />
  )
