import { Layout } from 'features/home/contentful'
import { SearchHit } from 'libs/search'

export const useLayoutHits = (hits: SearchHit[], _layout: Layout) => hits
