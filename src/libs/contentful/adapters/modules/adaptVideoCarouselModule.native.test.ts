import { formattedVideoCarouselModule } from 'features/home/fixtures/homepage.fixture'
import { adaptVideoCarouselModule } from 'libs/contentful/adapters/modules/adaptVideoCarouselModule'
import { videoCarouselFixture } from 'libs/contentful/fixtures/videoCarousel.fixture'

describe('adaptVideoCarouselModule', () => {
  it('should adapt a VideoCarousel module', () => {
    const rawVideoCarouselModule = videoCarouselFixture

    expect(adaptVideoCarouselModule(rawVideoCarouselModule)).toEqual(formattedVideoCarouselModule)
  })
})
