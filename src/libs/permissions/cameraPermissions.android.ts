import { PermissionsAndroid } from 'react-native'

export async function requestCameraPermission(): Promise<boolean> {
  const cameraPermission = PermissionsAndroid.PERMISSIONS.CAMERA
  if (!cameraPermission) return false

  const granted = await PermissionsAndroid.request(cameraPermission, {
    title: 'Permission d’accès à la caméra',
    message: 'Cette application a besoin d’accéder à votre caméra pour vérifier votre identité.',
    buttonNeutral: 'Demander plus tard',
    buttonNegative: 'Refuser',
    buttonPositive: 'Accepter',
  })
  return granted === PermissionsAndroid.RESULTS.GRANTED
}

export async function checkCameraPermission(): Promise<boolean> {
  const cameraPermission = PermissionsAndroid.PERMISSIONS.CAMERA
  if (!cameraPermission) return false

  const granted = await PermissionsAndroid.check(cameraPermission)
  return granted
}
