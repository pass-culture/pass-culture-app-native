import { Platform } from 'react-native'

// https://stackoverflow.com/a/29696509
export const isSafariMobile = () => {
    if (Platform.OS !== 'web') {
        return false
    }
    const ua = globalThis.window.navigator.userAgent
    const iOS = !!ua.match(/iP(ad|hone)/i)
    const webkit = !!ua.match(/WebKit/i)
    const iOSSafari = iOS && webkit && !ua.match(/CriOS/i) && !ua.match(/OPiOS/i)
    return iOSSafari
}