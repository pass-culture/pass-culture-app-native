import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SelectPhoneStatus } from 'features/identityCheck/pages/identification/ubble/SelectPhoneStatus.web'
import { checkAccessibilityFor, fireEvent, render, screen } from 'tests/utils/web'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('SelectPhoneStatus', () => {
  it('should render correctly', () => {
    const { container } = render(<SelectPhoneStatus />)

    expect(container).toMatchSnapshot()
  })

  it('should navigate to SelectIDStatus on press "J’ai un smartphone à proximité" button', () => {
    render(<SelectPhoneStatus />)

    const HeroButtonList = screen.getAllByTestId('HeroButtonList')[0]
    // @ts-expect-error: because of noUncheckedIndexedAccess
    fireEvent.click(HeroButtonList)

    expect(navigate).toHaveBeenCalledWith('SelectIDStatus', undefined)
  })

  it('should navigate to DMSIntroduction FR when pressing "Je n’ai pas de smartphone" button', () => {
    render(<SelectPhoneStatus />)

    const HeroButtonList = screen.getAllByTestId('HeroButtonList')[1]
    // @ts-expect-error: because of noUncheckedIndexedAccess
    fireEvent.click(HeroButtonList)

    expect(navigate).toHaveBeenCalledWith('DMSIntroduction', { isForeignDMSInformation: false })
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<SelectPhoneStatus />)
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
