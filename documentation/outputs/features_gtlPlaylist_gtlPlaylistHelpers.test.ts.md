gtlPlaylistHelpers
 getContentfulLabelByVenueType
- should return the correct contentful label for a venue type
- should return undefined when venue type is null or undefined


 filterByContentfulLabel
- should filter playlist config by the given label
- should return empty array when no playlist matches the label


 getLabelFilter
- should return searchGroupLabel when provided
- should return venue type label when searchGroupLabel not provided
- should return undefined when both parameters are undefined


 filterGtlPlaylistConfigByLabel
- should filter config by venueType when searchGroupLabel is not provided
- should filter config by searchGroupLabel when provided
- should return the entire playlist config when no label filter can be determined


 getGtlPlaylistsParams
- should return adapted params with venue information when venue is provided
- should return adapted params without venue information when venue is undefined


 gtlPlaylist helpers functions

