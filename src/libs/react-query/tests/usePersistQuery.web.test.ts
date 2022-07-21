import { useQuery } from 'react-query'

import { usePersistQuery } from '../usePersistQuery'

describe('usePersistQuery web', () => {
  it('should export useQuery in web', () => {
    expect(usePersistQuery).toBe(useQuery)
  })
})
