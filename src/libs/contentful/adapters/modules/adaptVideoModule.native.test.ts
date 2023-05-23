import { videoModuleFixture } from 'features/home/fixtures/videoModule.fixture'
import { adaptVideoModule } from 'libs/contentful/adapters/modules/adaptVideoModule'
import { videoContentModelFixture } from 'libs/contentful/fixtures/videoContentModel.fixture'

describe('adaptVideoModule', () => {
  it('should adapt from Contentful data', () => {
    expect(adaptVideoModule(videoContentModelFixture)).toEqual(videoModuleFixture)
  })
})
