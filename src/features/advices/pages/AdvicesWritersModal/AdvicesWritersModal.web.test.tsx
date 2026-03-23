import React from 'react'

import { adviceVariantInfoFixture } from 'features/advices/fixtures/adviceVariantInfo.fixture'
import { AdvicesWritersModal } from 'features/advices/pages/AdvicesWritersModal/AdvicesWritersModal'
import { act, checkAccessibilityFor, render } from 'tests/utils/web'

describe('<AdvicesWritersModal/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <AdvicesWritersModal
          isVisible
          closeModal={jest.fn()}
          onShowRecoButtonPress={jest.fn()}
          modalWording={adviceVariantInfoFixture.modalWording}
          buttonWording={adviceVariantInfoFixture.buttonWording}
        />
      )
      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
