// import Echo from "laravel-echo"
// window.Pusher = require('pusher-js')
// Pusher.logToConsole = false

// const echo = new Echo({
//     broadcaster: 'pusher',
//     key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY, // Use environment variables in Next.js for keys
//     wsHost: process.env.NEXT_PUBLIC_WS_HOST,
//     wsPort: parseInt(process.env.NEXT_PUBLIC_WS_PORT, 10),
//     wssPort: parseInt(process.env.NEXT_PUBLIC_WSS_PORT, 10),
//     disableStats: true,
//     encrypted: true,
//     enabledTransports: ['ws', 'wss'], // Use WebSocket and Secure WebSocket
//     // Add other configuration as needed
// })

// export default echo

let echo;
async function initializeEcho() {
  if (typeof window !== 'undefined') {
    const { default: Echo } = await import('laravel-echo');
    window.Pusher = require('pusher-js');

    echo = new Echo({
      broadcaster: 'pusher',
      key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY, // Use environment variables in Next.js for keys
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      wsHost: process.env.NEXT_PUBLIC_WS_HOST,
      wsPort: parseInt(process.env.NEXT_PUBLIC_WS_PORT, 10),
      wssPort: parseInt(process.env.NEXT_PUBLIC_WSS_PORT, 10),
      disableStats: true,
      encrypted: true,
      enabledTransports: ['ws', 'wss'] // Use WebSocket and Secure WebSocket
      // Add other configuration as needed
    });
  }
}

if (typeof window !== 'undefined') {
  initializeEcho();
}

export { echo, initializeEcho };
