import { useNavigation } from '@react-navigation/native'
import React, { useLayoutEffect } from 'react'

import { Helmet } from 'libs/react-helmet/Helmet'

import { description as defaultDescription } from '../../../package.json'

interface Props {
  title: string
  description?: string | null
  noIndex?: boolean
}

export const WebMetaHeader = ({ title, description, noIndex = false }: Props) => {
  const navigation = useNavigation()

  useLayoutEffect(() => {
    if (!title) return
    navigation.setOptions({ title })
  }, [navigation, title])

  return (
    <Helmet>
      <meta name="title" content={title} />
      <meta name="description" content={description || defaultDescription} />
      {noIndex ? <meta name="robots" content="noindex" /> : null}
    </Helmet>
  )
}
