import React from 'react'

import { NotificationsSettingsModal } from 'features/subscription/NotificationsSettingsModal'
import { render, checkAccessibilityFor, act } from 'tests/utils/web'

describe('<NotificationsSettingsModal />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <NotificationsSettingsModal
          visible
          title="S’abonner au thème “Cinéma”"
          description="Pour recevoir toute l’actu de ce thème, tu dois, au choix&nbsp;:"
          dismissModal={jest.fn()}
          onPressSaveChanges={jest.fn()}
        />
      )
      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
