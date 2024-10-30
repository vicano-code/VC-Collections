import ngrok from 'ngrok';

(async function () {
  try {
    const url = await ngrok.connect({
      proto: 'http',
      addr: process.env.PORT || 10000, // Render app's port
      authtoken: process.env.NGROK_AUTH_TOKEN, // ngrok auth token
      region: 'us',
    });
    console.log(`ngrok tunnel established at: ${url}`);
  } catch (err) {
    console.error('Error starting ngrok:', err);
  }
})();
