import React from 'react'

import { AnimatedCategoryThematicHomeHeader } from 'features/home/components/headers/AnimatedCategoryThematicHomeHeader'
import { Color } from 'features/home/types'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { render, screen } from 'tests/utils'

const mockUseFeatureFlag = jest.spyOn(useFeatureFlag, 'useFeatureFlag')

describe('AnimatedCategoryThematicHomeHeader', () => {
  describe('when WIP_APP_V2_THEMATIC_HOME_HEADER is on', () => {
    beforeAll(() => {
      mockUseFeatureFlag.mockReturnValue(true)
    })

    it('should render the v1 header and not the v2', async () => {
      render(
        <AnimatedCategoryThematicHomeHeader
          imageUrl="https://images.ctfassets.net/2bg01iqy0isv/5PmtxKY77rq0nYpkCFCbrg/4daa8767efa35827f22bb86e5fc65094/photo-lion_noir-et-blanc_laurent-breillat-610x610.jpeg"
          subtitle="Un sous-titre"
          title="Un titre"
          color={Color.Aquamarine}
        />
      )

      expect(screen.getByTestId('animated-thematic-header-v2')).toBeOnTheScreen()
      expect(screen.queryByTestId('animated-thematic-header-v1')).not.toBeOnTheScreen()
    })

    it('should show title and subtitle if render correctly', async () => {
      render(
        <AnimatedCategoryThematicHomeHeader
          imageUrl="https://images.ctfassets.net/2bg01iqy0isv/5PmtxKY77rq0nYpkCFCbrg/4daa8767efa35827f22bb86e5fc65094/photo-lion_noir-et-blanc_laurent-breillat-610x610.jpeg"
          subtitle="Un sous-titre"
          title="Un titre"
          color={Color.Aquamarine}
        />
      )

      expect(await screen.findByText('Un titre')).toBeOnTheScreen()
      expect(screen.getByText('Un sous-titre')).toBeOnTheScreen()
    })
  })

  describe('when WIP_APP_V2_THEMATIC_HOME_HEADER is off', () => {
    beforeAll(() => {
      mockUseFeatureFlag.mockReturnValue(false)
    })

    it('should render the v2 header and not the v1', async () => {
      render(
        <AnimatedCategoryThematicHomeHeader
          imageUrl="https://images.ctfassets.net/2bg01iqy0isv/5PmtxKY77rq0nYpkCFCbrg/4daa8767efa35827f22bb86e5fc65094/photo-lion_noir-et-blanc_laurent-breillat-610x610.jpeg"
          subtitle="Un sous-titre"
          title="Un titre"
          color={Color.Aquamarine}
        />
      )

      expect(screen.getByTestId('animated-thematic-header-v1')).toBeOnTheScreen()
      expect(screen.queryByTestId('animated-thematic-header-v2')).not.toBeOnTheScreen()
    })

    it('should show title and subtitle if render correctly', async () => {
      render(
        <AnimatedCategoryThematicHomeHeader
          imageUrl="https://images.ctfassets.net/2bg01iqy0isv/5PmtxKY77rq0nYpkCFCbrg/4daa8767efa35827f22bb86e5fc65094/photo-lion_noir-et-blanc_laurent-breillat-610x610.jpeg"
          subtitle="Un sous-titre"
          title="Un titre"
          color={Color.Aquamarine}
        />
      )

      expect(await screen.findByText('Un titre')).toBeOnTheScreen()
      expect(screen.getByText('Un sous-titre')).toBeOnTheScreen()
    })
  })
})
