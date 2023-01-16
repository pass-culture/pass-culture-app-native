import React from 'react'

import { WebShareModal } from 'libs/share/WebShareModal'
import { render } from 'tests/utils'

const defaultProps = {
  visible: true,
  headerTitle: 'Partager l’offre',
  shareContent: { message: 'Voici une super offre !', url: 'https://url.com/offer' },
  dismissModal: jest.fn(),
}

describe('<WebShareModal />', () => {
  it('should not render in native', () => {
    const renderAPI = render(<WebShareModal {...defaultProps} />)
    expect(renderAPI.toJSON()).toBeNull()
  })
})
