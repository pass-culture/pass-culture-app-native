import { FlatListProps as RNFlatListProps } from 'react-native'

declare module 'react-native' {
  interface FlatListProps extends RNFlatListProps {
    /**
     * react-native-web support of Ul>li and Ol>li (See PC-17828)
     */
    listAs?: 'ul' | 'ol' | (() => React.JSX.Element)
    itemAs?: 'li' | (() => React.JSX.Element)
  }
}
