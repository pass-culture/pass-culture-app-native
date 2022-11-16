import { COOKIES_BY_CATEGORY, ALL_OPTIONAL_COOKIES } from 'features/cookies/CookiesPolicy'
import { CookiesConsent } from 'features/cookies/types'
import { storage } from 'libs/storage'

jest.mock('features/profile/api')

const mockSearchDispatch = jest.fn()
const mockIdentityCheckDispatch = jest.fn()

jest.mock('api/api')
jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQueryClient: jest.fn().mockReturnValue({ removeQueries: jest.fn() }),
  useQuery: jest.fn(),
}))
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({ dispatch: mockIdentityCheckDispatch })),
}))
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: jest.fn(() => ({ dispatch: mockSearchDispatch })),
}))

const COOKIES_CONSENT_KEY = 'cookies'
const cookiesChoice: CookiesConsent = {
  buildVersion: 1001005,
  deviceId: 'uuid',
  choiceDatetime: new Date(2022, 9, 29).toISOString(),
  consent: {
    mandatory: COOKIES_BY_CATEGORY.essential,
    accepted: ALL_OPTIONAL_COOKIES,
    refused: [],
  },
}

describe('AuthContext', () => {
  beforeEach(async () => {
    await storage.saveObject(COOKIES_CONSENT_KEY, cookiesChoice)
  })
})
