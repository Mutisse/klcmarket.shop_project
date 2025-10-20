<template>
  <div class="promotions-page q-pa-md">
    <!-- Header com título animado -->
    <div class="promotions-header text-center q-mb-xl">
      <div class="text-h3 text-bold gradient-text q-mb-sm">
        🎯 Promoções Imperdíveis
      </div>
      <div class="text-subtitle1 text-grey-7">
        Descontos exclusivos que você não pode perder!
      </div>
    </div>

    <!-- Filtros Interativos -->
    <div class="filters-section q-mb-lg">
      <div class="row justify-center q-gutter-md">
        <q-btn
          v-for="filter in filters"
          :key="filter.id"
          :label="filter.label"
          :color="activeFilter === filter.id ? 'primary' : 'grey-6'"
          :class="['filter-btn', { 'active': activeFilter === filter.id }]"
          unelevated
          rounded
          @click="applyFilter(filter.id)"
        />
      </div>
      
      <!-- Filtro de Ordenação -->
      <div class="row justify-center q-mt-md">
        <q-select
          v-model="sortBy"
          :options="sortOptions"
          label="Ordenar por"
          dense
          outlined
          style="min-width: 200px"
          class="sort-select"
        />
      </div>
    </div>

    <!-- Contador de Ofertas -->
    <div class="offers-counter text-center q-mb-lg">
      <q-badge class="counter-badge" rounded>
        🏷️ {{ filteredProducts.length }} ofertas encontradas
      </q-badge>
    </div>

    <!-- Grid de Produtos em Promoção -->
    <div 
      class="promotions-grid q-mb-xl"
      :class="{ 'loading': loading }"
    >
      <!-- Skeleton Loading -->
      <div
        v-if="loading"
        class="row q-col-gutter-md justify-center"
      >
        <div
          v-for="n in 8"
          :key="n"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <q-card class="promotion-card skeleton-card">
            <q-skeleton height="200px" square />
            <q-card-section>
              <q-skeleton type="text" width="80%" />
              <q-skeleton type="text" width="60%" />
              <div class="row justify-between items-center q-mt-sm">
                <q-skeleton type="text" width="40%" />
                <q-skeleton type="text" width="30%" />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Produtos em Promoção -->
      <transition-group
        v-else
        name="staggered-fade"
        tag="div"
        class="row q-col-gutter-md justify-center"
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @leave="onLeave"
      >
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
          :data-index="getProductIndex(product.id)"
        >
          <q-card
            class="promotion-card animated-card"
            @click="$router.push('/product/' + product.id + '/' + product.name)"
          >
            <!-- Badge de Desconto -->
            <div class="discount-badge" v-if="product.discountPercentage > 0">
              -{{ product.discountPercentage }}%
            </div>

            <!-- Imagem do Produto -->
            <div class="card-image-container">
              <q-img
                :src="getImageUrl(product.images[0])"
                :alt="product.name"
                spinner-color="primary"
                class="product-image"
                ratio="1"
                transition="fade"
              >
                <template v-slot:loading>
                  <div class="absolute-full flex flex-center">
                    <q-spinner-rings color="primary" size="2em" />
                  </div>
                </template>
              </q-img>
              
              <!-- Overlay de Ações -->
              <div class="card-actions">
                <q-btn
                  round
                  color="white"
                  text-color="primary"
                  icon="favorite_border"
                  class="action-btn"
                  @click.stop="toggleFavorite(product)"
                />
                <q-btn
                  round
                  color="primary"
                  icon="add_shopping_cart"
                  class="action-btn"
                  @click.stop="addToCart(product)"
                />
              </div>
            </div>

            <q-card-section class="card-content">
              <!-- Nome do Produto -->
              <div class="product-name text-subtitle1 text-weight-medium q-mb-xs">
                {{ product.name }}
              </div>

              <!-- Descrição -->
              <div class="product-description text-caption text-grey-7 q-mb-sm">
                {{ truncateDescription(product.description) }}
              </div>

              <!-- Preços -->
              <div class="price-section">
                <div class="original-price text-caption text-strike text-grey-6">
                  {{ formatPrice(product.price) }} MT
                </div>
                <div class="discount-price text-h6 text-weight-bold text-primary">
                  {{ formatPrice(product.price_discount || product.price) }} MT
                </div>
                <div class="economy text-caption text-positive" v-if="product.discountPercentage > 0">
                  Economize {{ formatPrice(product.price - (product.price_discount || product.price)) }} MT
                </div>
              </div>

              <!-- Rating e Reviews -->
              <div class="rating-section row items-center justify-between q-mt-sm">
                <div class="row items-center">
                  <q-icon name="star" color="yellow-8" size="16px" />
                  <span class="text-caption text-weight-medium q-ml-xs">
                    {{ product.rating || '4.5' }}
                  </span>
                </div>
                <div class="text-caption text-grey-6">
                  {{ product.reviewCount || '125' }} reviews
                </div>
              </div>

              <!-- Barra de Estoque Limitado -->
              <div 
                class="stock-bar q-mt-sm" 
                v-if="product.stock && product.stock < 10"
              >
                <div class="text-caption text-warning text-weight-medium">
                  ⚠️ Apenas {{ product.stock }} em estoque!
                </div>
                <q-linear-progress
                  :value="product.stock / 10"
                  color="warning"
                  class="q-mt-xs"
                />
              </div>
            </q-card-section>

            <!-- Timer de Promoção -->
            <div class="promotion-timer text-center q-pa-sm bg-primary text-white" v-if="product.promotionEnds">
              <div class="text-caption">
                ⏰ Oferta termina em: {{ formatTimeRemaining(product.promotionEnds) }}
              </div>
            </div>
          </q-card>
        </div>
      </transition-group>
    </div>

    <!-- Botão Carregar Mais -->
    <div v-if="hasMoreProducts && !loading" class="text-center q-mt-xl">
      <q-btn
        label="Carregar Mais Ofertas"
        color="primary"
        icon="expand_more"
        rounded
        unelevated
        class="load-more-btn"
        @click="loadMoreProducts"
        :loading="loadingMore"
      />
    </div>

    <!-- Banner de Newsletter -->
    <div class="newsletter-banner q-mt-xl q-pa-lg text-center rounded-borders">
      <div class="text-h5 text-weight-bold text-white q-mb-sm">
        🎁 Não Perca Nenhuma Promoção!
      </div>
      <div class="text-subtitle1 text-white q-mb-md">
        Cadastre-se e receba as melhores ofertas primeiro
      </div>
      <div class="row justify-center">
        <q-input
          v-model="email"
          placeholder="Seu melhor e-mail"
          dense
          outlined
          class="bg-white q-mr-sm"
          style="min-width: 250px"
        />
        <q-btn
          label="Cadastrar"
          color="secondary"
          unelevated
          rounded
          @click="subscribeNewsletter"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import store from "src/store/index.js";
import apiMethods from "src/router/api.js";

export default {
  name: 'PromotionsPage',
  setup() {
    const $q = useQuasar()
    const products = ref([])
    const loading = ref(true)
    const loadingMore = ref(false)
    const activeFilter = ref('all')
    const sortBy = ref('discount')
    const email = ref('')
    const currentPage = ref(1)
    const hasMoreProducts = ref(true)

    const filters = [
      { id: 'all', label: 'Todas as Ofertas' },
      { id: 'high-discount', label: 'Maior Desconto' },
      { id: 'ending-soon', label: 'Terminando Logo' },
      { id: 'under-500', label: 'Abaixo de 500MT' },
      { id: 'bestsellers', label: 'Mais Vendidos' }
    ]

    const sortOptions = [
      { label: 'Maior Desconto', value: 'discount' },
      { label: 'Menor Preço', value: 'price_asc' },
      { label: 'Maior Preço', value: 'price_desc' },
      { label: 'Mais Recentes', value: 'newest' },
      { label: 'Melhor Avaliados', value: 'rating' }
    ]

    // Computed para produtos filtrados e ordenados
    const filteredProducts = computed(() => {
      let filtered = [...products.value]

      // Aplicar filtros
      switch (activeFilter.value) {
        case 'high-discount':
          filtered = filtered.filter(p => p.discountPercentage >= 30)
          break
        case 'ending-soon':
          filtered = filtered.filter(p => {
            if (!p.promotionEnds) return false
            const timeLeft = new Date(p.promotionEnds) - new Date()
            return timeLeft < 24 * 60 * 60 * 1000 // 24 horas
          })
          break
        case 'under-500':
          filtered = filtered.filter(p => (p.price_discount || p.price) <= 500)
          break
        case 'bestsellers':
          filtered = filtered.filter(p => (p.salesCount || 0) > 50)
          break
      }

      // Aplicar ordenação
      switch (sortBy.value) {
        case 'discount':
          filtered.sort((a, b) => b.discountPercentage - a.discountPercentage)
          break
        case 'price_asc':
          filtered.sort((a, b) => (a.price_discount || a.price) - (b.price_discount || b.price))
          break
        case 'price_desc':
          filtered.sort((a, b) => (b.price_discount || b.price) - (a.price_discount || a.price))
          break
        case 'newest':
          filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          break
        case 'rating':
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
          break
      }

      return filtered
    })

    // Métodos
    const fetchPromotionProducts = async (page = 1) => {
      try {
        if (page === 1) {
          loading.value = true
        } else {
          loadingMore.value = true
        }

        const response = await apiMethods.getPublicProducts({ 
          page,
          promotions: true 
        })
        
        if (page === 1) {
          products.value = []
        }

        const newProducts = response.data.data.map(product => ({
          ...product,
          discountPercentage: product.price_discount ? 
            Math.round(((product.price - product.price_discount) / product.price) * 100) : 0,
          promotionEnds: addRandomPromotionTime(),
          rating: (Math.random() * 1 + 4).toFixed(1), // Random rating between 4.0-5.0
          reviewCount: Math.floor(Math.random() * 200) + 50,
          salesCount: Math.floor(Math.random() * 500) + 10,
          stock: Math.floor(Math.random() * 50) + 1
        }))

        products.value = [...products.value, ...newProducts]
        hasMoreProducts.value = page < response.data.last_page
        currentPage.value = page

      } catch (error) {
        console.error('Erro ao buscar produtos em promoção:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao carregar promoções'
        })
      } finally {
        loading.value = false
        loadingMore.value = false
      }
    }

    const addRandomPromotionTime = () => {
      const hours = Math.floor(Math.random() * 72) + 1 // 1-72 horas
      const date = new Date()
      date.setHours(date.getHours() + hours)
      return date.toISOString()
    }

    const applyFilter = (filterId) => {
      activeFilter.value = filterId
    }

    const loadMoreProducts = () => {
      fetchPromotionProducts(currentPage.value + 1)
    }

    const getImageUrl = (imageName) => {
      return apiMethods.baseURL() + `/storage/product_images/${imageName.name}`
    }

    const truncateDescription = (description, length = 80) => {
      if (!description) return 'Descrição não disponível'
      return description.length > length 
        ? description.substring(0, length) + '...' 
        : description
    }

    const formatPrice = (price) => {
      return parseFloat(price).toFixed(2)
    }

    const formatTimeRemaining = (endDate) => {
      const now = new Date()
      const end = new Date(endDate)
      const diff = end - now

      if (diff <= 0) return 'Expirado'

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      return `${hours}h ${minutes}m`
    }

    const toggleFavorite = (product) => {
      $q.notify({
        message: `${product.name} ${product.isFavorite ? 'removido dos' : 'adicionado aos'} favoritos`,
        color: 'primary',
        icon: 'favorite'
      })
      product.isFavorite = !product.isFavorite
    }

    const addToCart = (product) => {
      store.dispatch('addToCart', {
        productId: product.id,
        quantity: 1,
        product
      })
      $q.notify({
        message: `${product.name} adicionado ao carrinho!`,
        color: 'positive',
        icon: 'shopping_cart'
      })
    }

    const subscribeNewsletter = () => {
      if (!email.value) {
        $q.notify({
          type: 'warning',
          message: 'Por favor, insira seu e-mail'
        })
        return
      }
      $q.notify({
        type: 'positive',
        message: 'Inscrito com sucesso! Você receberá nossas melhores promoções.'
      })
      email.value = ''
    }

    // Animations
    const onBeforeEnter = (el) => {
      el.style.opacity = 0
      el.style.transform = 'translateY(30px)'
    }

    const onEnter = (el, done) => {
      const delay = el.dataset.index * 100
      setTimeout(() => {
        el.style.transition = 'all 0.5s ease'
        el.style.opacity = 1
        el.style.transform = 'translateY(0)'
        done()
      }, delay)
    }

    const onLeave = (el, done) => {
      el.style.transition = 'all 0.3s ease'
      el.style.opacity = 0
      el.style.transform = 'translateY(30px)'
      setTimeout(done, 300)
    }

    const getProductIndex = (productId) => {
      return filteredProducts.value.findIndex(p => p.id === productId) % 20
    }

    onMounted(() => {
      fetchPromotionProducts()
    })

    return {
      products,
      loading,
      loadingMore,
      activeFilter,
      sortBy,
      email,
      hasMoreProducts,
      filters,
      sortOptions,
      filteredProducts,
      applyFilter,
      loadMoreProducts,
      getImageUrl,
      truncateDescription,
      formatPrice,
      formatTimeRemaining,
      toggleFavorite,
      addToCart,
      subscribeNewsletter,
      onBeforeEnter,
      onEnter,
      onLeave,
      getProductIndex
    }
  }
}
</script>

<style scoped>
.promotions-page {
  max-width: 1400px;
  margin: 0 auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.promotions-header {
  padding: 2rem 0;
}

.gradient-text {
  background: linear-gradient(45deg, #FFD700, #FF6B6B, #4ECDC4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.filters-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  margin: 0 1rem;
}

.filter-btn {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.filter-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: currentColor;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.filter-btn.active::after {
  width: 80%;
}

.filter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.offers-counter {
  margin: 2rem 0;
}

.counter-badge {
  background: linear-gradient(45deg, #FF6B6B, #FFD700);
  color: white;
  padding: 0.5rem 1.5rem;
  font-size: 1.1em;
  font-weight: bold;
}

.promotions-grid {
  position: relative;
  min-height: 400px;
}

.promotions-grid.loading {
  opacity: 0.7;
}

.promotion-card {
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  height: 100%;
}

.promotion-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.animated-card {
  animation: cardAppear 0.6s ease-out;
}

@keyframes cardAppear {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.discount-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(45deg, #FF6B6B, #FFD700);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8em;
  font-weight: bold;
  z-index: 2;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.card-image-container {
  position: relative;
  overflow: hidden;
}

.product-image {
  transition: transform 0.4s ease;
}

.promotion-card:hover .product-image {
  transform: scale(1.1);
}

.card-actions {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.promotion-card:hover .card-actions {
  opacity: 1;
  transform: translateX(0);
}

.action-btn {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.card-content {
  padding: 1rem;
}

.product-name {
  font-weight: 600;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-description {
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.price-section {
  margin: 0.5rem 0;
}

.original-price {
  font-size: 0.9em;
}

.discount-price {
  color: #FF6B6B;
  font-size: 1.3em;
}

.economy {
  font-weight: 600;
  margin-top: 0.25rem;
}

.rating-section {
  padding-top: 0.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.stock-bar {
  background: rgba(255, 152, 0, 0.1);
  padding: 0.5rem;
  border-radius: 8px;
}

.promotion-timer {
  background: linear-gradient(45deg, #FF6B6B, #FFD700);
  font-weight: 600;
}

.load-more-btn {
  padding: 0.75rem 2rem;
  font-size: 1.1em;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
}

.newsletter-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.skeleton-card {
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Animações de entrada em lote */
.staggered-fade-move {
  transition: transform 0.5s ease;
}

/* Responsividade */
@media (max-width: 600px) {
  .promotions-header .text-h3 {
    font-size: 2rem;
  }
  
  .filters-section {
    margin: 0;
    border-radius: 15px;
  }
  
  .filter-btn {
    font-size: 0.8em;
    padding: 0.5rem 1rem;
  }
}

@media (max-width: 400px) {
  .promotions-page {
    padding: 0.5rem;
  }
  
  .card-content {
    padding: 0.75rem;
  }
}
</style>