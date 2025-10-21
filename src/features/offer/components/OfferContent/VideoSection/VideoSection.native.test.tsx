import React, { ComponentProps, createRef } from 'react'
import { ScrollView } from 'react-native'

import FastImage from '__mocks__/react-native-fast-image'
import { SubcategoryIdEnum } from 'api/gen'
import { VideoSection } from 'features/offer/components/OfferContent/VideoSection/VideoSection'
import { analytics } from 'libs/analytics/provider'
import { render, screen, userEvent } from 'tests/utils'
import { AnchorProvider } from 'ui/components/anchor/AnchorContext'

jest.mock('libs/firebase/analytics/analytics')

const defaultProps: ComponentProps<typeof VideoSection> = {
  offerId: 123,
  offerSubcategory: SubcategoryIdEnum.SEANCE_CINE,
  videoId: 'abc123',
  title: 'Peppa Pig',
  subtitle: 'le cochon rose',
  videoThumbnail: <FastImage />,
  onManageCookiesPress: jest.fn(),
  hasVideoCookiesConsent: false,
  onVideoConsentPress: jest.fn(),
}

const user = userEvent.setup()
jest.useFakeTimers()

describe('<VideoSection />', () => {
  it('should display Vidéo section', () => {
    renderVideoSection()

    expect(screen.getByText('Vidéo')).toBeOnTheScreen()
  })

  it('should display container without divider on desktop', () => {
    renderVideoSection({}, { theme: { isDesktopViewport: true } })

    expect(screen.getByTestId('video-section-without-divider')).toBeOnTheScreen()
  })

  it('should display container with divider on mobile', () => {
    renderVideoSection({}, { theme: { isDesktopViewport: false } })

    expect(screen.getByTestId('video-section-with-divider')).toBeOnTheScreen()
  })

  it('should display player with preview when user accepted video cookies', () => {
    renderVideoSection({ hasVideoCookiesConsent: true })

    expect(screen.getByRole('imagebutton')).toBeOnTheScreen()
  })

  it('should send log ConsultVideo when user taps Play on the thumbnail', async () => {
    renderVideoSection({ hasVideoCookiesConsent: true })

    const playButton = screen.getByRole('imagebutton')

    await user.press(playButton)

    expect(analytics.logConsultVideo).toHaveBeenCalledWith({
      from: 'offer',
      offerId: '123',
    })
  })

  it('should display player placeholder when user not accepted video cookies', () => {
    renderVideoSection({ hasVideoCookiesConsent: false })

    expect(
      screen.getByText(
        'En visionnant cette vidéo, tu t’engages à accepter les cookies liés à Youtube.'
      )
    ).toBeOnTheScreen()
  })
})

type RenderOptions = {
  theme?: { isDesktopViewport: boolean }
}

const renderVideoSection = (
  props?: Partial<ComponentProps<typeof VideoSection>>,
  options?: RenderOptions
) => {
  const scrollRef = createRef<ScrollView>()

  return render(
    <AnchorProvider scrollViewRef={scrollRef} handleCheckScrollY={() => 0}>
      <VideoSection {...defaultProps} {...props} />
    </AnchorProvider>,
    { theme: options?.theme ?? { isDesktopViewport: true } }
  )
}
