import CodePush from 'react-native-code-push'

export const getCodePushId = async () => {
  try {
    const metadata = await CodePush.getUpdateMetadata()

    // We want to remove the letter 'v' from the  code push label : 'v4' => '4'
    const codePushLabel = metadata ? metadata.label.slice(1) : ''

    return codePushLabel
  } catch {
    return ''
  }
}
