import firestore from 'libs/firebase/shims/firestore'

import { getCookiesLastUpdate } from './getCookiesLastUpdate'

jest.mock('@react-native-firebase/firestore')

const { collection } = firestore()

const validFirebaseData = {
  lastUpdated: '2022-09-16',
  buildVersion: 10206000,
}

const mockGet = jest.fn()

describe('[method] getCookiesLastUpdate', () => {
  beforeAll(() =>
    collection('cookiesLastUpdate')
      .doc('testing')
      // @ts-expect-error is a mock
      .get.mockResolvedValue({
        get: mockGet,
      })
  )

  it('should call the right path: cookiesLastUpdate', () => {
    getCookiesLastUpdate()

    expect(collection).toHaveBeenCalledWith('cookiesLastUpdate')
  })

  it('should convert data: lastUpdated -> Date', async () => {
    mockGet
      .mockReturnValueOnce(validFirebaseData.lastUpdated)
      .mockReturnValueOnce(validFirebaseData.buildVersion)

    const cookiesLastUpdate = await getCookiesLastUpdate()

    expect(cookiesLastUpdate).toStrictEqual({
      lastUpdated: new Date(validFirebaseData.lastUpdated),
      lastUpdateBuildVersion: validFirebaseData.buildVersion,
    })
  })

  it('should return undefined when data is not defined', async () => {
    mockGet.mockReturnValueOnce(undefined).mockReturnValueOnce(undefined)

    const cookiesLastUpdate = await getCookiesLastUpdate()

    expect(cookiesLastUpdate).toBeUndefined()
  })

  it.each(['', 'abc', '22-09-16', undefined])(
    'should return undefined when last update date is invalid',
    async (lastUpdated) => {
      mockGet.mockReturnValueOnce(lastUpdated).mockReturnValueOnce(validFirebaseData.buildVersion)
      const cookiesLastUpdate = await getCookiesLastUpdate()

      expect(cookiesLastUpdate).toBeUndefined()
    }
  )
})
