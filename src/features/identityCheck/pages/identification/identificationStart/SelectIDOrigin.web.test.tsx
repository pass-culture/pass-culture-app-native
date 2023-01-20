import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SelectIDOrigin } from 'features/identityCheck/pages/identification/identificationStart/SelectIDOrigin'
import { checkAccessibilityFor, fireEvent, render } from 'tests/utils/web'

describe('selectIDOrigin', () => {
  it('should navigate to SelectPhoneStatus on press "J’ai une carte d’identité ou un passeport" HeroButtonList', () => {
    const { getByTestId } = render(<SelectIDOrigin />)

    const HeroButtonList = getByTestId('J’ai une carte d’identité ou un passeport français')
    fireEvent.click(HeroButtonList)

    expect(navigate).toHaveBeenCalledWith('SelectPhoneStatus', undefined)
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<SelectIDOrigin />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
