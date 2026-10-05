import { formattedArtistHighlightingModule } from 'features/home/fixtures/homepage.fixture'
import { adaptArtistHighlightingModule } from 'libs/contentful/adapters/modules/adaptArtistHighlightingModule'
import { artistHighlightingModuleFixture } from 'libs/contentful/fixtures/artistHighlightingModule.fixture'

describe('adaptArtistHighlightingModule', () => {
  it('should adapt an artist highlighting module', () => {
    expect(adaptArtistHighlightingModule(artistHighlightingModuleFixture)).toEqual(
      formattedArtistHighlightingModule
    )
  })
})
