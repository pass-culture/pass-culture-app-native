requestGeolocPermission.web
 requestGeolocPermission()
- should return GRANTED if web permission is "granted"
- should return NEVER_ASK_AGAIN if web permission is "denied"
- should return NEED_ASK_POSITION_DIRECTLY if web permission is "prompt" and getCurrentPosition() executes its successCallback
- should return NEED_ASK_POSITION_DIRECTLY if navigator.permissions is undefined and getCurrentPosition() executes its successCallback
- should return NEED_ASK_POSITION_DIRECTLY if web permission is "prompt" and getCurrentPosition() executes its errorCallback
- should return NEED_ASK_POSITION_DIRECTLY if navigator.permissions is undefined and getCurrentPosition() executes its errorCallback

