import React from 'react'

interface Metas {
  site_name?: string
  locale?: string
  url?: string
  title?: string
  type?: string
  description?: string
  image?: string
  [`image:secure_url`]?: string
  [`image:width`]?: string
  [`image:height`]?: string
  [`image:type`]?: string
  [`image:alt`]?: string
  video?: string
  [`video:url`]?: string
  [`video:secure_url`]?: string
  [`video:type`]?: string
  [`video:width`]?: string
  [`video:height`]?: string
  // when og:type='article', those can be used without "og:" prefix
  ['article:published_time']?: string
  ['article:section']?: string
  ['article:author']?: string
  ['article:tag']?: string
}

export const openGraphMetas = ({
  'article:published_time': articlePublishedTime,
  'article:section': articleSection,
  'article:author': articleAuthor,
  'article:tag': articleTag,
  ...metas
}: Metas) => {
  return [
    ...Object.entries(metas).map(([property, content]) => ({
      property: `og:${property}`,
      content,
    })),
    {
      property: 'article:published_time',
      content: articlePublishedTime,
    },
    { property: 'article:section', content: articleSection },
    { property: 'article:author', content: articleAuthor },
    { property: 'article:tag', content: articleTag },
  ]
    .map(
      (meta) =>
        !!meta.content && (
          <meta key={meta.property} property={meta.property} content={meta.content} />
        )
    )
    .filter(Boolean)
}
