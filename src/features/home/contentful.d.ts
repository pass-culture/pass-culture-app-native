export interface EntryCollection<T> extends ContentfulCollection<Entry<T>> {
  errors?: Array<EntryCollectionError>
  includes?: EntryCollectionInclusions
}

export interface EntryFields {
  modules: Array<{ sys: EntryTypeLink }>
  title: string
}

interface ContentfulCollection<T> {
  total: number
  skip: number
  limit: number
  items: Array<T>
}

interface Entry<T> {
  sys: Sys
  fields: T
  update(): Promise<Entry<T>>
}

interface Asset {
  sys: Sys
  fields: {
    title: string
    description: string
    file: {
      url: string
      details: {
        size: number
        image?: {
          width: number
          height: number
        }
      }
      fileName: string
      contentType: string
    }
  }
}

interface Sys {
  type: string
  id: string
  createdAt: string
  updatedAt: string
  locale: string
  revision?: number
  space?: {
    sys: SpaceLink
  }
  contentType: {
    sys: ContentTypeLink
  }
}

interface SpaceLink {
  type: 'Link'
  linkType: 'Space'
  id: string
}

interface ContentTypeLink {
  type: 'Link'
  linkType: 'ContentType'
  id: string
}

interface EntryTypeLink {
  type: 'Link'
  linkType: 'Entry'
  id: string
}

interface EntryCollectionError {
  sys: {
    id: string
    type: string
  }
  details: {
    type: string
    linkType: string
    id: string
  }
}

interface EntryCollectionInclusions<T> {
  [string]: Array<Asset | Entry<T>>
}
