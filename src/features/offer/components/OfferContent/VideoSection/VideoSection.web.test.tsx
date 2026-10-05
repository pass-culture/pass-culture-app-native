import React, { ComponentProps, createRef } from 'react'
import { ScrollView, View } from 'react-native'

import { VideoSection } from 'features/offer/components/OfferContent/VideoSection/VideoSection'
import { render, screen } from 'tests/utils/web'
import { AnchorProvider } from 'ui/components/anchor/AnchorContext'

jest.mock('libs/firebase/analytics/analytics')

const defaultProps: ComponentProps<typeof VideoSection> = {
  offerId: 123,
  videoId: 'abc123',
  title: 'Peppa Pig',
  subtitle: 'le cochon rose',
  videoThumbnail: <View />,
  onManageCookiesPress: jest.fn(),
  hasVideoCookiesConsent: false,
  onVideoConsentPress: jest.fn(),
}

describe('<VideoSection />', () => {
  it('should align the portrait player to the left instead of centering it', () => {
    renderVideoSection({ isPortrait: true })

    expect(screen.getByLabelText('Le lecteur vidéo est désactivé.')).toHaveStyle({
      alignSelf: 'flex-start',
    })
  })

  it('should not constrain the alignment of a landscape player', () => {
    renderVideoSection()

    expect(screen.getByLabelText('Le lecteur vidéo est désactivé.')).not.toHaveStyle({
      alignSelf: 'flex-start',
    })
  })
})

const renderVideoSection = (props?: Partial<ComponentProps<typeof VideoSection>>) => {
  const scrollRef = createRef<ScrollView>()

  return render(
    <AnchorProvider scrollViewRef={scrollRef} handleCheckScrollY={() => 0}>
      <VideoSection {...defaultProps} {...props} />
    </AnchorProvider>,
    { theme: { isDesktopViewport: true } }
  )
}
