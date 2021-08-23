import React from 'react'

interface Metas {
  creator?: string
  title?: string
  site?: string
  summary?: string
  description?: string
  image?: string
}

export const twitterMetas = (metas: Metas) => {
  return Object.entries(metas)
    .map(([name, content]) => ({ name: `twitter:${name}`, content }))
    .map(
      (meta) => !!meta.content && <meta key={meta.name} name={meta.name} content={meta.content} />
    )
    .filter(Boolean)
}
