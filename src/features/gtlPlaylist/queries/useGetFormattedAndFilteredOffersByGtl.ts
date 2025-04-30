import { useGetOffersByGtlQuery } from 'features/gtlPlaylist/queries/useGetOffersByGtlQuery'
import { GtlPlaylistData, UseGetOffersByGtlQueryArgs } from 'features/gtlPlaylist/types'
import { AlgoliaOffer, HitOffer } from 'libs/algolia/types'

export const useGetFormattedAndFilteredOffersByGtl = (
  args: UseGetOffersByGtlQueryArgs,
  transformHits: (hit: AlgoliaOffer<HitOffer>) => AlgoliaOffer<HitOffer>
) =>
  useGetOffersByGtlQuery<GtlPlaylistData[]>(args, (data) => {
    return args.filteredGtlPlaylistsConfig
      .map((item, index) => {
        return {
          title: item.displayParameters.title,
          offers: { hits: data[index]?.hits?.map(transformHits) ?? [] },
          layout: item.displayParameters.layout,
          minNumberOfOffers: item.displayParameters.minOffers,
          entryId: item.id,
        }
      })
      .filter((playlist) => {
        return playlist?.offers?.hits.length >= Math.max(playlist.minNumberOfOffers, 1)
      })
  })
