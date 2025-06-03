ThematicSearch
 Search bar
- should navigate to search results with the corresponding parameters


 Subcategory buttons
- should navigate to search results with correct data


 gtl playlists
- should render gtl playlists when offerCategory is `LIVRES`
- should call useGTLPlaylists with env.ALGOLIA_OFFERS_INDEX_NAME_B if FF ENABLE_REPLICA_ALGOLIA_INDEX is on


 book offerCategory
- should render <ThematicSearch />
- should render skeleton when playlists are loading


 gtl playlists
- should not render gtl playlists when offerCategory is not `LIVRES`


 cinema playlists
- should render cinema playlists when offerCategory is `CINEMA`
- should not render cinema playlists when offerCategory is not `CINEMA`


 films playlists
- should render films playlists when offerCategory is `FILMS_DOCUMENTAIRES_SERIES`
- should not render films playlists when offerCategory is not `FILMS_DOCUMENTAIRES_SERIES`


 music playlists
- should render music playlists when offerCategory is `MUSIQUE`
- should not render music playlists when offerCategory is not `MUSIQUE`


 <ThematicSearch/>

