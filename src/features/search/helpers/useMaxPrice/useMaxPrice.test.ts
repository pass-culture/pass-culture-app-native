import { UseQueryResult } from 'react-query'
import { mocked } from 'ts-jest/utils'

import { UserProfileResponse } from 'api/gen'
import { useUserProfileInfo } from 'features/profile/api'
import { isUserExBeneficiary } from 'features/profile/utils'
import { useMaxPrice } from 'features/search/helpers/useMaxPrice/useMaxPrice'
import { renderHook } from 'tests/utils'

jest.mock('features/profile/api')
jest.mock('features/profile/utils')
const mockedUseUserProfileInfo = mocked(useUserProfileInfo)
const mockedIsUserExBeneificiary = mocked(isUserExBeneficiary)

describe('useMaxPrice when no user', () => {
  beforeAll(() => {
    mockedUseUserProfileInfo.mockReturnValue({ data: undefined } as UseQueryResult<
      UserProfileResponse,
      unknown
    >)
  })

  it('returns 300 when no user logged in', () => {
    expect(renderHook(useMaxPrice).result.current).toEqual(300)
  })
})

describe('useMaxPrice when user is not beneficiary', () => {
  beforeAll(() => {
    mockedUseUserProfileInfo.mockReturnValue({
      data: {
        isBeneficiary: false,
      },
    } as UseQueryResult<UserProfileResponse, unknown>)
  })

  it('returns 300 when the user is not a beneficiary', () => {
    expect(renderHook(useMaxPrice).result.current).toEqual(300)
  })
})

describe('useMaxPrice when user under 18', () => {
  beforeAll(() => {
    mockedUseUserProfileInfo.mockReturnValue({
      data: {
        domainsCredit: { all: { remaining: 10_00, initial: 30_00 } },
      },
    } as UseQueryResult<UserProfileResponse, unknown>)
  })

  it('returns 30 when the user initial credit is 30', () => {
    expect(renderHook(useMaxPrice).result.current).toEqual(30)
  })

  describe('useMaxPrice when user is ex-benficiary', () => {
    beforeAll(() => {
      mockedIsUserExBeneificiary.mockReturnValue(true)
    })

    it('returns 300 when the user is ex-beneficiary', () => {
      expect(renderHook(useMaxPrice).result.current).toEqual(300)
    })
  })
})
