useSearchResults
 When user share his location and received venues from Algolia
- should set initial venues


 When user share his location and not received venues from Algolia
- should set initial venues as empty array


 When user not share his location and received venues from Algolia
- should set initial venues as empty array


 useSearchInfiniteQuery
- should fetch offers, venues and all facets
- should not fetch again when focus on suggestion changes
- should return artist list based on offers
- should show hit numbers even if nbHits is at 0 but hits are not null
- should reset selected venue in store


 useSearchResults

