import {
  formattedBusinessModule,
  formattedOffersModule,
} from 'features/home/fixtures/homepage.fixture'
import { enrichModulesWithData } from 'features/home/helpers/enrichModulesWithData'
import { HomepageModule, ModuleData } from 'features/home/types'
import { offersFixture } from 'shared/offer/offer.fixture'

const defaultOfferData: ModuleData[] = [
  {
    playlistItems: offersFixture,
    nbPlaylistResults: 4,
    moduleId: '2DYuR6KoSLElDuiMMjxx8g',
  },
]

const expectedResult = [
  { ...formattedOffersModule, data: defaultOfferData[0] },
  formattedBusinessModule,
]

describe('enrichModulesWithData', () => {
  it('should enrich offers and venues modules with their corresponding data', () => {
    const modules: HomepageModule[] = [formattedOffersModule, formattedBusinessModule]

    const result = enrichModulesWithData(modules, defaultOfferData, [])

    expect(result).toEqual(expectedResult)
  })
})
