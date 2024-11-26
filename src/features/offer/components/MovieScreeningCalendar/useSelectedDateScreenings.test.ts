import { convertToMinutes } from 'features/offer/components/MovieScreeningCalendar/useSelectedDateScreenings'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

jest.mock('libs/firebase/firestore/exchangeRates/useGetPacificFrancToEuroRate')
const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag')

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('convertToMinutes', () => {
  beforeEach(() => {
    activateFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
  })

  it.each`
    time      | expected
    ${''}     | ${0}
    ${'123'}  | ${0}
    ${'abc'}  | ${0}
    ${'2h30'} | ${150}
    ${'0h45'} | ${45}
    ${'1h00'} | ${60}
  `('should convert "${time}" to ${expected}', ({ time, expected }) => {
    expect(convertToMinutes(time)).toBe(expected)
  })
})

const activateFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
  useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
}
