import { env } from 'libs/environment/env'
import { ReCaptchaInternalError } from 'libs/recaptcha/errors'

export const reCaptchaWebviewHTML = `
    <!DOCTYPE html>
    <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ReCAPTCHA web view</title>
            <script>
                let numberOfRetryRender = 0;
                const userAgent = navigator.userAgent.toLowerCase();
                const ios = /iphone|ipod|ipad/.test(userAgent);
                const isOnline = ios\u00a0? navigator.onLine\u00a0: navigator.connection?.type\u00a0!== "none";

                function sendMessagePayload(payload) { window.ReactNativeWebView.postMessage(JSON.stringify(payload)); }
                function onClose() { sendMessagePayload({ "message": "close" }); }
                function onDebug(log) { sendMessagePayload({ "message": "debug", "log": log }); }
                function onExpire() { sendMessagePayload({ "message": "expire" }); }
                function onError(errorCode, error) { sendMessagePayload({ "message": "error", "errorCode": errorCode, "error": error }); }
                function onLoad() { sendMessagePayload({ "message": "load" }); }
                function onSuccess(token) {
                    window.grecaptcha.reset()
                    sendMessagePayload({ "message": "success", "token": token });
                }

                function onRecaptchaErrorCallback() {
                    onError("${ReCaptchaInternalError.NetworkError}")
                }

                function isReadyToExecute() { 
                    return Boolean(window.grecaptcha && window.grecaptcha.execute);
                }

                function executeWhenReady() {
                    numberOfRetryRender = numberOfRetryRender + 1;
                    if (isReadyToExecute()) {
                        clearInterval(readyInterval);
                        window.grecaptcha.execute();
                        return;
                    } 
                    if (numberOfRetryRender > 15) {
                        clearInterval(readyInterval);
                        if (isOnline) {
                            onError("${ReCaptchaInternalError.NumberOfRenderRetriesExceeded}");
                        } else {
                            onError("${ReCaptchaInternalError.NetworkError}");
                        }
                    }
                }

                window.onload = function(event) {
                    try {
                        if (isReadyToExecute()) {
                            window.grecaptcha.execute();
                        } else {
                            readyInterval = setInterval(executeWhenReady, 1000);
                        }
                    } catch(error) {
                        onError("${ReCaptchaInternalError.UnknownError}", error);
                    }
                };
            </script>
            <script src="https://www.google.com/recaptcha/api.js?hl=fr" async defer></script>
            <style>
                html, body, .container {
                    height: 100%;
                    width: 100%;
                    margin: 0;
                    padding: 0;
                    background-color: transparent;
                }
                .container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            </style>
        </head>
        
        <body>
            <div class="container">
                <div class="g-recaptcha"
                     data-sitekey="${env.SITE_PUBLIC_KEY}"
                     data-callback="onSuccess"
                     data-expired-callback="onExpire"
                     data-error-callback="onRecaptchaErrorCallback"
                     data-size="invisible"
                     data-theme="light">
                </div>
            </div>
        </body>
    </html>`
