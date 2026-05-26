import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { CreditBanner } from 'features/profile/components/Tutorial/CreditBanner'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { render, screen, userEvent } from 'tests/utils'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

jest.mock('libs/firebase/analytics/analytics')

describe('<CreditBanner />', () => {
  describe('without bonification', () => {
    it('should render only credit FAQ link', () => {
      render(<CreditBanner enableBonification={false} />)

      expect(screen.getByText('Plus d’infos sur ton crédit')).toBeOnTheScreen()

      expect(screen.queryByText('Plus d’infos sur les bonus sous conditions')).not.toBeOnTheScreen()
    })

    it('should open credit FAQ link', async () => {
      render(<CreditBanner enableBonification={false} />)

      const link = screen.getByText('Plus d’infos sur ton crédit')

      await userEvent.press(link)

      expect(openUrl).toHaveBeenCalledWith(env.FAQ_LINK_PASS_CULTURE, undefined, true)
    })

    it('should log analytics when pressing credit FAQ link', async () => {
      render(<CreditBanner enableBonification={false} />)

      const link = screen.getByText('Plus d’infos sur ton crédit')

      await userEvent.press(link)

      expect(analytics.logHasClickedTutorialFAQ).toHaveBeenCalledWith({
        type: 'FAQ_LINK_PASS_CULTURE',
      })
    })
  })

  describe('with bonification', () => {
    it('should render bonus FAQ link', () => {
      render(<CreditBanner enableBonification />)

      expect(screen.getByText('Plus d’infos sur les bonus sous conditions')).toBeOnTheScreen()
    })

    it('should open bonus FAQ link', async () => {
      render(<CreditBanner enableBonification />)

      const link = screen.getByText('Plus d’infos sur les bonus sous conditions')

      await userEvent.press(link)

      expect(openUrl).toHaveBeenCalledWith(env.FAQ_BONIFICATION_GENERIC, undefined, true)
    })

    it('should log analytics when pressing bonus FAQ link', async () => {
      render(<CreditBanner enableBonification />)

      const link = screen.getByText('Plus d’infos sur les bonus sous conditions')

      await userEvent.press(link)

      expect(analytics.logHasClickedTutorialFAQ).toHaveBeenCalledWith({
        type: 'FAQ_BONIFICATION_GENERIC',
      })
    })
  })
})
