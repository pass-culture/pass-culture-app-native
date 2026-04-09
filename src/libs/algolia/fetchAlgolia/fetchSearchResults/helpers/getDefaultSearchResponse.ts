import { Hit } from 'algoliasearch'

export const getDefaultSearchResponse = <H>() => ({
  hits: [] as Hit<H>[],
  nbHits: 0,
  page: 0,
  nbPages: 0,
  userData: null,
})
