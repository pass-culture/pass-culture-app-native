import { renderHook } from '@testing-library/react-hooks'

import { CategoryType } from 'api/gen'

import { useAuthContext } from '../../../auth/AuthContext'
import { useUserProfileInfo } from '../../../home/api'
import { useCtaWording } from '../useCtaWording'

jest.mock('features/auth/AuthContext')
jest.mock('features/home/api')
const mockedUseAuthContext = useAuthContext as jest.Mock
const mockedUseUserProfileInfo = useUserProfileInfo as jest.Mock
describe('useCtaWording', () => {
  // Note that isLoggedIn === false => isBeneficiary === false
  it.each`
    isLoggedIn | isBeneficiary | offerCategoryType     | expectedWording
    ${false}   | ${false}      | ${CategoryType.Event} | ${'Accéder à la billetterie externe'}
    ${true}    | ${false}      | ${CategoryType.Event} | ${'Accéder à la billetterie externe'}
    ${false}   | ${false}      | ${CategoryType.Thing} | ${"Accéder à l'offre"}
    ${true}    | ${false}      | ${CategoryType.Thing} | ${"Accéder à l'offre"}
    ${true}    | ${true}       | ${CategoryType.Event} | ${'Voir les disponibilités'}
    ${true}    | ${true}       | ${CategoryType.Thing} | ${'Voir les disponibilités'}
  `(
    'should return $expectedWording if isLoggedIn: $isLoggedIn, isBeneficiary: $isBeneficiary, offerCategoryType: $OfferCategoryType',
    ({
      isLoggedIn,
      isBeneficiary,
      offerCategoryType,
      expectedWording,
    }: {
      isLoggedIn: boolean
      isBeneficiary: boolean
      offerCategoryType: CategoryType
      expectedWording: string
    }) => {
      mockedUseAuthContext.mockImplementationOnce(() => ({ isLoggedIn }))
      mockedUseUserProfileInfo.mockImplementationOnce(() =>
        isLoggedIn ? { data: { isBeneficiary } } : { data: undefined }
      )
      const { result, unmount } = renderHook(useCtaWording, {
        initialProps: { categoryType: offerCategoryType },
      })
      expect(result.current).toBe(expectedWording)
      unmount()
    }
  )
})
