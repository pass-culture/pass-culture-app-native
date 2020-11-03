import { adaptedHomepageEntries } from 'tests/fixtures/homepageEntries'

import { processHomepageEntries } from './processHomepageEntries'

describe('processHomepageEntries', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should format homepage entries so we can use it to display infos on home page', () => {
    expect(processHomepageEntries(adaptedHomepageEntries)).toMatchSnapshot()
  })

  it('should format homepage entries: no fields case', () => {
    const sys = {
      space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
      id: '16PgpnlCOYYIhUTclR0oO4',
      type: 'Entry',
      createdAt: '2020-07-02T13:36:02.919Z',
      updatedAt: '2020-10-30T10:07:29.549Z',
      environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
      revision: 154,
      contentType: { sys: { type: 'Link', linkType: 'ContentType', id: 'homepage' } },
      locale: 'en-US',
    }

    const emptyModulesHomepageEntries = {
      sys,
      fields: {
        title: 'Homepage',
        modules: [],
      },
    }
    expect(processHomepageEntries(emptyModulesHomepageEntries)).toEqual([])
  })
})
