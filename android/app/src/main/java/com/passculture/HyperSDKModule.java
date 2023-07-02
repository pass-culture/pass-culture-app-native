package com.passculture;
// import static com.passculture.MainActivity.registerCallback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import org.json.JSONArray;
import java.util.Iterator;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import java.io.IOException;
import java.io.InputStream;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.UUID;
import androidx.fragment.app.FragmentActivity;
import android.content.Intent;
import in.juspay.hypersdk.core.PaymentConstants;
import in.juspay.hypersdk.data.JuspayResponseHandler;
import in.juspay.hypersdk.ui.HyperPaymentsCallbackAdapter;
import in.juspay.services.HyperServices;
import java.security.*;
import java.util.HashMap;
import com.passculture.SignatureUtil;
import java.io.InputStreamReader;
import android.view.View;
import android.widget.FrameLayout;
// import com.passculture.MainActivity.BackPress;
import android.app.Activity;



public class HyperSDKModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactContext;
    private HyperServices hyperService;
    private boolean isActivityPassed;
    String pemFilePath = "private_key.pem";
    private boolean isBackPressHandled = false;
    
    
    //  @ReactMethod
    // public void readFileContents(String filePath, Promise promise) {
    //     try {
    //         InputStream inputStream = getCurrentActivity().getAssets().open(filePath);
    //         int size = inputStream.available();
    //         byte[] buffer = new byte[size];
    //         inputStream.read(buffer);
    //         inputStream.close();
    //         String pemContents = new String(buffer, "UTF-8");
    //         promise.resolve(pemContents);
    //     } catch (IOException e) {
    //         promise.reject("READ_FILE_ERROR", "Error reading file: " + e.getMessage());
    //     }
    // }

    private final ActivityEventListener activityEventListener = new BaseActivityEventListener() {
        // ...
      
    
    };

    public HyperSDKModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.reactContext.addActivityEventListener(activityEventListener);
    }


    @Override
    public String getName() {
        return "HyperSDKModule";
    }

    //  @Override
    // public void onBackPressed() {
    //     if (hyperService != null && !hyperService.onBackPressed()) {
    //         onBackPressedDispatcher.onBackPressed();
    //     }
    // }
     
      @ReactMethod
    public void setBackPressHandled(boolean isHandled) {
        isBackPressHandled = isHandled;
    }

    
    @ReactMethod
    public void sendBackPressHandledEvent() {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("backPressHandled", isBackPressHandled);
    }


private WritableMap convertJsonObjectToWritableMap(JSONObject jsonObject) throws JSONException {
    WritableMap writableMap = Arguments.createMap();

    Iterator<String> iterator = jsonObject.keys();
    while (iterator.hasNext()) {
        String key = iterator.next();
        Object value = jsonObject.get(key);

        if (value instanceof JSONObject) {
            writableMap.putMap(key, convertJsonObjectToWritableMap((JSONObject) value));
        } else if (value instanceof JSONArray) {
            writableMap.putArray(key, convertJsonArrayToWritableArray((JSONArray) value));
        } else if (value instanceof String) {
            writableMap.putString(key, (String) value);
        } else if (value instanceof Integer) {
            writableMap.putInt(key, (Integer) value);
        } else if (value instanceof Double) {
            writableMap.putDouble(key, (Double) value);
        } else if (value instanceof Boolean) {
            writableMap.putBoolean(key, (Boolean) value);
        } else {
            writableMap.putNull(key);
        }
    }

    return writableMap;
}

private WritableArray convertJsonArrayToWritableArray(JSONArray jsonArray) throws JSONException {
    WritableArray writableArray = Arguments.createArray();

    for (int i = 0; i < jsonArray.length(); i++) {
        Object value = jsonArray.get(i);

        if (value instanceof JSONObject) {
            writableArray.pushMap(convertJsonObjectToWritableMap((JSONObject) value));
        } else if (value instanceof JSONArray) {
            writableArray.pushArray(convertJsonArrayToWritableArray((JSONArray) value));
        } else if (value instanceof String) {
            writableArray.pushString((String) value);
        } else if (value instanceof Integer) {
            writableArray.pushInt((Integer) value);
        } else if (value instanceof Double) {
            writableArray.pushDouble((Double) value);
        } else if (value instanceof Boolean) {
            writableArray.pushBoolean((Boolean) value);
        } else {
            writableArray.pushNull();
        }
    }

    return writableArray;
}


    @ReactMethod
        public void dynamicSign(String username, String mobileNumber, String mobileCountryCode,  Promise promise) {
          String payloadString = "{\"userName\":\""+username+"\", \"mobileNumber\":\""+mobileNumber+"\",\"mobileCountryCode\":\"+91\",\"merchantId\":\"MOBILITY_PASSCULTURE\",\"timestamp\":\"2023-04-13T07:28:40+00:00\"}";
          try{ 
            JSONObject data = new JSONObject(payloadString);
            System .out.println("JSONObjectPersonnel"+data);
            JSONObject signatureResponse = SignatureUtil.createSignature(data, new InputStreamReader(getCurrentActivity().getAssets().open("private_key.pem")));
            System .out.println("signatureResponse"+signatureResponse);
            WritableMap responseMap = Arguments.createMap();
        Iterator<String> keys = signatureResponse.keys();
        while (keys.hasNext()) {
            String key = keys.next();
            Object value = signatureResponse.get(key);
            if (value instanceof String) {
                responseMap.putString(key, (String) value);
            } else if (value instanceof Integer) {
                responseMap.putInt(key, (int) value);
            } else if (value instanceof Double) {
                responseMap.putDouble(key, (double) value);
            } else if (value instanceof Boolean) {
                responseMap.putBoolean(key, (boolean) value);
            } else if (value instanceof JSONObject) {
                responseMap.putMap(key, convertJsonObjectToWritableMap((JSONObject) value));
            } else if (value instanceof JSONArray) {
                responseMap.putArray(key, convertJsonArrayToWritableArray((JSONArray) value));
            } else {
                responseMap.putNull(key);
            }
        }
            promise.resolve(responseMap);
           }catch(Exception e){
            e.printStackTrace();
            promise.reject(e.getMessage());
            return; 
           }

          
       }


    @ReactMethod
    public void initiateSDK(boolean isActivityPassed, Promise promise) {
        // registerCallback(backPress);
        this.isActivityPassed = isActivityPassed;
        if (isActivityPassed) {
            FragmentActivity currentActivity = (FragmentActivity) getCurrentActivity();
            if (currentActivity != null) {
               
                hyperService = new HyperServices(currentActivity);
                // Initialize HyperSDK using FragmentActivity
                JSONObject initpayload = getInitiatePayload("passcultureconsumer", "passcultureconsumer", "master");
                System.out.println("initpayloadRaj"+initpayload);
                hyperService.initiate(initpayload, new HyperPaymentsCallbackAdapter() {
            @Override
            public void onEvent(JSONObject jsonObject, JuspayResponseHandler juspayResponseHandler) {
                System.out.println("onEvent: " + jsonObject);
                if (jsonObject.optString("event").equals("initiate_result")) {
                    // hyperService.process(getProcessPayload("passcultureconsumer", "passcultureconsumer", "master"));
                    // promise.resolve("Initiate successful");
                    try {
                        
                        String payloadString = "{\"mobileNumber\":\"9493143166\",\"mobileCountryCode\":\"+91\",\"merchantId\":\"MOBILITY_PASSCULTURE\",\"timestamp\":\"2023-04-13T07:28:40+00:00\"}";
                        JSONObject data = new JSONObject(payloadString);
                        JSONObject signatureResponse = SignatureUtil.createSignature(data, new InputStreamReader(getCurrentActivity().getAssets().open("private_key.pem")));
                        System.out.println("signatureResponse"+signatureResponse);
                        //  payload.put("signatureAuthData", signatureResponse.get("signatureAuthData"));
                        // payload.put("signature", signatureResponse.get("signature"));
                        JSONObject payload = getProcessPayload("passcultureconsumer", "passcultureconsumer", "master", signatureResponse);
                       System.out.println("ProcessPayload"+payload);
                        hyperService.process(payload);
                        promise.resolve("Initiate successful");
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        });
            } else {
                // Handle the case when currentActivity is null
            }
        } else {
            // Show React Native screens or perform any other action
        }
    }

   

     public static JSONObject getInitiatePayload(String clientId, String merchantId, String environment) {
        JSONObject innerPayload = new JSONObject();
        JSONObject initiatePayload = new JSONObject();
        try {
            String key = "in.yatri.consumer";
            initiatePayload.put("requestId", UUID.randomUUID());
            initiatePayload.put("service", key);
            innerPayload.put("clientId", clientId);
            innerPayload.put("merchantId", merchantId);
            innerPayload.put("action", "initiate");
            innerPayload.put("service", key);
            innerPayload.put(PaymentConstants.ENV, environment);
            initiatePayload.put(PaymentConstants.PAYLOAD, innerPayload);
            System.out.println("initiatePayloadRAJ: " + initiatePayload.toString());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return initiatePayload;
    }

     public static JSONObject getProcessPayload(String clientId, String merchantId, String environment, JSONObject signatureResponse) {
        JSONObject innerPayload = new JSONObject();
        JSONObject initiatePayload = new JSONObject();
        JSONObject signatureAuthData = new JSONObject();
        // String authData = "{\"mobileNumber\":\"9819xxxx90\",\"mobileCountryCode\":\"+91\",\"merchantId\":\"<MERCHANT_ID>\",\"timestamp\":\"2023-04-13T07:28:40+00:00\"}";
        // String signature = "<SIGNATURE_KEY>";
        try {
            String key = "in.yatri.consumer";
            initiatePayload.put("requestId", UUID.randomUUID());
            initiatePayload.put("service", key);
            innerPayload.put("clientId", clientId);
            innerPayload.put("merchantId", merchantId);
            innerPayload.put("action", "initiate");
            innerPayload.put("service", key);
            innerPayload.put(PaymentConstants.ENV, environment);
            signatureAuthData.put("signature", signatureResponse.get("signature"));
            signatureAuthData.put("authData", signatureResponse.get("signatureAuthData"));
            innerPayload.put("signatureAuthData", signatureAuthData);
            initiatePayload.put(PaymentConstants.PAYLOAD, innerPayload);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return initiatePayload;
    }

   

    //  @ReactMethod
    // public void getFileContents(Promise promise) {
    //     if (pemFilePath != null) {
    //         readFileContents(pemFilePath, promise);
    //     } else {
    //         promise.reject("FILE_PATH_ERROR", "No file path specified");
    //     }
    // }
}
