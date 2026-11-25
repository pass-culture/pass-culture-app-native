import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { checkAccessibilityFor, fireEvent, render, screen } from 'tests/utils/web'

import { WebShareModal } from './WebShareModal'

const mockClipboardWriteText = jest.fn()
Object.assign(navigator, { clipboard: { writeText: mockClipboardWriteText } })

const mockDismissModal = jest.fn()
const defaultProps = {
  visible: true,
  headerTitle: 'Partager l’offre',
  shareContent: {
    subject: 'Je t’invite à découvrir une super offre sur le pass Culture\u00a0!',
    body: 'Voici une super offre\u00a0!',
    url: 'https://url.com/offer',
  },
  dismissModal: mockDismissModal,
}

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/navigation/navigators/RootNavigator/linking/withAuthProtection')
jest.mock('ui/theme/customFocusOutline/customFocusOutline')

describe('<WebShareModal/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<WebShareModal {...defaultProps} />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })

  it('should render correctly when shown', () => {
    const { baseElement } = render(<WebShareModal {...defaultProps} />)

    expect(baseElement).toMatchSnapshot()
  })

  it('should render correctly when hidden', () => {
    const props = { ...defaultProps, visible: false }
    const { baseElement } = render(<WebShareModal {...props} />)

    expect(baseElement).toMatchSnapshot()
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

  it.each([
    {
      label: 'E-mail',
      url: 'mailto:?subject=Je t’invite à découvrir une super offre sur le pass Culture\u00a0!&body=Voici%20une%20super%20offre%C2%A0!%0Ahttps%3A%2F%2Furl.com%2Foffer',
    },
    {
      label: 'Facebook',
      url: 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Furl.com%2Foffer&quote=Voici%20une%20super%20offre%C2%A0!',
    },
    {
      label: 'X',
      url: 'https://twitter.com/intent/tweet?text=Voici une super offre\u00a0!&url=https%3A%2F%2Furl.com%2Foffer',
    },
    {
      label: 'WhatsApp',
      url: 'https://api.whatsapp.com/send?text=Voici%20une%20super%20offre%C2%A0!%0Ahttps%3A%2F%2Furl.com%2Foffer',
    },
    {
      label: 'Telegram',
      url: 'https://telegram.me/share/msg?url=https%3A%2F%2Furl.com%2Foffer&text=Voici une super offre\u00a0!',
    },
  ])('should open $label when sharing with $label', ({ label, url }) => {
    render(<WebShareModal {...defaultProps} />)
    fireEvent.click(screen.getByText(label))

    expect(openUrl).toHaveBeenCalledWith(url, undefined, true)
  })

  it('should expose visible labels in share links accessibility labels', () => {
    render(<WebShareModal {...defaultProps} />)

    expect(screen.getByRole('link', { name: 'E-mail - Ouvrir le gestionnaire mail' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Facebook - Nouvelle fenêtre' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'X - Nouvelle fenêtre' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'WhatsApp - Nouvelle fenêtre' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Telegram - Nouvelle fenêtre' })).toBeTruthy()
  })
})
