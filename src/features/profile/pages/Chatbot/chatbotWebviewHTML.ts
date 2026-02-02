export const chatbotWebviewHTML = `
  <!DOCTYPE html>
  <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Chatbot</title>
      <style>
        * {
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
          outline: none !important;
        }
        
        html, body {
          height: 100vh !important;
          width: 100vw !important;
          overflow: hidden !important;
        }

        #genii-widget-container,
        #lightchat-container,
        .chatbot-wrapper_genii,
        #genii-iframe-core {
          height: 100% !important;
          width: 100% !important;
        }
      
      </style>
    </head>
    <body>
      <script
        type="module"
        project-id="6811b250-212c-4365-8c46-20cc3082d042"
        template="fullscreen"
        src="https://genii-script.tolk.ai/lightchat.js"
        id="lightchat-bot">
      </script>

    </body>
  </html>
`
