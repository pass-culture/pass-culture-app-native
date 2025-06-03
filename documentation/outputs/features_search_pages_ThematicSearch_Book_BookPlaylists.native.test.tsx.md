BookPlaylists
 BookPlaylists
- should render gtl playlists when algolia returns offers
- should render skeleton when playlists are still loading
- should not render gtl playlists when algolia does not return offers
- should call useGTLPlaylists with env.ALGOLIA_OFFERS_INDEX_NAME if FF is disabled
- should call useGTLPlaylists with env.ALGOLIA_OFFERS_INDEX_NAME_B if FF is enabled

