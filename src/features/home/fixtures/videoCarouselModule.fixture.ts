import type { ReadonlyDeep } from 'type-fest'

import { Color, HomepageModuleType, VideoCarouselItem } from 'features/home/types'
import { toMutable } from 'shared/types/toMutable'

export type VideoCarouselModuleFixtureType = {
  index: number
  homeEntryId: string
  autoplay?: boolean
  type: HomepageModuleType.VideoCarouselModule
  id: string
  title: string
  color: Color
  items: VideoCarouselItem[]
}

export const videoCarouselModuleFixture = toMutable({
  type: HomepageModuleType.VideoCarouselModule,
  color: Color.Coral,
  index: 0,
  homeEntryId: '6rAlo1Vfczss3JQfbE8Oh8',
  id: '6h3Di5jCsnfMPiArv64zMp',
  title: 'Test video 7:10',
  items: [
    {
      id: '2HvwrBGxLWi5j51dcUzEWH',
      title: 'Vidéo 1',
      youtubeVideoId: 'SH0txeYlJ6Q',
      offerId: '99806161',
    },
    {
      id: '3avo2mC7pHcKvzy2FgiHgU',
      title: 'Vidéo - BANDE ANNONCE - L’Enfant qui mesurait le monde',
      youtubeVideoId: 'I_zebKwdh9U',
      offerId: '12607',
      tag: 'Carousel video seance cine',
    },
    {
      id: '21JVjHpUoybl4IuUwaVqlS',
      title: 'Video 2',
      youtubeVideoId: 'Ul4UVpkSfOQ',
      homeEntryId: '3R5CCFYM3e4bBiysBgEebM',
      thematicHomeTag: 'Cinéma',
      thematicHomeTitle: 'Le meilleur du cinéma en juin pour un été de folie',
      thematicHomeSubtitle: 'Du 25/06 au 14/08',
    },
  ],
  autoplay: true,
} as const satisfies ReadonlyDeep<VideoCarouselModuleFixtureType>)
