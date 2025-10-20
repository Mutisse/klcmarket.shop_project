<template>
  <q-layout>
    <HeaderC />
    <div class="seller-profile bg-grey-2 q-pa-md">
      <!-- Banner e Foto de Capa -->
      <div class="q-mb-lg" style="position: relative" v-if="false">
        <!-- Banner do Vendedor -->
        <q-img
          src="~assets/logo-klc-market1.png"
          class="q-mb-md"
          style="height: 200px; width: 100%; object-fit: cover"
        />

        <!-- Foto de Perfil sobre o Banner -->
        <q-img
          src="~assets/logo-klc-market1.png"
          class="rounded-borders"
          style="
            width: 150px;
            height: 150px;
            position: absolute;
            bottom: -75px;
            left: 50%;
            transform: translateX(-50%);
            border: 4px solid white;
          "
        />
      </div>

      <!-- Nome do Vendedor e Ação de Contato -->
      <div class="q-pa-md bg-white q-mb-lg flex flex-center column text-center">
        <!-- Nome do vendedor -->
        <h5 class="text-bold q-mb-xs">
          <q-skeleton
            v-if="!seller"
            type="text"
            style="width: 150px; height: 44px"
          />
          <span v-else>{{ seller.nome }}</span>
        </h5>

        <!-- Descrição do vendedor -->
        <div class="text-grey-7 q-mb-sm">
          <q-skeleton
            v-if="!seller"
            type="text"
            style="width: 200px; height: 16px"
          />
          <span v-else>{{ seller.descricao }}</span>
        </div>

        <!-- Botões de Mensagem e Seguir -->
        <div v-if="false" class="row q-mb-md justify-around full-width">
          <q-skeleton
            v-if="!seller"
            type="rect"
            style="width: 100px; height: 36px"
          />
          <q-btn
            v-else
            outline
            rounded
            color="green-4"
            label="Menssagem"
            @click="openChat"
          />

          <q-skeleton
            v-if="!seller"
            type="rect"
            style="width: 100px; height: 36px"
          />
          <q-btn
            v-else
            rounded
            color="green"
            label="Seguir"
            @click="openChat"
          />
        </div>
      </div>

      <!-- Estatísticas e Avaliações -->
      <div v-if="false" class="q-pa-md bg-white q-mb-lg flex justify-between">
        <div>
          <div class="text-h6 text-bold">4.5/5</div>
          <q-rating value="4.5" max="5" color="amber" readonly />
          <div class="text-caption text-grey-7">300 avaliações</div>
        </div>
        <div>
          <div class="text-h6 text-bold">150</div>
          <div class="text-caption text-grey-7">Produtos vendidos</div>
        </div>
        <div>
          <div class="text-h6 text-bold">2 dias</div>
          <div class="text-caption text-grey-7">Tempo de entrega médio</div>
        </div>
      </div>

      <!-- Produtos em Destaque -->
      <div class="q-pa-md bg-white q-mb-lg">
        <div class="text-h5 text-bold q-mb-sm">Produtos</div>

        <div class="q-pt-lg q-mb-xl q-gutter-md">
          <!-- skeleton -->
          <div
            v-if="featuredProducts.length === 0"
            style="
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
              gap: 16px;
            "
          >
            <q-card
              v-for="p in 6"
              :key="p"
              style="box-shadow: none; min-width: 150px"
            >
              <q-skeleton height="200px" square />
              <q-item>
                <q-item-section>
                  <q-item-label><q-skeleton type="text" /></q-item-label>
                  <q-item-label caption
                    ><q-skeleton type="text"
                  /></q-item-label>
                </q-item-section>
              </q-item>
            </q-card>
          </div>

          <!-- product -->
          <div
            v-else
            :style="
              $q.screen.lt.md
                ? {
                    'grid-template-columns':
                      'repeat(auto-fill, minmax(100px, 1fr))',
                  }
                : {
                    'grid-template-columns':
                      'repeat(auto-fill, minmax(150px, 1fr))',
                  }
            "
            style="display: grid; grid-auto-flow: dense; gap: 16px"
          >
            <q-card
              v-for="product in featuredProducts"
              :key="product.id"
              @click="$router.push(`/product/${product.id}`)"
              :style="{
                'box-shadow': 'none',
                'grid-row-end':
                  product.images && product.images[0]?.height
                    ? `span ${Math.ceil(product.images[0].height / 200)}`
                    : 'span 1',
              }"
            >
              <q-img
                v-if="product.images.length > 0"
                :src="getImageUrl(product.images[0])"
                spinner-color="white"
                style="
                  object-fit: contain;
                  overflow: hidden;
                  vertical-align: middle;
                  border: 1px solid black;
                  padding: 8px;
                  width: 100%;
                  height: auto;
                "
              />
              <q-img
                v-else
                src="https://via.placeholder.com/300x300"
                spinner-color="white"
                style="
                  object-fit: contain;
                  overflow: hidden;
                  vertical-align: middle;
                  border-radius: 22px;
                  border: 1px solid black;
                  padding: 8px;
                  width: 100%;
                  height: auto;
                "
              />
              <q-card-section style="text-align: center">
                <q-item-label>{{ product.name }}</q-item-label>
                <q-item-label
                  style="
                    font-weight: bold;
                    color: #bd6513; /* Dourado */
                    font-size: 22px;
                    -webkit-text-stroke: 0.1px white; /* Borda preta no texto */
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); /* Leve sombra para mais destaque */
                  "
                >
                  {{ product.price }} MT
                </q-item-label>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Categorias de Produtos -->
      <div class="q-pa-md bg-white q-mb-lg" v-if="false">
        <div class="text-h5 text-bold q-mb-md">Categorias</div>
        <div class="row no-wrap scroll-area-x">
          <div
            v-for="category in categories"
            :key="category.name"
            class="col-auto q-pa-sm"
          >
            <div class="text-center">
              <q-icon
                :name="category.icon"
                size="40px"
                class="q-mb-sm"
                color="green-4"
              />
              <div class="text-caption">{{ category.name }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Avaliações Recentes -->
      <div class="q-pa-md bg-white q-mb-lg" v-if="false">
        <div class="text-h5 text-bold q-mb-md">Avaliações Recentes</div>
        <div v-for="review in recentReviews" :key="review.id" class="q-mb-md">
          <q-card flat bordered>
            <q-card-section>
              <q-rating
                :value="review.rating"
                max="5"
                size="20px"
                color="amber"
                readonly
              />
              <div class="text-subtitle2 text-bold q-mb-xs">
                {{ review.user }}
              </div>
              <div class="text-body2">{{ review.comment }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Políticas da Loja para Cash on Delivery (COD) -->
      <div class="q-pa-md bg-white q-mb-lg">
        <div class="text-h6 text-bold q-mb-md">Políticas da KLC Market</div>

        <q-expansion-item label="Política de Pagamento" expand-separator>
          <div>
            <p>
              Na KLC Market, aceitamos apenas a opção de pagamento no ato da
              entrega (Cash on Delivery - COD). Isso significa que o cliente
              pagará em dinheiro no momento em que receber o pedido.
            </p>
            <ul>
              <li>
                <strong>Método Aceito:</strong> Apenas pagamento em dinheiro ao
                receber o pedido.
              </li>
              <li>
                <strong>Processo de Pagamento:</strong> O pagamento deve ser
                feito ao entregador após a conferência do produto.
              </li>
              <li>
                <strong>Manuseio do Dinheiro:</strong> O entregador coletará o
                pagamento e o transferirá para o sistema de forma segura.
              </li>
              <li>
                <strong>Restrições:</strong>
                <ul>
                  <li>Pedido Mínimo: [Inserir valor mínimo, se aplicável]</li>
                  <li>
                    Pedido Máximo: Não aceitamos pedidos acima de [Inserir valor
                    máximo] sem aprovação prévia.
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </q-expansion-item>

        <q-expansion-item
          label="Política de Cancelamento e Reembolso"
          expand-separator
        >
          <div>
            <p>
              Clientes podem cancelar o pedido antes de ele ser enviado para
              entrega. Cancelamentos frequentes podem resultar em restrições.
            </p>
            <ul>
              <li>
                <strong>Cancelamento:</strong> Cancele o pedido antes da
                entrega. Após o envio, o cancelamento não será permitido.
              </li>
              <li>
                <strong>Reembolso:</strong> Se o produto for devolvido, o
                reembolso será feito em dinheiro após a verificação.
              </li>
              <li>
                <strong>Cancelamentos Frequentes:</strong> Clientes que
                cancelarem várias vezes podem ter suas contas temporariamente
                suspensas ou restritas.
              </li>
              <li>
                <strong>Como Solicitar Reembolso:</strong> Entre em contato com
                nosso suporte em [Informações de contato] com o número do
                pedido.
              </li>
            </ul>
          </div>
        </q-expansion-item>

        <q-expansion-item
          label="Política de Devolução e Troca"
          expand-separator
        >
          <div>
            <ul>
              <li>
                <strong>Causas para Devolução:</strong> Produtos defeituosos,
                itens incorretos ou produtos que não correspondem à descrição.
              </li>
              <li>
                <strong>Troca de Produto:</strong> As trocas dependerão da
                disponibilidade do item solicitado.
              </li>
              <li>
                <strong>Processo de Reembolso:</strong> Após a devolução ser
                confirmada, um reembolso será emitido em dinheiro.
              </li>
              <li>
                <strong>Prazo para Devolução:</strong> Todos os pedidos de
                devolução devem ser feitos dentro de 2 dias após a entrega.
              </li>
            </ul>
          </div>
        </q-expansion-item>

        <q-expansion-item label="Responsabilidades do Cliente" expand-separator>
          <div>
            <ul>
              <li>
                <strong>Pagamento no Ato da Entrega:</strong> O cliente deve ter
                o valor correto em dinheiro pronto no momento da entrega.
              </li>
              <li>
                <strong>Presença na Entrega:</strong> O cliente deve estar
                presente no endereço de entrega durante o período programado.
              </li>
              <li>
                <strong>Falta de Pagamento:</strong> Caso o pagamento não seja
                realizado, o pedido será cancelado e o cliente poderá sofrer
                restrições em pedidos futuros.
              </li>
            </ul>
          </div>
        </q-expansion-item>

        <q-expansion-item
          label="Responsabilidades do Vendedor"
          expand-separator
        >
          <div>
            <ul>
              <li>
                <strong>Informações Precisas:</strong> Os vendedores devem
                fornecer descrições precisas dos produtos.
              </li>
              <li>
                <strong>Entrega Pontual:</strong> Os vendedores devem garantir a
                entrega dentro do prazo estabelecido.
              </li>
              <li>
                <strong>Manuseio de Pagamentos:</strong> Os vendedores são
                responsáveis por garantir que o dinheiro seja coletado e
                processado corretamente.
              </li>
            </ul>
          </div>
        </q-expansion-item>

        <q-expansion-item label="Política de Entrega" expand-separator>
          <div>
            <ul>
              <li>
                <strong>Processo de Entrega:</strong> Após o pedido ser
                confirmado, o cliente será informado sobre o prazo estimado de
                entrega.
              </li>
              <li>
                <strong>Verificação na Entrega:</strong> O cliente deve
                verificar o produto ao recebê-lo e antes de fazer o pagamento.
              </li>
              <li>
                <strong>Problemas com a Entrega:</strong> Caso o produto não
                seja entregue ou tenha problemas, o cliente deverá recusar e
                notificar o suporte imediatamente.
              </li>
            </ul>
          </div>
        </q-expansion-item>

        <q-expansion-item
          label="Política de Privacidade e Segurança"
          expand-separator
        >
          <div>
            <ul>
              <li>
                <strong>Proteção de Informações:</strong> Todos os dados
                pessoais do cliente, como endereço e contato, são mantidos
                confidenciais.
              </li>
              <li>
                <strong>Segurança de Transações:</strong> As transações em
                dinheiro são realizadas com segurança pelos entregadores.
              </li>
            </ul>
          </div>
        </q-expansion-item>

        <q-expansion-item label="Resolução de Disputas" expand-separator>
          <div>
            <ul>
              <li>
                <strong>Processo de Disputas:</strong> Para qualquer problema
                com seu pedido, entre em contato com o suporte.
              </li>
              <li>
                <strong>Canal de Suporte:</strong> O suporte está disponível via
                telefone, e-mail ou chat online para resolução de disputas.
              </li>
              <li>
                <strong>Resolução:</strong> Nosso time investigará o problema e
                oferecerá uma solução o mais breve possivel.
              </li>
            </ul>
          </div>
        </q-expansion-item>
      </div>
    </div>
    <FooterC />
  </q-layout>
</template>

<script>
import HeaderC from "components/store/HeaderC.vue";
import store from "src/store/index.js";
import apiMethods from "src/router/api.js";
import FooterC from "components/store/FooterC.vue";
export default {
  name: "ProductsPage",
  components: {
    HeaderC,
    FooterC,
  },
  data() {
    return {
      featuredProducts: [],
      seller: null,
      categories: [
        { name: "Vestuário", icon: "checkroom" },
        { name: "Calçado", icon: "sports_esports" },
        { name: "Acessórios", icon: "watch" },
        { name: "Beleza", icon: "spa" },
        { name: "Joias", icon: "diamond" },
      ],
      recentReviews: [
        {
          id: 1,
          user: "João",
          rating: 5,
          comment: "Ótima qualidade e entrega rápida!",
        },
        {
          id: 2,
          user: "Ana",
          rating: 4,
          comment: "Produto conforme descrito, recomendo!",
        },
      ],
    };
  },
  created() {
    this.fetchProducts();
    // this.getRelatedProducts();
  },
  methods: {
    openChat() {
      // Lógica para abrir o chat com o vendedor
    },
    getImageUrl(imageName) {
      // console.log(
      //   apiMethods.baseURL() + `/storage/product_images/${imageName.name}`
      // );
      return apiMethods.baseURL() + `/storage/product_images/${imageName.name}`;
    },
    async fetchProducts() {
      try {
        const id = this.$route.params.id;
        const response = await apiMethods.getPublicProductsBySeller(id);
        this.featuredProducts = response.data.products;
        this.seller = response.data.seller;
        //  console.log(this.seller)
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    },
  },
};
</script>

<style scoped>
.scroll-area-x {
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
}
.scroll-area-x::-webkit-scrollbar {
  display: none;
}
.div {
  background-color: #f5f5f5;
}
.rounded-borders {
  border-radius: 50%;
}
</style>
