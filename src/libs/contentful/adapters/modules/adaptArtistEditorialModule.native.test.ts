import { formattedArtistEditorialModule } from 'features/home/fixtures/homepage.fixture'
import { adaptArtistEditorialModule } from 'libs/contentful/adapters/modules/adaptArtistEditorialModule'
import { artistEditorialModuleFixture } from 'libs/contentful/fixtures/artistEditorialModule.fixture'

describe('adaptArtistEditorialModule', () => {
  it('should adapt an artist editorial module', () => {
    expect(adaptArtistEditorialModule(artistEditorialModuleFixture)).toEqual(
      formattedArtistEditorialModule
    )
  })
})
