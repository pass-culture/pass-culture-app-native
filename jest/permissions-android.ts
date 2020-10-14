import { Permission, PermissionStatus } from 'react-native'

const INITIAL_ANDROID_PERMISSIONS: { [key in Permission]: PermissionStatus } = {
  'android.permission.READ_CALENDAR': 'denied',
  'android.permission.WRITE_CALENDAR': 'denied',
  'android.permission.CAMERA': 'denied',
  'android.permission.READ_CONTACTS': 'denied',
  'android.permission.WRITE_CONTACTS': 'denied',
  'android.permission.GET_ACCOUNTS': 'denied',
  'android.permission.ACCESS_FINE_LOCATION': 'denied',
  'android.permission.ACCESS_COARSE_LOCATION': 'denied',
  'android.permission.RECORD_AUDIO': 'denied',
  'android.permission.READ_PHONE_STATE': 'denied',
  'android.permission.CALL_PHONE': 'denied',
  'android.permission.READ_CALL_LOG': 'denied',
  'android.permission.WRITE_CALL_LOG': 'denied',
  'com.android.voicemail.permission.ADD_VOICEMAIL': 'denied',
  'android.permission.USE_SIP': 'denied',
  'android.permission.PROCESS_OUTGOING_CALLS': 'denied',
  'android.permission.BODY_SENSORS': 'denied',
  'android.permission.SEND_SMS': 'denied',
  'android.permission.RECEIVE_SMS': 'denied',
  'android.permission.READ_SMS': 'denied',
  'android.permission.RECEIVE_WAP_PUSH': 'denied',
  'android.permission.RECEIVE_MMS': 'denied',
  'android.permission.READ_EXTERNAL_STORAGE': 'denied',
  'android.permission.WRITE_EXTERNAL_STORAGE': 'denied',
}

type AllowedPermission = typeof INITIAL_ANDROID_PERMISSIONS

export const getAllowedPermissions = (permissionsToGrant: Permission[]): AllowedPermission => {
  const grantedPermissions: { [key in Permission]?: PermissionStatus } = {}

  permissionsToGrant.forEach((permission) => {
    grantedPermissions[permission] = 'granted'
  })

  return grantedPermissions as AllowedPermission
}
