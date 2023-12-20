import { Linking } from 'react-native'

import { share } from 'libs/share/share'

const mockOpenUrl = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined)

const defaultContent = { body: 'Message', url: 'https://www.toto.com/' }

describe('share()', () => {
  it('should share with whatsapp url if on web and whatsapp mode', () => {
    share({ content: defaultContent, mode: 'WhatsApp' })

    expect(mockOpenUrl).toHaveBeenCalledWith(
      'https://api.whatsapp.com/send?text=Message%C2%A0%3A%0Ahttps%3A%2F%2Fwww.toto.com%2F'
    )
  })
})
