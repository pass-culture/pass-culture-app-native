import React from 'react'

import { CategoriesButtonsDisplay } from 'features/search/components/CategoriesButtonsDisplay/CategoriesButtonsDisplay'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { render, screen } from 'tests/utils/web'

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(true)
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('CategoriesButtonsDisplay', () => {
  it('should not display venue map block when is "web"', () => {
    render(<CategoriesButtonsDisplay sortedCategories={[]} />)

    expect(screen.queryByText('Explorer les lieux')).not.toBeOnTheScreen()
  })
})
