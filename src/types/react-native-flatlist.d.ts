import 'react-native'

declare module 'react-native' {
  import { FlatListProps as RNFlatListProps } from 'react-native'
  interface FlatListProps extends RNFlatListProps {
    /**
     * react-native-web support of Ul>li and Ol>li (See PC-17828)
     */
    listAs?: 'ul' | 'ol' | (() => JSX.Element)
    itemAs?: 'li' | (() => JSX.Element)
  }
}
