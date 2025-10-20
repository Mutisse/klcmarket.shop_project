Se quiser mais controle, cria um arquivo boot.

Crie src/boot/gtag.js:

export default ({ router }) => {
  // Carrega o script do GA dinamicamente
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-CCWENBRM2X";
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", "G-CCWENBRM2X");

  // Rastrear mudanças de rota
  router.afterEach((to) => {
    gtag("config", "G-CCWENBRM2X", { page_path: to.fullPath });
  });
};


Adicione no quasar.conf.js (ou quasar.config.js, depende da versão):

boot: [
  'gtag'
],


👉 Assim, além de inicializar, o Google Analytics rastreia automaticamente as páginas do Vue Router.


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAB2ZzClhpz2DVX6250iavvYP1lWFgUoQY",
  authDomain: "klc-market.firebaseapp.com",
  projectId: "klc-market",
  storageBucket: "klc-market.firebasestorage.app",
  messagingSenderId: "404873955631",
  appId: "1:404873955631:web:1800ea0530045e4836b9da",
  measurementId: "G-J2CB033NKF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
