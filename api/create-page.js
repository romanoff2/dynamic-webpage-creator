const { createClient } = require('@vercel/edge-config');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    console.log('Request body:', req.body); // Log request body

    const { assistant_id } = req.body || {}; // Provide a fallback to prevent errors

    if (!assistant_id) {
      return res.status(400).json({ error: 'assistant_id is required' });
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dynamic Vapi Page</title>
      </head>
      <body>
        <script>
          var vapiInstance = null;
          const assistant = "${assistant_id}"; // Dynamically inserted assistant ID
          const apiKey = "bfcb73bf-7024-4f06-bc95-198564669210";
          const buttonConfig = {};
          (function (d, t) {
            var g = document.createElement(t),
                s = d.getElementsByTagName(t)[0];
            g.src = "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
            g.defer = true;
            g.async = true;
            s.parentNode.insertBefore(g, s);
            g.onload = function () {
              vapiInstance = window.vapiSDK.run({
                apiKey: apiKey, // mandatory
                assistant: assistant, // mandatory
                config: buttonConfig, // optional
              });
            };
          })(document, "script");
        </script>
      </body>
      </html>
    `;

    // Generate a unique identifier for the page
    const pageId = Date.now().toString(36) + Math.random().toString(36).substr(2);

    // Store the HTML content in Edge Config
    const client = createClient(process.env.EDGE_CONFIG);
    await client.set(`page:${pageId}`, htmlContent);

    const pageUrl = `https://${process.env.VERCEL_URL}/pages/${pageId}`;

    return res.status(200).json({ url: pageUrl });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
};
