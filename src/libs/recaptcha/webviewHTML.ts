import { env } from 'libs/environment'

export const reCaptchaWebviewHTML = `
    <!DOCTYPE html>
    <html lang="fr">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title></title>
        <script src="https://www.google.com/recaptcha/api.js?hl={{lang}}" async defer></script>
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
            function onLoad() {
                sendMessagePayload({ "message": "load" });
            }
            function onExpire() {
                sendMessagePayload({ "message": "expire" });
            }
            function onError(error) {
                sendMessagePayload({ "message": "error", error: error, });
            }
            function onSuccess(token) {
                sendMessagePayload({ "message": "success",  token: token, });
            }
    
            function isReady() { 
                return Boolean(typeof window === "object" && window.grecaptcha && window.grecaptcha.render);
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
                    "error-callback": onError,
                }
                widget = window.grecaptcha.render("recaptcha-container", options);
                window.grecaptcha.execute(widget);
                if (onLoad) {
                    onLoad();
                }
                onCloseInterval = setInterval(registerOnCloseListener, 1000);
            }

            function updateReadyState() {
                numberOfRetryRender = numberOfRetryRender + 1;
                if (isReady()) {
                    clearInterval(readyInterval);
                    renderRecaptcha();
                } else if (numberOfRetryRender === 6) {
                    clearInterval(readyInterval);
                    onError("Number of retry render captcha exceeded");
                }
            }
        
            try {
                if (isReady()) {
                    renderRecaptcha();
                } else {
                    readyInterval = setInterval(updateReadyState, 1000);
                }
            } catch(error) {
                onError(error.message);
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
