keychain
 saveRefreshToken()
- should call setGenericPassword from Keychain
- should throws if access token is undefined
- should throw when setGenericPassword throws


 getRefreshToken()
- should call getGenericPassword from Keychain
- should return false when no credentials are found
- should throw when getGenericPassword throws


 keychain

