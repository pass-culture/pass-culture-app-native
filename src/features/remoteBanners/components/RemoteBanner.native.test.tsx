import React from 'react'

import { onPressStoreLink } from 'features/forceUpdate/helpers/onPressStoreLink'
import { RemoteBanner } from 'features/remoteBanners/components/RemoteBanner'
import {
  RemoteBannerRedirectionType,
  validateRemoteBanner,
} from 'features/remoteBanners/utils/remoteBannerSchema'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/remoteBanners/utils/remoteBannerSchema')
jest.mock('features/forceUpdate/helpers/onPressStoreLink')

const mockValidate = validateRemoteBanner as jest.Mock
const mockStoreLink = onPressStoreLink as jest.Mock

const user = userEvent.setup()

const defaultProps = {
  from: 'profile' as const,
  leftIcon: () => null,
  logClickEvent: jest.fn(),
  analyticsParams: {
    type: 'remoteGenericBanner' as const,
    from: 'profile' as const,
  },
}

const bannerExternal = {
  title: 'title 1',
  subtitleMobile: 'subtitle mobile',
  subtitleWeb: 'subtitle web',
  redirectionUrl: 'https://test.com',
  redirectionType: RemoteBannerRedirectionType.EXTERNAL,
}

const bannerStore = {
  title: 'title 1',
  subtitleMobile: 'subtitle mobile',
  subtitleWeb: 'subtitle web',
  redirectionUrl: 'https://test.com',
  redirectionType: RemoteBannerRedirectionType.STORE,
}

describe('<RemoteBanner />', () => {
  it('should not render if validation fails', () => {
    mockValidate.mockReturnValueOnce(null)

    render(<RemoteBanner {...defaultProps} options={{}} />)

    expect(screen.queryByText('title 1')).not.toBeOnTheScreen()
  })

  it('should render banner when validation succeeds', () => {
    mockValidate.mockReturnValueOnce(bannerExternal)

    render(<RemoteBanner {...defaultProps} options={bannerExternal} />)

    expect(screen.getByText('title 1')).toBeOnTheScreen()
  })

  it('should trigger store navigation when store redirection', async () => {
    mockValidate.mockReturnValueOnce(bannerStore)

    render(<RemoteBanner {...defaultProps} options={bannerStore} />)

    const banner = screen.getByText('title 1')

    await user.press(banner)

    expect(mockStoreLink).toHaveBeenCalledTimes(1)
  })

  it('should call logClickEvent before navigation', async () => {
    mockValidate.mockReturnValueOnce(bannerStore)

    const logClickEvent = jest.fn()

    render(<RemoteBanner {...defaultProps} logClickEvent={logClickEvent} options={bannerStore} />)

    const banner = screen.getByText('title 1')

    await user.press(banner)

    expect(logClickEvent).toHaveBeenCalledWith('profile', bannerStore)
  })

  it('should render external link banner', () => {
    mockValidate.mockReturnValueOnce(bannerExternal)

    render(<RemoteBanner {...defaultProps} options={bannerExternal} />)

    const banner = screen.getByRole(AccessibilityRole.LINK)

    expect(banner).toBeTruthy()
  })

  it('should have correct accessibility label for external link', () => {
    mockValidate.mockReturnValueOnce(bannerExternal)

    render(<RemoteBanner {...defaultProps} options={bannerExternal} />)

    const banner = screen.getByLabelText('Nouvelle fenêtre\u00a0: https://test.com')

    expect(banner).toBeTruthy()
  })

  it('should render store banner with correct accessibility role', () => {
    mockValidate.mockReturnValueOnce(bannerStore)

    render(<RemoteBanner {...defaultProps} options={bannerStore} />)

    const banner = screen.getByRole(AccessibilityRole.LINK)

    expect(banner).toBeTruthy()
  })
})
