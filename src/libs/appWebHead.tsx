import React from 'react'

import { Helmet } from 'libs/react-helmet/Helmet'

import { author, description } from '../../package.json'

export const AppWebHead = () => (
  <Helmet>
    <html lang="fr-FR" />
    <meta charSet="utf-8" />
    <title>{description}</title>
    <meta name="author" content={author.name} />
  </Helmet>
)
