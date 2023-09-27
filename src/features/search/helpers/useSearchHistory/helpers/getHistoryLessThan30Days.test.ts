import mockdate from 'mockdate'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { getHistoryLessThan30Days } from 'features/search/helpers/useSearchHistory/helpers/getHistoryLessThan30Days'
import { HistoryItem } from 'features/search/types'

const TODAY_DATE = new Date('2023-09-25T00:00:00.000Z')

const history: HistoryItem[] = [
  {
    createdAt: new Date('2023-09-20T00:00:00.000Z').getTime(),
    category: SearchGroupNameEnumv2.LIVRES,
    query: 'one piece',
  },
  {
    createdAt: new Date('2023-09-15T00:00:00.000Z').getTime(),
    category: SearchGroupNameEnumv2.LIVRES,
    query: 'harry potter',
  },
  {
    createdAt: new Date('2023-08-25T00:00:00.000Z').getTime(),
    category: SearchGroupNameEnumv2.LIVRES,
    query: 'pack lastman',
  },
]

describe('getHistoryLessThan30Days', () => {
  beforeEach(() => {
    mockdate.set(TODAY_DATE)
  })

  it('should return history less than 30 days', () => {
    const historyLessThan30Days = getHistoryLessThan30Days(history)
    expect(historyLessThan30Days).toEqual([
      {
        createdAt: new Date('2023-09-20T00:00:00.000Z').getTime(),
        category: SearchGroupNameEnumv2.LIVRES,
        query: 'one piece',
      },
      {
        createdAt: new Date('2023-09-15T00:00:00.000Z').getTime(),
        category: SearchGroupNameEnumv2.LIVRES,
        query: 'harry potter',
      },
    ])
  })
})
