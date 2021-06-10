// ProfilingModule.java

package com.reactlibrary;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.threatmetrix.TrustDefender.TMXConfig;
import com.threatmetrix.TrustDefender.TMXEndNotifier;
import com.threatmetrix.TrustDefender.TMXProfiling;
import com.threatmetrix.TrustDefender.TMXProfilingHandle;
import com.threatmetrix.TrustDefender.TMXProfilingOptions;
import com.threatmetrix.TrustDefender.TMXStatusCode;
import com.threatmetrix.TrustDefender.TMXProfilingConnections.TMXProfilingConnections;
import java.util.ArrayList;
import java.util.concurrent.TimeUnit;
import java.util.List;

public class ProfilingModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public ProfilingModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "Profiling";
    }

    @ReactMethod
    public void profileDevice(String orgId, String fpServer, final Callback callback) {
        TMXProfilingConnections tmxConn = new TMXProfilingConnections();
        tmxConn.setConnectionTimeout(30, TimeUnit.SECONDS);
        tmxConn.setRetryTimes(2);
        TMXConfig tmxConfig = new TMXConfig();
        tmxConfig.setContext(this.reactContext)
            .setOrgId(orgId)
            .setFPServer(fpServer)
            .setProfilingConnections(tmxConn)
            .setProfileTimeout(30, TimeUnit.SECONDS);

        List<String> m_customMobileList = new ArrayList<String>();
        m_customMobileList.add("React Native TMX libs 6.0");
        TMXProfiling.getInstance().init(tmxConfig);
        TMXProfiling.getInstance().profile((new TMXProfilingOptions()).setCustomAttributes(m_customMobileList), ( new TMXEndNotifier() {
            @Override
            public void complete(TMXProfilingHandle.Result result) {
                System.out.println("Profiling Status: " +result.getStatus() + "  session_id: "+ result.getSessionID());
                callback.invoke(result.getSessionID());
            }
        }));
    }
}
