import React from 'react'

import { OfferResponse } from 'api/gen'
import { Helmet } from 'libs/react-helmet/Helmet'
// import { openGraphMetas } from 'libs/react-helmet/metas/openGraphMetas'
// import { twitterMetas } from 'libs/react-helmet/metas/twitterMetas'

import { description } from '../../../../../package.json'

interface Props {
  offer: OfferResponse
}

export const OfferWebHead = ({ offer }: Props) => (
  <Helmet>
    <title>{offer.name}</title>
    <meta name="title" content={offer.name} />
    <meta name="description" content={offer.description || description} />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@nytimesbits" />
    <meta name="twitter:creator" content="@nickbilton" />
    <meta
      property="og:url"
      content="http://bits.blogs.nytimes.com/2011/12/08/a-twitter-for-my-sister/"
    />
    <meta property="og:title" content="A Twitter for My Sister" />
    <meta
      property="og:description"
      content="In the early days, Twitter grew so quickly that it was almost impossible to add new features because engineers spent their time trying to keep the rocket ship from stalling."
    />
    <meta
      property="og:image"
      content="http://graphics8.nytimes.com/images/2011/12/08/technology/bits-newtwitter/bits-newtwitter-tmagArticle.jpg"
    />
    {/*{twitterMetas({*/}
    {/*  description: offer.description || description,*/}
    {/*  summary: offer.description || description,*/}
    {/*  title: offer.name,*/}
    {/*  image: offer.image?.url,*/}
    {/*})}*/}
    {/*{openGraphMetas({*/}
    {/*  url: window.location.href,*/}
    {/*  locale: 'fr-FR',*/}
    {/*  description: offer.description || description,*/}
    {/*  title: offer.name,*/}
    {/*  image: offer.image?.url,*/}
    {/*  'image:secure_url': offer.image?.url,*/}
    {/*  type: 'article',*/}
    {/*  ...(offer.category.name ? { ['article:section']: offer.category.name } : {}),*/}
    {/*})}*/}
  </Helmet>
)
