import React from 'react'

import { CategoriesButtonsDisplay } from 'features/search/components/CategoriesButtonsDisplay/CategoriesButtonsDisplay'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { render, screen } from 'tests/utils/web'

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(true)
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('CategoriesButtonsDisplay', () => {
  it('should not display venue map block when is "web"', () => {
    render(<CategoriesButtonsDisplay sortedCategories={[]} />)

    expect(screen.queryByText('Explorer les lieux')).not.toBeOnTheScreen()
  })
})
