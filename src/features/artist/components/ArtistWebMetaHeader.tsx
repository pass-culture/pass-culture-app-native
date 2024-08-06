import React from 'react'

import { Helmet } from 'libs/react-helmet/Helmet'

type Props = {
  artist: string
}

export const ArtistWebMetaHeader = ({ artist }: Props) => (
  <Helmet>
    <title>{artist + ' | pass Culture'}</title>
    <meta name="title" content={artist} />
    <meta name="description" content={artist} />
  </Helmet>
)
