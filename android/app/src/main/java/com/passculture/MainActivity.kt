package com.passculture;

import android.os.Bundle; // react-native-splash-screen
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen; // react-native-lottie-splash-screen
import com.facebook.react.ReactActivityDelegate; //@react-navigation
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import android.content.Intent;
import com.batch.android.Batch;

class MainActivity : ReactActivity() {    
    
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */

    override fun getMainComponentName(): String = "PassCulture"

    // react-native-lottie-splash-screen
    override fun onCreate(savedInstanceState: Bundle?) {
        LottieSplashScreen.show(this, R.id.lottie)
        LottieSplashScreen.setAnimationFinished(true) // Nous voulons forcer la fermeture du dialogue d'animation lorsque hide est appelé, donc nous utilisons ceci
        super.onCreate(null) // Correctif connu pour react-native-screens : https://github.com/software-mansion/react-native-screens#android
    }

    // @batch.com/react-native-plugin (https://doc.batch.com/react-native/sdk-integration#configure-onnewintent)
    override fun onNewIntent(intent: Intent) {
        Batch.onNewIntent(this, intent)
        super.onNewIntent(intent)
    }

    /**
    * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
    * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
    */
 
    override fun createReactActivityDelegate(): ReactActivityDelegate =
    DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
