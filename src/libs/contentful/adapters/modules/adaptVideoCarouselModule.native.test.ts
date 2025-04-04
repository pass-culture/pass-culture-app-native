import { formattedVideoCarouselModule } from 'features/home/fixtures/homepage.fixture'
import { adaptVideoCarouselModule } from 'libs/contentful/adapters/modules/adaptVideoCarouselModule'
import { videoCarouselFixture } from 'libs/contentful/fixtures/videoCarousel.fixture'
import { isVideoCarouselContentModel } from 'libs/contentful/types'

describe('adaptVideoCarouselModule', () => {
  it('should adapt a VideoCarousel module', () => {
    const rawVideoCarouselModule = videoCarouselFixture

    expect(isVideoCarouselContentModel(rawVideoCarouselModule)).toBe(true)
    expect(adaptVideoCarouselModule(rawVideoCarouselModule)).toEqual(formattedVideoCarouselModule)
  })
})
