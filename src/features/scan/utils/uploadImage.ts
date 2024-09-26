import { Platform } from 'react-native'

export const uploadImage = async <Response>(api: string, path: string) => {
  const fileUri = Platform.OS === 'android' ? `file://${path}` : path

  const formData = new FormData()
  formData.append('image', {
    // @ts-ignore
    uri: fileUri,
    type: 'image/jpeg',
    name: 'qqch_a_declarer.jpg',
  })

  try {
    const uploadResponse = await fetch(api, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })

    const result = await uploadResponse.json()
    return result
  } catch (error) {
    console.error("Erreur lors de l'upload", error)
  }
}
