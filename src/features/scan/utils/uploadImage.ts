import { Platform } from 'react-native'

export const uploadImage = async <Response>(api: string, path: string) => {
  const fileUri = Platform.OS === 'android' ? `file://${path}` : path

  const response = await fetch(fileUri)
  const blob = await response.blob()

  const formData = new FormData()
  formData.append('file', blob, 'jpg')

  try {
    const uploadResponse = await fetch(api, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })

    const result = await uploadResponse.json()
    console.log("Réponse de l'API", result)
    return result
  } catch (error) {
    console.error("Erreur lors de l'upload", error)
  }
}
