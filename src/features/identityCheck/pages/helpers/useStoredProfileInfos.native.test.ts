import { ActivityIdEnum } from 'api/gen'
import { useStoredProfileInfos } from 'features/identityCheck/pages/helpers/useStoredProfileInfos'
import { useAddress } from 'features/identityCheck/pages/profile/store/addressStore'
import { useCity } from 'features/identityCheck/pages/profile/store/cityStore'
import { useName } from 'features/identityCheck/pages/profile/store/nameStore'
import { useStatus } from 'features/identityCheck/pages/profile/store/statusStore'
import { renderHook } from 'tests/utils'

jest.mock('features/identityCheck/pages/profile/store/nameStore')
const mockedUseName = useName as jest.Mock
const validName = { firstName: 'Jean', lastName: 'Dupont' }

jest.mock('features/identityCheck/pages/profile/store/cityStore')
const mockedUseCity = useCity as jest.Mock
const validCity = { name: 'Paris', postalCode: '75011', cityCode: '12345' }

jest.mock('features/identityCheck/pages/profile/store/addressStore')
const mockedUseAddress = useAddress as jest.Mock
const validAddress = '1 rue du Test'

jest.mock('features/identityCheck/pages/profile/store/statusStore')
const mockedUseStatus = useStatus as jest.Mock
const validStatus = ActivityIdEnum.STUDENT

describe('useStoredProfileInfos', () => {
  beforeEach(() => {
    mockedUseName.mockReturnValue(validName)
    mockedUseCity.mockReturnValue(validCity)
    mockedUseAddress.mockReturnValue(validAddress)
    mockedUseStatus.mockReturnValue(validStatus)
  })

  it('should return valid profile infos when all fields are set', () => {
    const { result } = renderHook(() => useStoredProfileInfos())

    expect(result.current).toEqual({
      name: validName,
      city: validCity,
      address: validAddress,
      status: validStatus,
    })
  })

  it('should return undefined if first name is missing', () => {
    mockedUseName.mockReturnValueOnce({ lastName: 'Dupont' })
    const { result } = renderHook(() => useStoredProfileInfos())

    expect(result.current).toBeUndefined()
  })

  it('should return undefined if city postal code is missing', () => {
    mockedUseCity.mockReturnValueOnce({ name: 'Paris' })
    const { result } = renderHook(() => useStoredProfileInfos())

    expect(result.current).toBeUndefined()
  })

  it('should return undefined if address is missing', () => {
    mockedUseAddress.mockReturnValueOnce(undefined)
    const { result } = renderHook(() => useStoredProfileInfos())

    expect(result.current).toBeUndefined()
  })

  it('should return undefined if status is null', () => {
    mockedUseStatus.mockReturnValueOnce(null)
    const { result } = renderHook(() => useStoredProfileInfos())

    expect(result.current).toBeUndefined()
  })
})
