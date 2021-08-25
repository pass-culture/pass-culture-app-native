import React from 'react'

// import { env } from 'libs/environment'
import { Helmet } from 'libs/react-helmet/Helmet'

import { author, description } from '../../package.json'

// Remove the initial <title /> from the index.html as soon as this component is rendered
// Title will now be control with react
const templateDescription = document.querySelector("meta[name='description']")
if (templateDescription) {
  templateDescription.parentElement?.removeChild(templateDescription)
}

export const AppWebHead = () => {
  return (
    <Helmet>
      <html lang="fr-FR" />
      <meta charSet="utf-8" />
      <title>{description}</title>
      <meta name="author" content={author.name} />
      {/* TODO: uncomment after tests // env.ENV !== 'production' && <meta name="robots" content="noindex" /> */}
    </Helmet>
  )
}
