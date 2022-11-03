import { Share } from 'react-native'

import { share } from 'libs/share'

const defaultContent = { message: 'Message' }
const defaultOptions = {}
const shareMock = jest.spyOn(Share, 'share')

describe('share()', () => {
  it('should not trigger native share on web', () => {
    share(defaultContent, defaultOptions)

    expect(shareMock).not.toHaveBeenCalled()
  })
})
