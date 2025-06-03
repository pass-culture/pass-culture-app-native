selectHomepageEntry
 remote config entry
- should return not connected home entry when user is logged in but undefined


 underage beneficiary users
- should retrieve the home entry tagged master+userunderage if available
- should retrieve the playlist tagged master and no usergrandpublic if no tag userunderage available
- should retrieve the only playlist tagged master if no tag userunderage available
- should retrieve the first userunderage playlist even if no playlist tagged master
- should retrieve the first playlist if no playlist tagged master or userunderage


 default home entry when no remote config available
- should retrieve the playlist tagged master+usergrandpublic if available
- should retrieve the playlist tagged only master if playlist tagged usergrandpublic does not exist
- should retrieve the playlist tagged usergrandpublic if available and no playlist tagged master
- should retrieve the first playlist if no playlist tagged master or usergrandpublic


 useSelectHomepageEntry
- should not return anything when no homepageEntries retrieved from contentful
- should return home entry corresponding to id provided

