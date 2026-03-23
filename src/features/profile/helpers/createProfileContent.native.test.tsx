import React from 'react'

import { render, screen } from 'tests/utils'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { Typo } from 'ui/theme'

import { createProfileContent, SectionItem } from './createProfileContent'

jest.mock('libs/firebase/analytics/analytics')

describe('createProfileContent', () => {
  it('should render a component wrapped in a View when item is a Component', () => {
    const item: SectionItem = {
      component: <Typo.Body>My Component</Typo.Body>,
      key: 'uniqueKey',
    }

    const element = createProfileContent(item)
    render(<React.Fragment>{element}</React.Fragment>)

    expect(screen.getByText('My Component')).toBeTruthy()
  })

  it('should render an ExternalNavButton', () => {
    const item: SectionItem = {
      title: 'External Link',
      externalNav: { url: 'https://example.com' },
    }

    const element = createProfileContent(item)
    render(<React.Fragment>{element}</React.Fragment>)

    expect(screen.getByText('External Link')).toBeTruthy()
  })

  it('should render an InternalNavButton', () => {
    const item: SectionItem = {
      title: 'Internal Screen',
      screen: 'ProfileTutorialAgeInformationCredit',
      icon: ExternalSite,
      params: { foo: 'bar' },
    }

    const element = createProfileContent(item)
    render(<React.Fragment>{element}</React.Fragment>)

    expect(screen.getByText('Internal Screen')).toBeTruthy()
  })
})
