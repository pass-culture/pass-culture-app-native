import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { TrendsModule } from 'features/home/components/modules/TrendsModule'
import { formattedTrendsModule } from 'features/home/fixtures/homepage.fixture'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { fireEvent, render, screen, waitFor } from 'tests/utils/web'

const trackingProps = {
  index: 1,
  homeEntryId: '4Fs4egA8G2z3fHgU2XQj3h',
  moduleId: formattedTrendsModule.id,
}

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

describe('TrendsModule', () => {
  it('should redirect to thematic home when content type is venue map block', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    render(<TrendsModule {...trackingProps} {...formattedTrendsModule} />)

    fireEvent.click(screen.getByText('Accès carte des lieux'))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('ThematicHome', {
        homeId: '7qcfqY5zFesLVO5fMb4cqm',
        moduleId: '6dn0unOv4tRBNfOebVHOOy',
        from: 'trend_block',
      })
    })
  })
})
