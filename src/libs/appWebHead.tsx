import React from 'react'

import { Helmet } from 'libs/react-helmet/Helmet'

import { description } from '../../package.json'

// Remove the initial <title /> from the index.html as soon as this component is rendered
// Title will now be control with react
const templateDescription = document.querySelector("meta[name='description']")
if (templateDescription) {
  templateDescription.parentElement?.removeChild(templateDescription)
}

export const AppWebHead = () => {
  return (
    <Helmet>
      <title>{description}</title>
    </Helmet>
  )
}
