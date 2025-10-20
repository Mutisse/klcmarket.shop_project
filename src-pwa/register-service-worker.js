import { register } from 'register-service-worker'
import { Notify } from 'quasar'

register(process.env.SERVICE_WORKER_FILE, {
  ready () {
    console.log('⚡ PWA pronto: App carregado do cache.')
  },

  registered () {
    console.log('✅ Service Worker registrado.')
  },

  cached () {
    console.log('📦 Conteúdo em cache para uso offline.')
  },

  updatefound () {
    console.log('📥 Novo conteúdo disponível, baixando...')
  },

  updated () {
    console.log('🔄 Novo conteúdo pronto!')
    window.location.reload()
    // Notify.create({
    //   message: 'Nova versão disponível!',
    //   color: 'blue',
    //   position: 'bottom',
    //   actions: [
    //     {
    //       label: 'Atualizar',
    //       color: 'yellow',
    //       handler: () => window.location.reload()
    //     }
    //   ]
    // })
  },

  offline () {
    console.log('🌐 Sem internet, rodando offline.')
    Notify.create({
      message: 'Sem conexão. App está em modo offline.',
      color: 'orange',
      position: 'bottom'
    })
  },

  error (err) {
    console.error('❌ Erro no Service Worker:', err)
  }
})
