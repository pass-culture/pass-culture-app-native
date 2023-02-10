import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SelectPhoneStatus } from 'features/identityCheck/pages/identification/identificationStart/SelectPhoneStatus.web'
import { checkAccessibilityFor, fireEvent, render } from 'tests/utils/web'

describe('SelectPhoneStatus', () => {
  it('should render correctly', () => {
    const selectPhoneStatus = render(<SelectPhoneStatus />)
    expect(selectPhoneStatus).toMatchSnapshot()
  })

  it('should navigate to SelectIDStatus on press "J’ai un smartphone à proximité" button', () => {
    const { getAllByTestId } = render(<SelectPhoneStatus />)

    const HeroButtonList = getAllByTestId('HeroButtonList')[0]
    fireEvent.click(HeroButtonList)

    expect(navigate).toHaveBeenCalledWith('SelectIDStatus', undefined)
  })

  it('should navigate to DMSIntroduction FR when pressing "Je n\'ai pas de smartphone" button', () => {
    const { getAllByTestId } = render(<SelectPhoneStatus />)

    const HeroButtonList = getAllByTestId('HeroButtonList')[1]
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
