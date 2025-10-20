<template>
  <div class="flex flex-center">
    <div>
      <h1>Teste Web Push</h1>
      <q-btn label="Enviar Notificação" @click="sendCustomNotification" />
      <div v-if="message">{{ message }}</div>
    </div>
  </div>
</template>

<script>
import apiMethods from "src/router/api.js"; // Verifique o alias utilizado, pode ser @ ou outro configurado no seu projeto Quasar
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
export default {
  data() {
    return {
      message: "",
      subscription: {
        endpoint: "",
        keys: {
          p256dh: "",
          auth: "",
        },
      },
    };
  },
  methods: {
    // // Gera e configura as chaves VAPID
    // setupVAPID() {
    //   const vapidKeys = {
    //     publicKey:
    //       "BO_gl5UJuojostTIdz_eDUVcbyDKKxgng0-QI4Z9wGtbbvIbHdRIG-vDRvmP6xmIfRR5rev0r2jdAGMoi7KB9FA",
    //     privateKey: "pVOQrx37jYkbnyd7dwAJJAfcJG7fFMMlB98DR2A6zvk",
    //   };
    //   webpush.setVapidDetails(
    //     "mailto:example@yourdomain.org",
    //     vapidKeys.publicKey,
    //     vapidKeys.privateKey
    //   );
    //   return vapidKeys;
    // },

    // // Enviar a notificação push
    // async sendNotification() {
    //   try {
    //     const vapidKeys = this.setupVAPID();

    //     // Exemplo de payload da notificação
    //     const payload = JSON.stringify({
    //       title: "Notificação de Teste",
    //       body: "Esta é uma notificação de teste enviada com web-push!",
    //     });

    //     // Substitua este objeto pela assinatura do cliente
    //     const subscription = {
    //       endpoint: "SUBSCRIPTION_ENDPOINT", // Endpoint real da assinatura do cliente
    //       keys: {
    //         p256dh: "CLIENT_PUBLIC_KEY", // Chave pública do cliente
    //         auth: "CLIENT_AUTH_KEY", // Chave de autenticação do cliente
    //       },
    //     };

    //     // Enviar notificação
    //     const response = await webpush.sendNotification(subscription, payload);

    //     this.message = "Notificação enviada com sucesso!";
    //   } catch (error) {
    //     console.error("Erro ao enviar notificação:", error);
    //     this.message = "Falha ao enviar notificação.";
    //   }
    // },

    // Registrar o service worker
    registerServiceWorker() {
      return navigator.serviceWorker
        .register("service-worker.js")
        .then((registration) => {
          // this.subscription.endpoint = registration.endpoint;
          // this.subscription.keys.p256dh = registration.p256dh;
          // this.subscription.keys.auth = registration.auth;
          console.log("Service worker registrado com sucesso.");
        })
        .catch((error) => {
          console.error("Falha ao registrar service worker.", error);
        });
    },

    // Solicitar permissão para notificações
    askForPermission() {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          // Obter o service worker
          navigator.serviceWorker.ready.then((sw) => {
            // Subscribe ao PushManager
            sw.pushManager
              .subscribe({
                userVisibleOnly: true,
                applicationServerKey:
                  "BDtCwvnpMkHbWQ_bBWeC9R4i-N-cytiDiNT9pVKWCr4TUnFH4i9Hjomy87PouzZCVcgJvOc1UuRVyzq6jXF0D0s",
              })
              .then((subscription) => {
                console.log(
                  "Inscrição no PushManager:",
                  JSON.stringify(subscription)
                );
                // this.saveSubscription(subscription);
              });
          });
        }
      });
    },

    // Enviar notificação personalizada
    async sendCustomNotification() {
      try {
        this.registerServiceWorker();
        this.askForPermission();
        // Certifique-se que o service worker está pronto
        const registration = await navigator.serviceWorker.ready;

        // Verifique se o usuário deu permissão para notificações
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          this.askForPermission();
          throw new Error("Permissão para notificações não foi concedida.");
        }

        // Cancelar inscrição existente, se houver
        const existingSubscription =
          await registration.pushManager.getSubscription();
        if (existingSubscription) {
          await existingSubscription.unsubscribe();
          console.log("Assinatura anterior cancelada.");
        }
        const publicKey =
          "BMvL8Dz5pjh8Gn4VyFgSeqIp9qQ5456kdmwEr-EbL0tfyd4ARJrjAD--LC7QMdbdL6BOqfRx24C37DdbFrG4yYM";
        const applicationServerKey = urlBase64ToUint8Array(publicKey);
        // console.log(applicationServerKey); // Verifique se isso retorna um Uint8Array válido
        // Criar nova assinatura
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey,
        });

        console.log("Nova assinatura criada:", subscription);

        const payload = {
          subscription: subscription, // Envia a nova assinatura para o backend
          title: "Mensagem de Teste",
          body: "Corpo da mensagem de teste",
        };

        // Envie a assinatura para o backend
        const response = await apiMethods.sendCustomNotification(payload);
        console.log("Notificação enviada com sucesso:", response.data);
      } catch (error) {
        console.error(
          "Erro ao enviar notificação personalizada:",
          error.response
        );
      }
    },
  },

  mounted() {
this.sendCustomNotification()
  },
};
</script>
<!-- =======================================

Public Key:
BFANLydKFG2MjIA8hAyHlcjtcWA7uuE_ds2U-7ov3qJSST_qc8bTSro_kPS0KW_cvzCGvFtTL5kOyrK8s6aa-N0

Private Key:
wBbovXSBkpZEivDf-zsLJ5vf62bwKcK8Eruxd5QXjoI

======================================= -->

Public Key:
BOyaUzZGXkO437axI4flC4RLN5yFcYiDW0ysyYmJlFjW8D-8BT7jJOnYU9Iena6igHKxl8w6Nbk4XAbfJMTmzqI

Private Key:
g9OGQFhXK_hBaHjWVezhaGznt1K_5ioncVt_G-3Agv8

======================================= -->
