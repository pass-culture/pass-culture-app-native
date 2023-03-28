import { removePrefixFromUrl } from 'features/deeplinks/helpers/removePrefixFromUrl'
import { linking } from 'features/navigation/RootNavigator/linking/__mocks__'

jest.mock('features/navigation/RootNavigator/linking')

describe('removePrefixFromUrl', () => {
  it.each`
    url                               | expectedUrl
    ${`${linking.prefixes[0]}my-url`} | ${'my-url'}
    ${`${linking.prefixes[1]}my-url`} | ${'my-url'}
    ${'my-url-whitout-prefix'}        | ${'my-url-whitout-prefix'}
  `('should remove prefix from url', ({ url, expectedUrl }) => {
    const urlWithoutPrefix = removePrefixFromUrl(url)
    expect(urlWithoutPrefix).toEqual(expectedUrl)
  })
})
