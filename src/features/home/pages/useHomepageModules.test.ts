import { adaptedHomepageEntries } from 'tests/fixtures/homepageEntries'

import { processHomepageEntries } from './useHomepageModules'

describe('useHomepageModules', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  describe('processHomepageEntries', () => {
    it('should format homepage entries so we can use it to display infos on home page', () => {
      expect(processHomepageEntries(adaptedHomepageEntries)).toMatchSnapshot()
    })
  })
})
