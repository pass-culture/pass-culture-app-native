package com.passculture

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate //@react-navigation
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import android.content.Intent
import android.content.res.Configuration
import com.batch.android.Batch
import org.wonday.orientation.OrientationActivityLifecycle

class MainActivity : ReactActivity() {
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    override fun getMainComponentName() : String = "PassCulture"

    // react-native-orientation-locker
    override fun onCreate(savedInstanceState: Bundle?) {
        application.registerActivityLifecycleCallbacks(OrientationActivityLifecycle.getInstance())
        super.onCreate(null)
    }

    // @batch.com/react-native-plugin (https://doc.batch.com/react-native/sdk-integration#configure-onnewintent)
    override fun onNewIntent(intent: Intent?) {
        intent?.let { 
            Batch.onNewIntent(this, it) 
        }
        setIntent(intent)
    }

    /**
    * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
    * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
    */
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
    
    // react-native-orientation-locker
    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        val intent = Intent("onConfigurationChanged")
        intent.putExtra("newConfig", newConfig)
        sendBroadcast(intent)
    }
}