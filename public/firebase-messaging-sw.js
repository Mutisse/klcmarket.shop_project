/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js')

// Configurações do Firebase (mesmo do app)
firebase.initializeApp({
  apiKey: "AIzaSyAB2ZzClhpz2DVX6250iavvYP1lWFgUoQY",
  authDomain: "klc-market.firebaseapp.com",
  projectId: "klc-market",
  storageBucket: "klc-market.firebasestorage.app",
  messagingSenderId: "404873955631",
  appId: "1:404873955631:web:1800ea0530045e4836b9da",
  measurementId: "G-J2CB033NKF"
})

// Instancia o messaging
const messaging = firebase.messaging()

// Listener para notificações em segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Recebeu background message:', payload)

  const notificationTitle = payload.notification?.title || 'Nova Notificação'
  const notificationOptions = {
    body: payload.notification?.body || 'Você recebeu uma mensagem.',
    icon: '/icons/icon-192x192.png'
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
