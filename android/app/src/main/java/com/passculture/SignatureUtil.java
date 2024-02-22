package com.passculture;
import org.json.JSONObject;

import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.PrivateKey;
import java.security.Security;
import java.security.Signature;
import java.security.interfaces.RSAPrivateKey;
import java.util.Base64;
import java.util.HashMap;
import java.io.InputStreamReader;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.openssl.PEMKeyPair;
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;

public class SignatureUtil {
    public static JSONObject createSignature(JSONObject payload, InputStreamReader privatekeyPath) {
        System.out.println("calling createSignature");
        try {
            PrivateKey privateKey = readPrivateKeyFromFile(privatekeyPath);
            System.out.println("privateKey"+privateKey);
            System.out.println("signpayload"+payload);
            Signature privateSignature = Signature.getInstance("SHA256withRSA");
            String[] requiredFields = {"mobileNumber", "mobileCountryCode", "merchantId", "timestamp"};
            for (String key : requiredFields) {
                if (!payload.has(key)) {
                    throw new Exception(key + " not found in payload");
                }
            }
            String signatureAuthData = payload.toString();
            privateSignature.initSign(privateKey);
            privateSignature.update(signatureAuthData.getBytes(StandardCharsets.UTF_8));
            byte[] signature = privateSignature.sign();
            String encodedSignature = Base64.getEncoder().encodeToString(signature);
            JSONObject response = new JSONObject();
            response.put("signature", encodedSignature);
            response.put("signatureAuthData", signatureAuthData);
            return response;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new JSONObject();
    }

    private static PrivateKey readPrivateKeyFromFile(InputStreamReader privatekeyPath) throws IOException {
        Security.addProvider(new BouncyCastleProvider());
        PEMParser pemParser = new PEMParser(privatekeyPath);
        JcaPEMKeyConverter converter = new JcaPEMKeyConverter();
        PEMKeyPair pemKeyPair = (PEMKeyPair) pemParser.readObject();
        return converter.getPrivateKey(pemKeyPair.getPrivateKeyInfo());
    }
}
