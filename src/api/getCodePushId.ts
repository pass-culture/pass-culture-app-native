import CodePush from 'react-native-code-push'

// Exported for tests only
export const metadataRef = { hasFetchedMetadata: false }
let codePushLabel = ''

export const getCodePushId = async () => {
  try {
    if (!metadataRef.hasFetchedMetadata) {
      const metadata = await CodePush.getUpdateMetadata()
      metadataRef.hasFetchedMetadata = true

      // We want to remove the letter 'v' from the  code push label : 'v4' => '4'
      codePushLabel = metadata ? metadata.label.slice(1) : ''
      return codePushLabel
    }

    return codePushLabel
  } catch {
    return ''
  }
}
