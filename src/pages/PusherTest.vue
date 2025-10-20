<template>
  <div>
    <p>Última mensagem: {{ message }}</p>
  </div>
</template>

<script>
import Echo from "laravel-echo";

import Pusher from "pusher-js";
window.Pusher = Pusher;

export default {
  data() {
    return {
      message: "",
    };
  },
  mounted() {
    // Configurar o Pusher
    // window.Echo = new Echo({
    //   broadcaster: "pusher",
    //   key: "ad8e57aafc015265f061",
    //   cluster: "ap2",
    //   forceTLS: true,
    // });
//     window.Echo = new Echo({
//     broadcaster: 'reverb',
//     key: import.meta.env.VITE_REVERB_APP_KEY,
//     wsHost: import.meta.env.VITE_REVERB_HOST,
//     wsPort: import.meta.env.VITE_REVERB_PORT,
//     wssPort: import.meta.env.VITE_REVERB_PORT,
//     forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
//     enabledTransports: ['ws', 'wss'],
// });
    // const pusher = new Pusher("ad8e57aafc015265f061", {
    //   cluster: "ap2",
    //   forceTLS: false, // Use `true` para HTTPS (recomendado em produção)
    //   wsHost: window.location.hostname, // Host WebSocket para ambientes locais
    //   wsPort: 6001, // Porta WebSocket do Laravel Echo Server (se configurado)
    //   wssPort: 6001, // Porta segura para WebSocket
    //   enabledTransports: ["ws", "wss"], // Habilitar WebSockets
    // });

    const pusher = new Pusher("ad8e57aafc015265f061", {
      cluster: "ap2",
      forceTLS: false
    });
    // Inscrever-se no canal
    const channel = pusher.subscribe("my-channel");

    // // Ouvir eventos
    channel.bind("my-event", (data) => {
      console.log("Nova mensagem recebida:", data);
      this.message = data.message;
    });
  },
};
</script>
