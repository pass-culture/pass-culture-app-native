import { getQueryParamsFromPath } from 'features/navigation/RootNavigator/linking/getQueryParamsFromPath'

describe('getQueryParamsFromPath()', () => {
  it.each`
    path                                      | expectedQueryParams
    ${'?id=12&'}                              | ${{ id: '12' }}
    ${'/?utm_campaign=home_ete&utm_medium=/'} | ${{ utm_campaign: 'home_ete', utm_medium: '' }}
  `(
    'should parse the query params from the path=$path',
    ({
      path,
      expectedQueryParams,
    }: {
      path: string
      expectedQueryParams: Record<string, string> | null
    }) => {
      const queryParams = getQueryParamsFromPath(path)
      expect(queryParams).toStrictEqual(expectedQueryParams)
    }
  )
})
