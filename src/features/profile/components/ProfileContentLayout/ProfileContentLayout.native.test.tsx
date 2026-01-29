import React from 'react'

import { render, screen } from 'tests/utils'
import { Confidentiality } from 'ui/svg/icons/Confidentiality'
import { HandicapMental } from 'ui/svg/icons/HandicapMental'

import { ProfileContentLayout } from './ProfileContentLayout'

jest.mock('libs/firebase/analytics/analytics')

describe('ProfileContentLayout', () => {
  it('renders the container with the given testID', () => {
    render(
      <ProfileContentLayout
        testID="profile-content"
        config={[
          {
            section: 'Section',
            items: [
              {
                title: 'Confidentialité',
                screen: 'ConsentSettings',
                icon: Confidentiality,
              },
              {
                title: 'Accessibilité',
                screen: 'Accessibility',
                icon: HandicapMental,
              },
            ],
          },
        ]}
      />
    )

    expect(screen.getByTestId('profile-content')).toBeTruthy()
  })

  it('renders a section with items', () => {
    render(
      <ProfileContentLayout
        config={[
          {
            section: 'Section',
            items: [
              {
                title: 'Confidentialité',
                screen: 'ConsentSettings',
                icon: Confidentiality,
              },
              {
                title: 'Accessibilité',
                screen: 'Accessibility',
                icon: HandicapMental,
              },
            ],
          },
        ]}
      />
    )

    expect(screen.getByText('Section')).toBeTruthy()
    expect(screen.getByText('Confidentialité')).toBeTruthy()
    expect(screen.getByText('Accessibilité')).toBeTruthy()
  })
})
