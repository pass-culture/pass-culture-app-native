import { ArtistPlaylistModule, HomepageModuleType } from 'features/home/types'
import { adaptArtistPlaylistModule } from 'libs/contentful/adapters/modules/adaptArtistPlaylistModule'
import { artistPlaylistModuleFixture } from 'libs/contentful/fixtures/artistPlaylistModule.fixture'

describe('adaptArtistModule', () => {
  it('should adapt an artist playlist module', () => {
    const formattedArtistPlaylistModule: ArtistPlaylistModule = {
      type: HomepageModuleType.ArtistPlaylistModule,
      id: '2DYuR6KoSLElDuiMMjxx8g',
      title: 'Fais le plein de lecture',
      artistId: 'dc9babd-4cd3-4971-ae5c-6f7775748807',
      displayParameters: {
        title: 'Fais le plein de lecture avec notre partenaire ',
        subtitle: 'Tout plein de livres pour encore plus de fun sans que pour autant on en sache ',
        layout: 'two-items',
        minOffers: 1,
      },
      offersModuleParameters: [
        {
          title: 'Livre',
          categories: ['Cartes jeunes', 'Spectacles'],
          hitsPerPage: 10,
          subcategories: ['Livre', 'Livre numérique, e-book'],
          minBookingsThreshold: 2,
          musicTypes: ['Pop', 'Gospel'],
          movieGenres: ['ACTION', 'BOLLYWOOD'],
          showTypes: ['Humour / Café-théâtre', 'Opéra', 'Danse'],
          bookTypes: ['Carrière/Concours', 'Scolaire & Parascolaire', 'Gestion/entreprise'],
        },
      ],
    }

    expect(adaptArtistPlaylistModule(artistPlaylistModuleFixture)).toEqual(
      formattedArtistPlaylistModule
    )
  })
})
