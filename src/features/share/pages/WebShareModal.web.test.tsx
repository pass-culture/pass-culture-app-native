import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { render, fireEvent, checkAccessibilityFor, screen } from 'tests/utils/web'

import { WebShareModal } from './WebShareModal'

const mockClipboardWriteText = jest.fn()
// @ts-ignore navigator.clipboard doesn't exist in the tests otherwise
navigator.clipboard = { writeText: mockClipboardWriteText }

const mockDismissModal = jest.fn()
const defaultProps = {
  visible: true,
  headerTitle: 'Partager l’offre',
  shareContent: { message: 'Voici une super offre !', url: 'https://url.com/offer' },
  dismissModal: mockDismissModal,
}

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('<WebShareModal/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<WebShareModal {...defaultProps} />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })

  it('should render correctly when shown', () => {
    const renderWebShareModal = render(<WebShareModal {...defaultProps} />)
    expect(renderWebShareModal).toMatchSnapshot()
  })

  it('should render correctly when hidden', () => {
    const props = { ...defaultProps, visible: false }
    const renderWebShareModal = render(<WebShareModal {...props} />)
    expect(renderWebShareModal).toMatchSnapshot()
  })

  it('should dismiss the modal on cancel button click', () => {
    render(<WebShareModal {...defaultProps} />)
    fireEvent.click(screen.getByText('Annuler'))
    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })
  it('should copy the link on the copy button click', () => {
    render(<WebShareModal {...defaultProps} />)
    fireEvent.click(screen.getByText('Copier'))
    expect(mockClipboardWriteText).toHaveBeenCalledWith('https://url.com/offer')
  })

  it('should open the email on the email button click', () => {
    render(<WebShareModal {...defaultProps} />)
    fireEvent.click(screen.getByText('E-mail'))
    expect(openUrl).toHaveBeenCalledWith(
      'mailto:?subject=Voici une super offre !&body=https://url.com/offer',
      undefined,
      true
    )
  })

  it('should open Facebook when sharing with Facebook', () => {
    render(<WebShareModal {...defaultProps} />)
    fireEvent.click(screen.getByText('Facebook'))
    expect(openUrl).toHaveBeenCalledWith(
      'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Furl.com%2Foffer&quote=Voici%20une%20super%20offre%20!',
      undefined,
      true
    )
  })

  it('should open Twitter when sharing with Twitter', () => {
    render(<WebShareModal {...defaultProps} />)
    fireEvent.click(screen.getByText('Twitter'))
    expect(openUrl).toHaveBeenCalledWith(
      'https://twitter.com/intent/tweet?text=Voici une super offre !&url=https://url.com/offer',
      undefined,
      true
    )
  })

  it('should open WhatsApp when sharing with WhatsApp', () => {
    render(<WebShareModal {...defaultProps} />)
    fireEvent.click(screen.getByText('WhatsApp'))
    expect(openUrl).toHaveBeenCalledWith(
      'https://api.whatsapp.com/send?text=Voici%20une%20super%20offre%20!%0Ahttps%3A%2F%2Furl.com%2Foffer',
      undefined,
      true
    )
  })

  it('should open Telegram when sharing with Telegram', () => {
    render(<WebShareModal {...defaultProps} />)
    fireEvent.click(screen.getByText('Telegram'))
    expect(openUrl).toHaveBeenCalledWith(
      'https://telegram.me/share/msg?url=https://url.com/offer&text=Voici une super offre !',
      undefined,
      true
    )
  })
})
