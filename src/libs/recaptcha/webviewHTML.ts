import { env } from 'libs/environment'

export const reCaptchaWebviewHTML = `
    <!DOCTYPE html>
    <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ReCAPTCHA web view</title>
            <script>
                let numberOfRetryRender = 0;
                let readyInterval;
                let onCloseInterval;
                let widget;
                let onCloseObserver;
                
                function sendMessagePayload(payload) {
                    window.ReactNativeWebView.postMessage(JSON.stringify(payload));
                }
                function onClose() {
                    sendMessagePayload({ "message": "close" });
                }
                function onDebug(log) {
                    sendMessagePayload({ "message": "debug", "log": log });
                }
                function onLoad() {
                    sendMessagePayload({ "message": "load" });
                }
                function onExpire() {
                    sendMessagePayload({ "message": "expire" });
                }
                function onError(error) {
                    sendMessagePayload({ "message": "error", "error": error });
                }
                function onSuccess(token) {
                    window.grecaptcha.reset()
                    sendMessagePayload({ "message": "success", "token": token });
                }
        
                function registerOnCloseListener() {
                    if (onCloseObserver) {
                        onCloseObserver.disconnect();
                    }
        
                    const iframes = document.getElementsByTagName("iframe");
        
                    const recaptchaFrame = Array.prototype.find
                        .call(iframes, e => e.src.includes("google.com/recaptcha/api2/bframe"));
                    const recaptchaElement = recaptchaFrame.parentNode.parentNode;
        
                    clearInterval(onCloseInterval);
        
                    let lastOpacity = recaptchaElement.style.opacity;
                    onCloseObserver = new MutationObserver(mutations => {
                        if (lastOpacity !== recaptchaElement.style.opacity
                            && recaptchaElement.style.opacity == 0) {
                            onClose();
                        }
                        lastOpacity = recaptchaElement.style.opacity;
                    });
                    onCloseObserver.observe(recaptchaElement, {
                        attributes: true,
                        attributeFilter: ["style"],
                    });
                }
        
                function renderRecaptcha() {
                    const options = {
                        sitekey: "${env.SITE_KEY}",
                        size: "invisible",
                        theme: "light",
                        callback: onSuccess,
                        "expired-callback": onExpire,
                        "error-callback": function() {
                            onError("reCAPTCHA error : error-callback of widget called")
                        },
                    }
                    window.grecaptcha.render("recaptcha-container", options);
                    window.grecaptcha.execute();
                    if (onLoad) {
                        onLoad();
                    }
                    onCloseInterval = setInterval(registerOnCloseListener, 1000);
                }

                function isReCaptchaScriptReady() { 
                    return Boolean(typeof window === "object" && window.grecaptcha && window.grecaptcha.render);
                }

                function renderReCaptchaWhenReady() {
                    numberOfRetryRender = numberOfRetryRender + 1;
                    if (isReCaptchaScriptReady()) {
                        clearInterval(readyInterval);
                        renderRecaptcha();
                        return;
                    } 
                    if (numberOfRetryRender === 4) {
                        addReCaptchaScript()
                    }
                    if (numberOfRetryRender > 10) {
                        clearInterval(readyInterval);
                        onError("reCAPTCHA error : Number of retry render exceeded");
                    }
                }

                function addReCaptchaScript() {
                    const head = document.getElementsByTagName('head')[0];
                    const script = document.createElement('script');
                    script.src = "https://www.google.com/recaptcha/api.js?hl=fr" 
                    script.async = true
                    script.defer = true
                    head.appendChild(script);
                }

                addReCaptchaScript() 
                try {
                    if (isReCaptchaScriptReady()) {
                        renderRecaptcha();
                    } else {
                        readyInterval = setInterval(renderReCaptchaWhenReady, 1000);
                    }
                } catch(error) {
                    onError("reCAPTCHA error : " + error.message);
                }
            </script>
        
            <style>
                html,
                body,
                .container {
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
                <span id="recaptcha-container"></span>
            </div>
        </body>
    </html>`
