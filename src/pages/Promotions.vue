<template>
  <div class="promotions-page">
    <!-- Header Component -->
    <HeaderC />

    <!-- Conteúdo Principal -->
    <div class="page-content">
      <!-- Header com Banner de Background -->
      <div class="promotions-hero">
        <div class="hero-background">
          <img src="~/assets/image-removebg-preview.png" />
          <div class="banner-overlay"></div>
        </div>
        <div class="hero-content">
          <!-- Badge com animação de pulso -->
          <div class="hero-badge animated-badge">
            <span class="fire-icon">🔥</span>
            OFERTAS ESPECIAIS
          </div>
          
          <!-- Título principal com animação de digitação -->
          <h1 class="hero-title typed-title">Promoções Imperdíveis</h1>
          
          <!-- Subtítulo com animação de fade in -->
          <p class="hero-subtitle fade-in-subtitle">Descontos exclusivos selecionados para você</p>
          
          <!-- Features com animação stagger -->
          <div class="hero-features">
            <div class="feature animated-feature" style="--delay: 0">
              <q-icon name="verified" class="feature-icon" />
              <span>Produtos verificados</span>
            </div>
            <div class="feature animated-feature" style="--delay: 1">
              <q-icon name="local_shipping" class="feature-icon" />
              <span>Entrega rápida</span>
            </div>
            <div class="feature animated-feature" style="--delay: 2">
              <q-icon name="security" class="feature-icon" />
              <span>Compra segura</span>
            </div>
          </div>
        </div>
        
        <!-- Visual flutuante com animação - CORRIGIDO PARA NÃO FICAR OVAL -->
        <div class="hero-visual">
          <div class="floating-discount pulse-discount">
            <span class="discount-text">ATÉ</span>
            <span class="discount-value">70%</span>
            <span class="discount-off">OFF</span>
          </div>
        </div>
      </div>

      <!-- Barra de Estatísticas -->
      <div class="stats-bar">
        <div class="stat-item">
          <div class="stat-value">{{ filteredProducts.length }}</div>
          <div class="stat-label">Ofertas ativas</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ highestDiscount }}%</div>
          <div class="stat-label">Maior desconto</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ averageDiscount }}%</div>
          <div class="stat-label">Desconto médio</div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filters-section">
        <div class="filters-header">
          <h3>Filtrar Ofertas</h3>
          <div class="results-count">{{ filteredProducts.length }} resultados</div>
        </div>
        
        <div class="filters-container">
          <!-- Filtros Rápidos -->
          <div class="filter-group">
            <div class="filter-label">Categorias:</div>
            <div class="filter-chips">
              <button 
                v-for="filter in quickFilters" 
                :key="filter.id"
                :class="['filter-chip', { active: activeFilter === filter.id }]"
                @click="applyFilter(filter.id)"
              >
                <q-icon :name="filter.icon" size="16px" />
                {{ filter.label }}
              </button>
            </div>
          </div>

          <!-- Ordenação e Busca -->
          <div class="filter-actions">
            <div class="search-box">
              <q-input
                v-model="searchQuery"
                placeholder="Buscar nas promoções..."
                dense
                outlined
                class="search-input"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            
            <div class="sort-group">
              <q-select
                v-model="sortBy"
                :options="sortOptions"
                label="Ordenar por"
                dense
                outlined
                class="sort-select"
                emit-value
                map-options
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Grid de Produtos -->
      <div class="products-section">
        <!-- Skeleton Loading -->
        <div v-if="loading" class="products-grid">
          <div v-for="n in 8" :key="n" class="product-card skeleton">
            <div class="skeleton-badge"></div>
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
              <div class="skeleton-line short"></div>
              <div class="skeleton-line medium"></div>
              <div class="skeleton-price"></div>
              <div class="skeleton-button"></div>
            </div>
          </div>
        </div>

        <!-- Produtos -->
        <transition-group v-else name="staggered-fade" tag="div" class="products-grid">
          <div 
            v-for="(product, index) in filteredProducts" 
            :key="product.id"
            class="product-card"
            :style="{ 'animation-delay': `${index * 0.1}s` }"
          >
            <!-- Badge de Desconto -->
            <div class="discount-badge" v-if="product.discountPercentage > 0">
              <span class="discount-percent">-{{ product.discountPercentage }}%</span>
            </div>

            <!-- Hot Badge para produtos populares -->
            <div class="hot-badge" v-if="product.rating > 4.7">
              <q-icon name="whatshot" />
              Popular
            </div>

            <!-- Imagem do Produto com Overlay -->
            <div class="product-image-container">
              <q-img
                :src="getImageUrl(product.images[0])"
                :alt="product.name"
                class="product-image"
                ratio="1"
                transition="fade"
              >
                <template v-slot:loading>
                  <div class="image-placeholder">
                    <q-spinner-rings color="#bd6513" size="2em" />
                  </div>
                </template>
              </q-img>
              
              <!-- Overlay de Ações -->
              <div class="image-overlay">
                <button class="overlay-btn quick-view" @click.stop="quickView(product)">
                  <q-icon name="visibility" />
                  Visualizar
                </button>
              </div>

              <!-- Ações Rápidas -->
              <div class="product-actions">
                <button 
                  class="action-btn favorite" 
                  @click.stop="toggleFavorite(product)"
                  :class="{ active: product.isFavorite }"
                >
                  <q-icon :name="product.isFavorite ? 'favorite' : 'favorite_border'" />
                </button>
                <button class="action-btn view" @click.stop="quickView(product)">
                  <q-icon name="visibility" />
                </button>
              </div>
            </div>

            <!-- Informações do Produto -->
            <div class="product-info">
              <div class="product-category">{{ product.category || 'Geral' }}</div>
              
              <h3 class="product-name" :title="product.name">{{ product.name }}</h3>
              
              <!-- Preços -->
              <div class="price-section">
                <div class="price-original" v-if="product.price_discount">
                  {{ formatPrice(product.price) }} MT
                </div>
                <div class="price-current">
                  {{ formatPrice(product.price_discount || product.price) }} MT
                </div>
                <div class="price-savings" v-if="product.price_discount">
                  Economize {{ formatPrice(product.price - product.price_discount) }} MT
                </div>
              </div>

              <!-- Timer de Oferta -->
              <div class="offer-timer" v-if="product.promotionEnds">
                <div class="timer-content">
                  <q-icon name="schedule" size="16px" />
                  <span class="timer-text">Termina em {{ formatTimeRemaining(product.promotionEnds) }}</span>
                </div>
                <div class="timer-bar">
                  <div class="timer-progress" :style="{ width: getTimeProgress(product.promotionEnds) + '%' }"></div>
                </div>
              </div>

              <!-- Ações do Produto - BOTÕES "ADICIONAR" E "COMPRAR AGORA" DE VOLTA -->
              <div class="product-actions-bottom">
                <button class="add-to-cart-btn" @click="addToCart(product)">
                  <q-icon name="add_shopping_cart" />
                  Adicionar
                </button>
                <button class="buy-now-btn" @click="buyNow(product)">
                  Comprar Agora
                </button>
              </div>
            </div>
          </div>
        </transition-group>
      </div>

      <!-- Load More -->
      <div v-if="hasMoreProducts && !loading" class="load-more-section">
        <q-btn
          @click="loadMoreProducts"
          :loading="loadingMore"
          outline
          rounded
          class="load-more-btn"
        >
          <template v-slot:loading>
            <q-spinner-dots />
          </template>
          Carregar Mais Ofertas
        </q-btn>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredProducts.length === 0" class="empty-state">
        <div class="empty-icon">
          <q-icon name="search_off" size="4rem" color="grey-4" />
        </div>
        <h3>Nenhuma oferta encontrada</h3>
        <p>Experimente ajustar os filtros ou termos de busca</p>
        <div class="empty-actions">
          <q-btn 
            @click="resetFilters" 
            outline
            class="reset-filters-btn"
          >
            Limpar Filtros
          </q-btn>
          <q-btn 
            @click="fetchPromotionProducts" 
            class="retry-btn"
          >
            Recarregar
          </q-btn>
        </div>
      </div>
    </div>

    <!-- Footer Component -->
    <FooterC />

    <!-- Quick View Modal -->
    <q-dialog v-model="showQuickView" maximized>
      <q-card class="quick-view-modal" v-if="selectedProduct">
        <q-card-section class="modal-header">
          <div class="header-content">
            <div class="product-title-section">
              <h1 class="product-title">{{ selectedProduct.name }}</h1>
              <div class="product-meta">
                <div class="category-badge">{{ selectedProduct.category || 'Geral' }}</div>
                <div class="stock-info" v-if="selectedProduct.stock">
                  <q-icon name="inventory_2" size="16px" />
                  <span>{{ selectedProduct.stock }} em estoque</span>
                </div>
              </div>
            </div>
            
            <div class="header-actions">
              <q-btn 
                flat 
                round 
                dense 
                icon="share" 
                class="action-icon"
                @click="shareProduct"
              />
              <q-btn 
                flat 
                round 
                dense 
                icon="close" 
                class="close-btn"
                @click="showQuickView = false"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section class="modal-content">
          <div class="product-layout">
            <!-- Coluna da Galeria -->
            <div class="gallery-column">
              <div class="main-image-container">
                <q-img
                  :src="getImageUrl(selectedProduct.images[0])"
                  :alt="selectedProduct.name"
                  class="main-image"
                  ratio="1"
                  transition="fade"
                >
                  <template v-slot:loading>
                    <div class="image-loading">
                      <q-spinner-ores size="3em" color="#bd6513" />
                    </div>
                  </template>
                  
                  <div class="image-badges">
                    <div class="discount-badge-large" v-if="selectedProduct.discountPercentage > 0">
                      -{{ selectedProduct.discountPercentage }}% OFF
                    </div>
                  </div>
                </q-img>
              </div>
            </div>

            <!-- Coluna de Informações -->
            <div class="info-column">
              <!-- Preços e Desconto -->
              <div class="pricing-section">
                <div class="price-display">
                  <div class="original-price" v-if="selectedProduct.price_discount">
                    {{ formatPrice(selectedProduct.price) }} MT
                  </div>
                  <div class="current-price">
                    {{ formatPrice(selectedProduct.price_discount || selectedProduct.price) }} MT
                  </div>
                  <div class="savings" v-if="selectedProduct.discountPercentage > 0">
                    <q-icon name="savings" />
                    Economize {{ formatPrice(selectedProduct.price - selectedProduct.price_discount) }} MT
                  </div>
                </div>
              </div>

              <!-- Timer de Promoção -->
              <div class="promotion-timer-card" v-if="selectedProduct.promotionEnds">
                <div class="timer-header">
                  <q-icon name="schedule" />
                  <span class="timer-title">Oferta por tempo limitado!</span>
                </div>
                <div class="timer-display">
                  <div class="time-unit">
                    <span class="time-value">{{ getTimeUnits(selectedProduct.promotionEnds).days }}</span>
                    <span class="time-label">Dias</span>
                  </div>
                  <div class="time-separator">:</div>
                  <div class="time-unit">
                    <span class="time-value">{{ getTimeUnits(selectedProduct.promotionEnds).hours }}</span>
                    <span class="time-label">Horas</span>
                  </div>
                  <div class="time-separator">:</div>
                  <div class="time-unit">
                    <span class="time-value">{{ getTimeUnits(selectedProduct.promotionEnds).minutes }}</span>
                    <span class="time-label">Min</span>
                  </div>
                </div>
                <q-linear-progress
                  :value="getTimeProgress(selectedProduct.promotionEnds) / 100"
                  class="timer-progress"
                />
              </div>

              <!-- Ações de Compra -->
              <div class="purchase-actions">
                <div class="quantity-selector">
                  <label class="quantity-label">Quantidade:</label>
                  <div class="quantity-controls">
                    <q-btn 
                      round 
                      dense 
                      icon="remove" 
                      :disable="quantity <= 1"
                      @click="quantity--"
                      class="quantity-btn"
                    />
                    <span class="quantity-value">{{ quantity }}</span>
                    <q-btn 
                      round 
                      dense 
                      icon="add" 
                      @click="quantity++"
                      class="quantity-btn"
                    />
                  </div>
                </div>

                <div class="action-buttons">
                  <q-btn 
                    icon="add_shopping_cart" 
                    label="Adicionar ao Carrinho"
                    @click="addToCart(selectedProduct, quantity)"
                    class="cart-btn"
                    size="lg"
                  />
                  <q-btn 
                    icon="flash_on" 
                    label="Comprar Agora"
                    @click="buyNow(selectedProduct, quantity)"
                    class="buy-btn"
                    size="lg"
                  />
                </div>

                <div class="secure-purchase">
                  <q-icon name="verified_user" />
                  <span>Compra 100% segura e protegida</span>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <!-- Footer Fixo para Mobile -->
        <q-card-section class="modal-footer" v-if="$q.screen.lt.md">
          <div class="mobile-actions">
            <q-btn 
              icon="add_shopping_cart" 
              label="Adicionar"
              @click="addToCart(selectedProduct, quantity)"
              class="mobile-cart-btn"
            />
            <q-btn 
              label="Comprar"
              @click="buyNow(selectedProduct, quantity)"
              class="mobile-buy-btn"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import apiMethods from "src/router/api.js"
import FooterC from "components/store/FooterC.vue"
import HeaderC from "components/store/HeaderC.vue"

export default {
  name: 'PromotionsPage',
  components: {
    FooterC,
    HeaderC
  },
  setup() {
    const $q = useQuasar()
    const products = ref([])
    const loading = ref(true)
    const loadingMore = ref(false)
    const sortBy = ref('discount')
    const activeFilter = ref('all')
    const searchQuery = ref('')
    const currentPage = ref(1)
    const hasMoreProducts = ref(true)
    const showQuickView = ref(false)
    const selectedProduct = ref(null)
    const activeImageIndex = ref(0)
    const quantity = ref(1)

    const sortOptions = [
      { label: 'Maior Desconto', value: 'discount' },
      { label: 'Menor Preço', value: 'price_asc' },
      { label: 'Maior Preço', value: 'price_desc' },
      { label: 'Mais Recentes', value: 'newest' },
      { label: 'Melhor Avaliados', value: 'rating' }
    ]

    const quickFilters = [
      { id: 'all', icon: 'all_inclusive', label: 'Todas' },
      { id: 'under-100', icon: 'payments', label: 'Até 100MT' },
      { id: 'under-500', icon: 'savings', label: 'Até 500MT' },
      { id: 'high-discount', icon: 'local_offer', label: '50%+ OFF' },
      { id: 'ending-soon', icon: 'schedule', label: 'Terminando' }
    ]

    const highestDiscount = computed(() => {
      if (products.value.length === 0) return 0
      return Math.max(...products.value.map(p => p.discountPercentage))
    })

    const averageDiscount = computed(() => {
      if (products.value.length === 0) return 0
      const total = products.value.reduce((sum, p) => sum + p.discountPercentage, 0)
      return Math.round(total / products.value.length)
    })

    const filteredProducts = computed(() => {
      let filtered = [...products.value]

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(query) ||
          (p.description && p.description.toLowerCase().includes(query))
        )
      }

      switch (activeFilter.value) {
        case 'under-100':
          filtered = filtered.filter(p => (p.price_discount || p.price) <= 100)
          break
        case 'under-500':
          filtered = filtered.filter(p => (p.price_discount || p.price) <= 500)
          break
        case 'high-discount':
          filtered = filtered.filter(p => p.discountPercentage >= 50)
          break
        case 'ending-soon':
          filtered = filtered.filter(p => {
            if (!p.promotionEnds) return false
            const timeLeft = new Date(p.promotionEnds) - new Date()
            return timeLeft < 24 * 60 * 60 * 1000
          })
          break
      }

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
          filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
          break
        case 'rating':
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
          break
      }

      return filtered
    })

    const applyFilter = (filterId) => {
      activeFilter.value = filterId
    }

    const resetFilters = () => {
      activeFilter.value = 'all'
      sortBy.value = 'discount'
      searchQuery.value = ''
    }

    const quickView = (product) => {
      selectedProduct.value = product
      showQuickView.value = true
      activeImageIndex.value = 0
      quantity.value = 1
    }

    const getTimeProgress = (endDate) => {
      const start = new Date(endDate).getTime() - (7 * 24 * 60 * 60 * 1000)
      const end = new Date(endDate).getTime()
      const now = new Date().getTime()
      
      const total = end - start
      const elapsed = now - start
      
      return Math.min(100, Math.max(0, (elapsed / total) * 100))
    }

    const getTimeUnits = (endDate) => {
      const now = new Date()
      const end = new Date(endDate)
      const diff = end - now

      if (diff <= 0) return { days: '00', hours: '00', minutes: '00' }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      return {
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0')
      }
    }

    const shareProduct = () => {
      $q.notify({
        message: 'Link do produto copiado!',
        color: 'positive',
        position: 'top'
      })
    }

    const fetchPromotionProducts = async (page = 1) => {
      try {
        if (page === 1) {
          loading.value = true
        } else {
          loadingMore.value = true
        }

        const response = await apiMethods.getPublicProducts({ 
          page,
          promotions: true,
          limit: 12
        })
        
        if (page === 1) {
          products.value = []
        }

        const newProducts = response.data.data.map(product => ({
          ...product,
          discountPercentage: product.price_discount ? 
            Math.round(((product.price - product.price_discount) / product.price) * 100) : 0,
          promotionEnds: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
          rating: (Math.random() * 1 + 4).toFixed(1),
          reviewCount: Math.floor(Math.random() * 200) + 50,
          isFavorite: false,
          category: ['Electrónicos', 'Moda', 'Casa', 'Beleza'][Math.floor(Math.random() * 4)]
        }))

        products.value = [...products.value, ...newProducts]
        hasMoreProducts.value = page < response.data.last_page
        currentPage.value = page

      } catch (error) {
        console.error('Erro ao buscar produtos em promoção:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao carregar ofertas'
        })
        
        products.value = Array.from({ length: 8 }, (_, i) => ({
          id: i + 1,
          name: `Produto em Promoção ${i + 1}`,
          price: (Math.random() * 1000 + 100).toFixed(2),
          price_discount: (Math.random() * 800 + 50).toFixed(2),
          description: 'Este é um produto em promoção com qualidade garantida e entrega rápida.',
          images: [{ name: `promo${i + 1}.jpg` }],
          category: ['Electrónicos', 'Moda', 'Casa', 'Beleza'][Math.floor(Math.random() * 4)],
          discountPercentage: Math.round((((Math.random() * 1000 + 100) - (Math.random() * 800 + 50)) / (Math.random() * 1000 + 100)) * 100),
          rating: (Math.random() * 1 + 4).toFixed(1),
          reviewCount: Math.floor(Math.random() * 200) + 50,
          isFavorite: false
        }))
      } finally {
        loading.value = false
        loadingMore.value = false
      }
    }

    const loadMoreProducts = () => {
      fetchPromotionProducts(currentPage.value + 1)
    }

    const toggleFavorite = (product) => {
      product.isFavorite = !product.isFavorite
      $q.notify({
        message: product.isFavorite ? 'Adicionado aos favoritos' : 'Removido dos favoritos',
        color: product.isFavorite ? 'positive' : 'info',
        position: 'top',
        icon: product.isFavorite ? 'favorite' : 'favorite_border'
      })
    }

    const addToCart = (product, qty = 1) => {
      $q.notify({
        message: `${qty}x ${product.name} adicionado ao carrinho!`,
        color: 'positive',
        position: 'top',
        icon: 'shopping_cart_checkout'
      })
      showQuickView.value = false
    }

    const buyNow = (product, qty = 1) => {
      addToCart(product, qty)
      $q.notify({
        message: 'Redirecionando para checkout...',
        color: 'primary',
        timeout: 1000
      })
    }

    const getImageUrl = (imageName) => {
      if (!imageName) return 'https://via.placeholder.com/300x300/f8f9fa/666666?text=Produto'
      return apiMethods.baseURL() + `/storage/product_images/${imageName.name}`
    }

    const formatPrice = (price) => {
      return parseFloat(price).toLocaleString('pt-MZ', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }

    const formatTimeRemaining = (endDate) => {
      const now = new Date()
      const end = new Date(endDate)
      const diff = end - now

      if (diff <= 0) return 'Expirado'

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

      if (days > 0) return `${days}d ${hours}h`
      return `${hours}h`
    }

    onMounted(() => {
      fetchPromotionProducts()
    })

    return {
      products,
      loading,
      loadingMore,
      sortBy,
      activeFilter,
      searchQuery,
      hasMoreProducts,
      showQuickView,
      selectedProduct,
      activeImageIndex,
      quantity,
      sortOptions,
      quickFilters,
      filteredProducts,
      highestDiscount,
      averageDiscount,
      applyFilter,
      resetFilters,
      loadMoreProducts,
      toggleFavorite,
      addToCart,
      buyNow,
      quickView,
      getImageUrl,
      formatPrice,
      formatTimeRemaining,
      getTimeProgress,
      getTimeUnits,
      shareProduct
    }
  }
}
</script>

<style scoped>
.promotions-page {
  min-height: 100vh;
  background: #fafafa;
  display: flex;
  flex-direction: column;
}

.page-content {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

/* Hero Section Modernizada com imagem corrigida */
.promotions-hero {
  position: relative;
  border-radius: 20px;
  padding: 60px 40px;
  margin: 24px 0;
  color: white;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 40px;
  align-items: center;
  overflow: hidden;
  min-height: 500px;
  background: linear-gradient(135deg, #bd6513 0%, #d97a1a94 100%);
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-image {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center;
  opacity: 0.15;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.hero-content {
  position: relative;
  z-index: 3;
}

.hero-visual {
  position: relative;
  z-index: 3;
}

/* Animações para a seção hero */

/* Badge animada */
.animated-badge {
  animation: 
    slideInDown 0.8s ease-out,
    pulseGlow 2s ease-in-out infinite 1s;
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.2);
  padding: 12px 20px;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.animated-badge::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transform: rotate(45deg);
  animation: shine 3s ease-in-out infinite;
}

.fire-icon {
  display: inline-block;
  animation: firePulse 1.5s ease-in-out infinite;
  margin-right: 8px;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 
      0 0 20px rgba(255, 255, 255, 0.3),
      inset 0 0 20px rgba(255, 255, 255, 0.1);
  }
  50% {
    box-shadow: 
      0 0 30px rgba(255, 255, 255, 0.5),
      inset 0 0 30px rgba(255, 255, 255, 0.2);
  }
}

@keyframes shine {
  0% {
    transform: rotate(45deg) translateX(-100%);
  }
  100% {
    transform: rotate(45deg) translateX(100%);
  }
}

@keyframes firePulse {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.1) rotate(-5deg);
  }
  50% {
    transform: scale(1.2) rotate(5deg);
  }
  75% {
    transform: scale(1.1) rotate(-3deg);
  }
}

/* Título com efeito de digitação */
.typed-title {
  overflow: hidden;
  border-right: 3px solid white;
  white-space: nowrap;
  animation: 
    typing 1.5s steps(20, end),
    blinkCursor 0.8s step-end infinite;
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 16px;
  line-height: 1.1;
}

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes blinkCursor {
  from, to {
    border-color: transparent;
  }
  50% {
    border-color: white;
  }
}

/* Subtítulo com fade in */
.fade-in-subtitle {
  animation: fadeInUp 1s ease-out 0.5s both;
  font-size: 1.3rem;
  opacity: 0.9;
  margin-bottom: 40px;
  font-weight: 300;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Features com animação stagger */
.hero-features {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.animated-feature {
  opacity: 0;
  transform: translateY(20px);
  animation: slideInFeature 0.6s ease-out forwards;
  animation-delay: calc(var(--delay) * 0.2s + 1s);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.15);
  padding: 12px 20px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.animated-feature:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

@keyframes slideInFeature {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-icon {
  animation: bounceIn 0.8s ease-out forwards;
  animation-delay: calc(var(--delay) * 0.2s + 1.5s);
  opacity: 0;
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3) rotate(-180deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.1) rotate(10deg);
  }
  70% {
    transform: scale(0.9) rotate(-5deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

/* CORREÇÃO PARA A SEÇÃO "ATÉ 70% OFF" NÃO FICAR OVAL EM SMARTPHONE */
.floating-discount {
  animation: 
    float 3s ease-in-out infinite,
    discountPulse 2s ease-in-out infinite,
    rotate3D 8s ease-in-out infinite;
  transform-style: preserve-3d;
  background: rgba(255, 255, 255, 0.2);
  padding: 25px 20px; /* Reduzido padding vertical, aumentado horizontal */
  border-radius: 20px; /* Bordas mais suaves em vez de completamente redondas */
  font-weight: 700;
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  text-align: center;
  min-width: 140px; /* Largura mínima reduzida */
  min-height: 140px; /* Altura mínima reduzida */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 15px 35px rgba(255, 215, 0, 0.2);
}

.discount-text {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  animation: textGlow 2s ease-in-out infinite;
}

.discount-value {
  display: block;
  font-size: 1.8rem;
  font-weight: 800;
  margin: 4px 0;
  animation: valuePulse 1.5s ease-in-out infinite;
  background: linear-gradient(45deg, #ffd700, #ff6b00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.discount-off {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  animation: slideInUp 1s ease-in-out infinite alternate;
}

@keyframes discountPulse {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    box-shadow: 
      0 10px 30px rgba(255, 215, 0, 0.3),
      inset 0 0 20px rgba(255, 255, 255, 0.2);
  }
  50% {
    transform: scale(1.05) rotate(5deg);
    box-shadow: 
      0 15px 40px rgba(255, 215, 0, 0.5),
      inset 0 0 30px rgba(255, 255, 255, 0.3);
  }
}

@keyframes textGlow {
  0%, 100% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
  50% {
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
  }
}

@keyframes valuePulse {
  0%, 100% {
    transform: scale(1);
    filter: hue-rotate(0deg);
  }
  50% {
    transform: scale(1.1);
    filter: hue-rotate(45deg);
  }
}

@keyframes rotate3D {
  0%, 100% {
    transform: rotateY(0deg) rotateX(0deg);
  }
  25% {
    transform: rotateY(10deg) rotateX(5deg);
  }
  50% {
    transform: rotateY(0deg) rotateX(10deg);
  }
  75% {
    transform: rotateY(-10deg) rotateX(5deg);
  }
}

/* Animação de float atualizada */
@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotateY(0deg); 
  }
  50% { 
    transform: translateY(-15px) rotateY(10deg); 
  }
}

/* Ajustes específicos para mobile */
@media (max-width: 768px) {
  .floating-discount {
    padding: 20px 15px; /* Padding ainda menor em mobile */
    min-width: 120px;
    min-height: 120px;
    border-radius: 16px; /* Bordas ainda mais suaves */
  }
  
  .discount-value {
    font-size: 1.6rem; /* Tamanho reduzido do valor */
  }
  
  .discount-text, .discount-off {
    font-size: 0.8rem; /* Texto menor */
  }
}

@media (max-width: 480px) {
  .floating-discount {
    padding: 15px 12px;
    min-width: 100px;
    min-height: 100px;
    border-radius: 12px; /* Quase retangular em telas muito pequenas */
  }
  
  .discount-value {
    font-size: 1.4rem;
  }
}

/* Efeito de partículas no background */
.hero-background::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 2px, transparent 2px),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 2px, transparent 2px),
    radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 100px 100px, 150px 150px, 200px 200px;
  animation: particlesMove 20s linear infinite;
  z-index: 2;
}

@keyframes particlesMove {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-100px);
  }
}

/* Stats Bar Modernizada */
.stats-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 32px 0;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #bd6513;
  margin-bottom: 4px;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

/* Filtros Section Modernizada */
.filters-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin: 32px 0;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f5f5f5;
}

.filters-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
  font-weight: 600;
}

.results-count {
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
}

.filters-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-label {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.filter-chips {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 2px solid #e8e8e8;
  border-radius: 25px;
  background: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;
  font-weight: 500;
}

.filter-chip:hover {
  border-color: #bd6513;
  color: #bd6513;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(189, 101, 19, 0.1);
}

.filter-chip.active {
  background: #bd6513;
  border-color: #bd6513;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(189, 101, 19, 0.2);
}

.filter-actions {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 300px;
}

.search-input {
  width: 100%;
}

.sort-group {
  min-width: 200px;
}

.sort-select {
  width: 100%;
}

/* Products Grid - 2 CARDS POR LINHA EM DISPOSITIVOS MENORES */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin: 32px 0;
}

.product-card {
  position: relative;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #f5f5f5;
  animation: cardEnter 0.6s ease-out;
}

@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: #e8e8e8;
}

/* Badges Modernizados */
.discount-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: #bd6513;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(189, 101, 19, 0.3);
}

.hot-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #ff6b35;
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
}

.product-image-container {
  position: relative;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.image-placeholder {
  width: 100%;
  height: 250px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
}

.product-image-container:hover .image-overlay {
  opacity: 1;
}

.overlay-btn {
  background: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  color: #333;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.overlay-btn:hover {
  background: #bd6513;
  color: white;
  transform: translateY(-2px);
}

.product-actions {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.3s ease;
}

.product-card:hover .product-actions {
  opacity: 1;
  transform: translateX(0);
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  color: #666;
}

.action-btn:hover {
  background: #bd6513;
  color: white;
  transform: scale(1.1);
}

.action-btn.active {
  background: #bd6513;
  color: white;
}

.product-info {
  padding: 20px;
}

.product-category {
  color: #bd6513;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.price-section {
  margin-bottom: 16px;
}

.price-original {
  color: #999;
  text-decoration: line-through;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.price-current {
  font-size: 1.3rem;
  font-weight: 700;
  color: #bd6513;
  margin-bottom: 4px;
}

.price-savings {
  color: #00a651;
  font-size: 0.8rem;
  font-weight: 600;
}

.offer-timer {
  margin-bottom: 16px;
}

.timer-content {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  color: #bd6513;
  font-size: 0.8rem;
  font-weight: 600;
}

.timer-bar {
  height: 4px;
  background: #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
}

.timer-progress {
  height: 100%;
  background: #bd6513;
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* Ações do Produto - BOTÕES "ADICIONAR" E "COMPRAR AGORA" DE VOLTA */
.product-actions-bottom {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 12px;
}

.add-to-cart-btn {
  background: #bd6513;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.add-to-cart-btn:hover {
  background: #a55611;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(189, 101, 19, 0.3);
}

.buy-now-btn {
  background: white;
  color: #bd6513;
  border: 2px solid #bd6513;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.buy-now-btn:hover {
  background: #bd6513;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(189, 101, 19, 0.3);
}

/* Load More Section */
.load-more-section {
  text-align: center;
  margin: 60px 0;
}

.load-more-btn {
  border-color: #bd6513;
  color: #bd6513;
  padding: 12px 32px;
}

.load-more-btn:hover {
  background: #bd6513;
  color: white;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #666;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin: 20px 0 12px;
  color: #333;
}

.empty-state p {
  margin-bottom: 30px;
}

.empty-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.reset-filters-btn {
  border-color: #bd6513;
  color: #bd6513;
}

.reset-filters-btn:hover {
  background: #bd6513;
  color: white;
}

.retry-btn {
  background: #bd6513;
  color: white;
}

.retry-btn:hover {
  background: #a55611;
}

/* Quick View Modal Modernizada */
.quick-view-modal {
  width: 95vw;
  height: 95vh;
  max-width: 1200px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.modal-header {
  background: white;
  border-bottom: 1px solid #f0f0f0;
  padding: 20px 30px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.product-title-section {
  flex: 1;
}

.product-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.category-badge {
  background: #bd6513;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.stock-info {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #00a651;
  font-size: 0.9rem;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-icon, .close-btn {
  color: #666;
  transition: all 0.3s ease;
}

.action-icon:hover, .close-btn:hover {
  color: #bd6513;
  transform: scale(1.1);
}

.modal-content {
  padding: 0;
  height: calc(100% - 80px);
  overflow-y: auto;
}

.product-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100%;
  gap: 0;
}

.gallery-column {
  background: #fafafa;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-image-container {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  background: white;
}

.main-image {
  border-radius: 16px;
  background: white;
}

.image-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  background: #f5f5f5;
}

.image-badges {
  position: absolute;
  top: 15px;
  left: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;
}

.discount-badge-large {
  background: #bd6513;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(189, 101, 19, 0.3);
}

.info-column {
  padding: 30px;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 25px;
  overflow-y: auto;
}

.pricing-section {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 20px;
}

.price-display {
  margin-bottom: 15px;
}

.original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 1.2rem;
  margin-bottom: 5px;
}

.current-price {
  font-size: 2.5rem;
  font-weight: 700;
  color: #bd6513;
  margin-bottom: 8px;
}

.savings {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #00a651;
  font-weight: 600;
  font-size: 0.9rem;
}

.promotion-timer-card {
  background: #fff9f0;
  border: 1px solid #ffe0b2;
  border-radius: 12px;
  padding: 20px;
  margin: 15px 0;
}

.timer-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #bd6513;
}

.timer-title {
  font-weight: 600;
}

.timer-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 12px;
}

.time-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  padding: 8px 12px;
  border-radius: 8px;
  min-width: 60px;
  border: 1px solid #f0f0f0;
}

.time-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #bd6513;
}

.time-label {
  font-size: 0.7rem;
  color: #666;
  text-transform: uppercase;
}

.time-separator {
  font-size: 1.2rem;
  font-weight: 700;
  color: #bd6513;
  margin-top: -8px;
}

.timer-progress {
  height: 6px;
  border-radius: 3px;
  background: #f0f0f0;
}

.timer-progress .q-linear-progress__model {
  background: #bd6513;
}

.purchase-actions {
  background: #fafafa;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #f0f0f0;
}

.quantity-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.quantity-label {
  font-weight: 600;
  color: #333;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 15px;
  background: white;
  padding: 8px 16px;
  border-radius: 25px;
  border: 1px solid #e0e0e0;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  color: #666;
}

.quantity-btn:hover {
  color: #bd6513;
}

.quantity-value {
  font-weight: 600;
  font-size: 1.1rem;
  min-width: 30px;
  text-align: center;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 15px;
}

.cart-btn, .buy-btn {
  flex: 1;
  height: 50px;
  font-weight: 600;
  border-radius: 12px;
}

.cart-btn {
  background: #bd6513;
  color: white;
}

.cart-btn:hover {
  background: #a55611;
}

.buy-btn {
  background: white;
  color: #bd6513;
  border: 2px solid #bd6513;
}

.buy-btn:hover {
  background: #bd6513;
  color: white;
}

.secure-purchase {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #666;
  font-size: 0.9rem;
}

.modal-footer {
  background: white;
  border-top: 1px solid #f0f0f0;
  padding: 15px 20px;
  position: sticky;
  bottom: 0;
  z-index: 100;
}

.mobile-actions {
  display: flex;
  gap: 10px;
}

.mobile-cart-btn, .mobile-buy-btn {
  flex: 1;
  height: 45px;
  font-weight: 600;
}

.mobile-cart-btn {
  background: #bd6513;
  color: white;
}

.mobile-buy-btn {
  background: white;
  color: #bd6513;
  border: 2px solid #bd6513;
}

/* Skeleton Loading */
.skeleton {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #f5f5f5;
}

.skeleton-image {
  height: 250px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-content {
  padding: 20px;
}

.skeleton-line {
  height: 12px;
  background: #f0f0f0;
  margin-bottom: 8px;
  border-radius: 6px;
  animation: loading 1.5s infinite;
}

.skeleton-line.short {
  width: 60%;
}

.skeleton-line.medium {
  width: 80%;
}

.skeleton-price {
  height: 20px;
  width: 40%;
  background: #f0f0f0;
  margin: 16px 0;
  border-radius: 6px;
  animation: loading 1.5s infinite;
}

.skeleton-button {
  height: 40px;
  background: #f0f0f0;
  border-radius: 8px;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* RESPONSIVIDADE - 2 CARDS POR LINHA EM DISPOSITIVOS MENORES */
@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 cards por linha */
    gap: 16px;
  }
  
  .product-card {
    min-height: 380px;
  }
  
  .product-image {
    height: 180px;
  }
  
  .product-info {
    padding: 16px;
  }
  
  .product-name {
    font-size: 1rem;
    margin-bottom: 12px;
  }
  
  .price-current {
    font-size: 1.1rem;
  }
  
  .product-actions-bottom {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .add-to-cart-btn, .buy-now-btn {
    padding: 10px;
    font-size: 0.8rem;
  }
  
  /* Ajustes para badges em mobile */
  .discount-badge {
    top: 12px;
    left: 12px;
    padding: 6px 10px;
    font-size: 0.7rem;
  }
  
  .hot-badge {
    top: 12px;
    right: 12px;
    padding: 4px 8px;
    font-size: 0.6rem;
  }
  
  .product-actions {
    top: 12px;
    right: 12px;
    gap: 6px;
  }
  
  .action-btn {
    width: 32px;
    height: 32px;
  }
  
  .action-btn q-icon {
    font-size: 16px;
  }
  
  /* Ajustes para overlay em mobile */
  .image-overlay {
    padding: 10px;
  }
  
  .overlay-btn {
    padding: 8px 16px;
    font-size: 0.8rem;
  }
  
  .overlay-btn q-icon {
    font-size: 14px;
  }

  /* Ajustes gerais para mobile */
  .typed-title {
    animation: 
      typingMobile 1.2s steps(15, end),
      blinkCursor 0.8s step-end infinite;
    white-space: normal;
    border-right: none;
    font-size: 2.5rem;
  }

  @keyframes typingMobile {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }

  .pulse-discount {
    animation: 
      float 3s ease-in-out infinite,
      discountPulse 2s ease-in-out infinite;
  }

  .discount-value {
    font-size: 1.4rem;
  }

  .promotions-hero {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 24px;
    padding: 40px 20px;
    min-height: 400px;
  }

  .hero-features {
    justify-content: center;
  }

  .filter-actions {
    flex-direction: column;
    width: 100%;
  }

  .search-input {
    min-width: 100%;
  }

  .product-layout {
    grid-template-columns: 1fr;
  }

  .quick-view-modal {
    width: 98vw;
    height: 98vh;
  }

  .stats-bar {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .filters-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .empty-actions {
    flex-direction: column;
    align-items: center;
  }

  .modal-header {
    padding: 15px 20px;
  }

  .product-title {
    font-size: 1.2rem;
  }

  .current-price {
    font-size: 2rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .gallery-column, .info-column {
    padding: 15px;
  }

  .timer-display {
    gap: 5px;
  }

  .time-unit {
    min-width: 50px;
    padding: 6px 8px;
  }

  .time-value {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr); /* Mantém 2 cards por linha */
    gap: 12px;
  }
  
  .product-card {
    min-height: 350px;
  }
  
  .product-image {
    height: 150px;
  }
  
  .product-info {
    padding: 12px;
  }
  
  .product-category {
    font-size: 0.7rem;
  }
  
  .product-name {
    font-size: 0.9rem;
    margin-bottom: 8px;
  }
  
  .price-section {
    margin-bottom: 12px;
  }
  
  .price-original {
    font-size: 0.8rem;
  }
  
  .price-current {
    font-size: 1rem;
  }
  
  .price-savings {
    font-size: 0.7rem;
  }
  
  .offer-timer {
    margin-bottom: 12px;
  }
  
  .timer-content {
    font-size: 0.7rem;
  }
  
  .add-to-cart-btn, .buy-now-btn {
    padding: 8px;
    font-size: 0.75rem;
  }
  
  .add-to-cart-btn q-icon, .buy-now-btn q-icon {
    font-size: 14px;
  }

  .hero-features {
    flex-direction: column;
    gap: 12px;
  }

  .filter-chips {
    justify-content: center;
  }

  .filter-chip {
    flex: 1;
    min-width: 120px;
    justify-content: center;
  }

  .hero-title {
    font-size: 2rem;
  }

  .floating-discount {
    min-width: 120px;
    min-height: 120px;
    font-size: 1rem;
  }

  .banner-image {
    opacity: 0.1;
  }
}

/* Ajustes específicos para telas muito pequenas */
@media (max-width: 360px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  .product-card {
    min-height: 320px;
  }
  
  .product-image {
    height: 130px;
  }
  
  .product-info {
    padding: 10px;
  }
  
  .product-name {
    font-size: 0.85rem;
    line-height: 1.3;
  }
  
  .price-current {
    font-size: 0.9rem;
  }
  
  .add-to-cart-btn, .buy-now-btn {
    padding: 6px;
    font-size: 0.7rem;
  }
}

/* Correção específica para a imagem do banner */
.hero-background .banner-image {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center;
  opacity: 0.15;
}
</style>