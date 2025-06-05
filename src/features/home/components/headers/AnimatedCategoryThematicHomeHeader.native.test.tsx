import React from 'react'

import { AnimatedCategoryThematicHomeHeader } from 'features/home/components/headers/AnimatedCategoryThematicHomeHeader'
import { Color } from 'features/home/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.mock('features/profile/pages/NotificationSettings/usePushPermission', () => ({
  usePushPermission: jest.fn(() => ({
    pushPermission: 'granted',
  })),
}))

jest.mock('libs/firebase/analytics/analytics')

describe('AnimatedCategoryThematicHomeHeader', () => {
  it('should show title and subtitle if render correctly', async () => {
    renderAnimatedCategoryThematicHomeHeader()

    expect(await screen.findByText('Un titre')).toBeOnTheScreen()
    expect(screen.getByText('Un sous-titre')).toBeOnTheScreen()
  })
})

const renderAnimatedCategoryThematicHomeHeader = () => {
  render(
    reactQueryProviderHOC(
      <AnimatedCategoryThematicHomeHeader
        subtitle="Un sous-titre"
        title="Un titre"
        color={Color.Aquamarine}
      />
    )
  )
}
