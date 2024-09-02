import React from 'react'

import { NotificationsSettingsModal } from 'features/subscription/NotificationsSettingsModal'
import { render, checkAccessibilityFor, act } from 'tests/utils/web'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

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
