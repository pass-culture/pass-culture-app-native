import React from 'react'

import { openUrl } from 'features/navigation/helpers/openUrl'
import { env } from 'libs/environment'
import { shareAppContent } from 'libs/share/shareApp/shareAppContent'
import { ShareAppModal } from 'libs/share/shareApp/ShareAppModal'
import { fireEvent, render } from 'tests/utils/web'

const dismissModal = jest.fn()

jest.mock('features/navigation/helpers/openUrl')
const mockedOpenUrl = openUrl as jest.MockedFunction<typeof openUrl>

const url = env.PASSCULTURE_DOWNLOAD_APP_URL
const message = shareAppContent.message

describe('<ShareAppModal />', () => {
  it('should match snapshot', () => {
    const renderAPI = render(<ShareAppModal visible={true} dismissModal={dismissModal} />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should not display if visible false', () => {
    const renderAPI = render(<ShareAppModal visible={false} dismissModal={dismissModal} />)
    expect(renderAPI.container).toBeEmptyDOMElement()
  })

  it('should open the email on the email button click', () => {
    const { getByLabelText } = render(<ShareAppModal visible={true} dismissModal={dismissModal} />)
    const emailButton = getByLabelText('Ouvrir le gestionnaire mail')
    fireEvent.click(emailButton)
    expect(mockedOpenUrl).toHaveBeenNthCalledWith(
      1,
      `mailto:?subject=${message}&body=${url}`,
      undefined
    )
  })

  it('should open Twitter when sharing with Twitter', () => {
    const { getByText } = render(<ShareAppModal visible={true} dismissModal={dismissModal} />)
    const twitterButton = getByText('Twitter')
    fireEvent.click(twitterButton)
    expect(mockedOpenUrl).toHaveBeenNthCalledWith(
      1,
      `https://twitter.com/intent/tweet?text=${message}&url=${url}`,
      undefined
    )
  })

  it('should open Telegram when sharing with Telegram', () => {
    const { getByText } = render(<ShareAppModal visible={true} dismissModal={dismissModal} />)
    const telegramButton = getByText('Telegram')
    fireEvent.click(telegramButton)
    expect(mockedOpenUrl).toHaveBeenNthCalledWith(
      1,
      `https://telegram.me/share/msg?url=${url}&text=${message}`,
      undefined
    )
  })

  it('should open WhatsApp when sharing with WhatsApp', () => {
    const { getByText } = render(<ShareAppModal visible={true} dismissModal={dismissModal} />)
    const whatsAppButton = getByText('WhatsApp')
    fireEvent.click(whatsAppButton)
    expect(mockedOpenUrl).toHaveBeenNthCalledWith(
      1,
      `https://api.whatsapp.com/send?text=${encodeURIComponent(message + '\n' + url)}`,
      undefined
    )
  })

  it('should open Facebook when sharing with Facebook', () => {
    const { getByText } = render(<ShareAppModal visible={true} dismissModal={dismissModal} />)
    const facebookButton = getByText('Facebook')
    fireEvent.click(facebookButton)
    expect(mockedOpenUrl).toHaveBeenNthCalledWith(
      1,
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}&quote=${encodeURIComponent(message)}`,
      undefined
    )
  })
})
