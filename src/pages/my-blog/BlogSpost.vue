<template>
  <q-layout>
    <div class="bg-grey-2">
      <HeaderBlog />


    <q-page-container>
      <q-page class="q-pa-md">
        <!-- Hero Section -->
        <div class="hero-section bg-gradient q-pa-lg text-white rounded-borders">
          <h1 class="text-h3">Suas Vendas Estão Caindo?</h1>
          <p class="text-subtitle1">Isso pode ter explicação! Aprenda com o KLC Market a configurar, vender e crescer com tutoriais práticos.</p>
          <q-btn color="white" text-color="blue-9" label="Veja Como Resolver" to="/tutorials" class="q-mt-md" />
          <div class="row q-mt-md">
            <q-card flat class="bg-white text-blue-9 q-ma-sm" style="width: 200px;">
              <q-card-section>
                <div>Cadastre-se</div>
                <div class="text-h6">Grátis</div>
              </q-card-section>
            </q-card>
            <q-card flat class="bg-white text-blue-9 q-ma-sm" style="width: 300px;">
              <q-card-section>
                <div>Pagamentos</div>
                <div class="text-h6">M-Pesa & Cash on Delivery</div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Trusted By Section -->
        <div class="text-center q-mt-lg">
          <h5>Confiança de Mais de 10,000 Vendedores</h5>
          <div class="row justify-center q-mt-md">
            <q-icon name="whatsapp" size="2rem" class="q-mr-md" />
            <q-icon name="mdi-slack" size="2rem" class="q-mr-md" />
            <q-icon name="mdi-google" size="2rem" class="q-mr-md" />
            <q-icon name="mdi-shopify" size="2rem" class="q-mr-md" />
          </div>
        </div>

      <!-- Category Cards -->
        <div class="row q-mt-lg">
          <q-card flat class="bg-grey-2 q-pa-md q-mr-md" style="width: 300px;">
            <img src="~assets/blog/blog.jpg" ratio="16/9" class="rounded-borders" />  <q-card-section>
              <h6 class="text-weight-bold">Vender Online em Moçambique</h6>
              <p>Transforme seu WhatsApp em um negócio profissional.</p>
              <q-btn flat label="Saiba Mais" to="/tutorials/vender-online" />
            </q-card-section>
          </q-card>
          <q-card flat class="bg-grey-2 q-pa-md q-mr-md" style="width: 300px;">
            <img src="~assets/blog/blog 1.jpg" ratio="16/9" class="rounded-borders" />
            <q-card-section>
              <h6 class="text-weight-bold">Guia do Revendedor KLC</h6>
              <p>Aprenda a cadastrar-se e destacar produtos.</p>
              <q-btn flat label="Saiba Mais" to="/tutorials/guia-revendedor" />
            </q-card-section>
          </q-card>
          <q-card flat class="bg-grey-2 q-pa-md q-mr-md" style="width: 300px;">
             <img src="~assets/blog/blog 2.jpg" ratio="16/9" class="rounded-borders" /><q-card-section>
              <h6 class="text-weight-bold">Comprar Online com Segurança</h6>
              <p>Evite golpes com Cash on Delivery.</p>
              <q-btn flat label="Saiba Mais" to="/tutorials/comprar-seguro" />
            </q-card-section>
          </q-card>
          <q-card flat class="bg-grey-2 q-pa-md" style="width: 300px;">
             <img src="~assets/blog/blog 3.jpg" ratio="16/9" class="rounded-borders" /><q-card-section>
              <h6 class="text-weight-bold">Histórias e Casos Reais</h6>
              <p>Veja como vendedores escalaram com KLC.</p>
              <q-btn flat label="Saiba Mais" to="/tutorials/historias" />
            </q-card-section>
          </q-card>
          <q-card flat class="bg-grey-2 q-pa-md q-mr-md" style="width: 300px;">
             <img src="~assets/blog/blog 4.jpg" ratio="16/9" class="rounded-borders" /><q-card-section>
              <h6 class="text-weight-bold">Tendências de Comércio Digital</h6>
              <p>Explore o crescimento do e-commerce local.</p>
              <q-btn flat label="Saiba Mais" to="/tutorials/tendencias" />
            </q-card-section>
          </q-card>
          <q-card flat class="bg-grey-2 q-pa-md" style="width: 300px;">
            <img src="~assets/blog/blog.jpg" ratio="16/9" class="rounded-borders" /> <q-card-section>
              <h6 class="text-weight-bold">Ferramentas e Dicas</h6>
              <p>Tire fotos e gerencie estoque com facilidade.</p>
              <q-btn flat label="Saiba Mais" to="/tutorials/ferramentas" />
            </q-card-section>
          </q-card>
        </div>

        <!-- Rewards Section -->
        <div class="bg-gradient q-pa-lg text-white rounded-borders q-mt-lg">
          <h5>Recompensas que Valorizam Cada Venda</h5>
          <p>Ganhe cashback e descontos com cada transação no KLC.</p>

        </div>




      </q-page>
    </q-page-container>

   
  <FooterBlog v-if="true" />
    </div>
  </q-layout>
</template>

<script>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import FooterBlog from "components/store/FooterBlog.vue";
import HeaderBlog from "components/store/HeaderBlog.vue";

export default {
  name: 'MainLayout',
   components: {
    FooterBlog,
    HeaderBlog,
  },
  setup() {
    const email = ref('')
    const $q = useQuasar()
    const toggleDarkMode = () => $q.dark.toggle()
    return { email, toggleDarkMode }
  }
}
</script>

<style scoped>

.bg-gradient {
  background: linear-gradient(135deg, #bd6513, #bd6513);
}
.hero-section {
  border-radius: 10px;
  padding: 40px;
}
q-card {
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
