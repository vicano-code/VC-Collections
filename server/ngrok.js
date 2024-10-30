import ngrok from 'ngrok';

(async function () {
  try {
    const url = await ngrok.connect({
      proto: 'http', // or https if your app is secure
      addr: process.env.PORT || 5000, // your Render app's port
      authtoken: process.env.NGROK_AUTH_TOKEN, // your ngrok auth token
      region: 'us',
    });
    console.log(`ngrok tunnel established at: ${url}`);
  } catch (err) {
    console.error('Error starting ngrok:', err);
  }
})();
