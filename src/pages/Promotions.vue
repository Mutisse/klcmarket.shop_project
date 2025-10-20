<template>
  <div class="promotions-page">
    <!-- Header Component -->
    <HeaderC />

    <!-- Conteúdo Principal -->
    <div class="page-content">
      <!-- Header com Banner de Background -->
      <div class="promotions-hero">
        <div class="hero-background">
          <img src="~assets/banner 1 desktop.png" class="banner-image" alt="Promoções" />
          <div class="banner-overlay"></div>
        </div>
        <div class="hero-content">
          <div class="hero-badge">🔥 OFERTAS ESPECIAIS</div>
          <h1 class="hero-title">Promoções Imperdíveis</h1>
          <p class="hero-subtitle">Descontos exclusivos selecionados para você</p>
          
          <div class="hero-features">
            <div class="feature">
              <q-icon name="verified" color="green" />
              <span>Produtos verificados</span>
            </div>
            <div class="feature">
              <q-icon name="local_shipping" color="blue" />
              <span>Entrega rápida</span>
            </div>
            <div class="feature">
              <q-icon name="security" color="orange" />
              <span>Compra segura</span>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="floating-discount">ATÉ 70% OFF</div>
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
              <div class="skeleton-line long"></div>
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
              <div class="discount-ribbon"></div>
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
                    <q-spinner-rings color="#f27c38" size="2em" />
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
                <button class="action-btn compare" @click.stop="addToCompare(product)">
                  <q-icon name="compare_arrows" />
                </button>
              </div>
            </div>

            <!-- Informações do Produto -->
            <div class="product-info">
              <div class="product-category">{{ product.category || 'Geral' }}</div>
              
              <h3 class="product-name" :title="product.name">{{ product.name }}</h3>
              
              <p class="product-description">{{ truncateDescription(product.description) }}</p>
              
              <!-- Rating -->
              <div class="product-rating">
                <div class="stars">
                  <q-icon 
                    v-for="n in 5" 
                    :key="n"
                    :name="n <= Math.floor(product.rating || 4.5) ? 'star' : 'star_border'"
                    :color="n <= Math.floor(product.rating || 4.5) ? 'orange' : 'grey-4'"
                    size="16px"
                  />
                </div>
                <span class="rating-value">{{ product.rating || '4.5' }}</span>
                <span class="rating-count">({{ product.reviewCount || '125' }})</span>
              </div>

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

              <!-- Ações do Produto -->
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
          color="primary"
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
            color="primary" 
            outline
            class="reset-filters-btn"
          >
            Limpar Filtros
          </q-btn>
          <q-btn 
            @click="fetchPromotionProducts" 
            color="primary"
            class="retry-btn"
          >
            Recarregar
          </q-btn>
        </div>
      </div>
    </div>

    <!-- Footer Component -->
    <FooterC />

    <!-- Quick View Modal Profissional -->
    <q-dialog v-model="showQuickView" maximized>
      <q-card class="quick-view-modal" v-if="selectedProduct">
        <!-- Header Fixo -->
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

        <!-- Conteúdo Principal com Scroll -->
        <q-card-section class="modal-content">
          <div class="product-layout">
            <!-- Coluna da Galeria -->
            <div class="gallery-column">
              <!-- Imagem Principal -->
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
                      <q-spinner-ores size="3em" color="primary" />
                    </div>
                  </template>
                  
                  <!-- Badges sobre a imagem -->
                  <div class="image-badges">
                    <div class="discount-badge-large" v-if="selectedProduct.discountPercentage > 0">
                      -{{ selectedProduct.discountPercentage }}% OFF
                    </div>
                    <div class="featured-badge" v-if="selectedProduct.rating > 4.7">
                      <q-icon name="whatshot" />
                      Mais Vendido
                    </div>
                  </div>
                </q-img>
              </div>

              <!-- Miniaturas -->
              <div class="thumbnails" v-if="selectedProduct.images && selectedProduct.images.length > 1">
                <div 
                  v-for="(image, index) in selectedProduct.images" 
                  :key="index"
                  class="thumbnail"
                  :class="{ active: activeImageIndex === index }"
                  @click="activeImageIndex = index"
                >
                  <q-img
                    :src="getImageUrl(image)"
                    :alt="`${selectedProduct.name} - Imagem ${index + 1}`"
                    class="thumbnail-image"
                    ratio="1"
                  />
                </div>
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
                    <q-icon name="savings" color="green" />
                    Economize {{ formatPrice(selectedProduct.price - selectedProduct.price_discount) }} MT
                  </div>
                </div>

                <!-- Rating e Reviews -->
                <div class="rating-section">
                  <div class="rating-display">
                    <div class="stars">
                      <q-icon 
                        v-for="n in 5" 
                        :key="n"
                        :name="n <= Math.floor(selectedProduct.rating || 4.5) ? 'star' : 'star_border'"
                        color="orange"
                        size="20px"
                      />
                    </div>
                    <div class="rating-text">
                      <strong>{{ selectedProduct.rating || '4.5' }}</strong>
                      <span class="review-count">({{ selectedProduct.reviewCount || '125' }} avaliações)</span>
                    </div>
                  </div>
                  <q-btn 
                    flat 
                    dense 
                    label="Ver todas as avaliações" 
                    color="primary"
                    class="reviews-btn"
                  />
                </div>
              </div>

              <!-- Timer de Promoção -->
              <div class="promotion-timer-card" v-if="selectedProduct.promotionEnds">
                <div class="timer-header">
                  <q-icon name="schedule" color="red" />
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
                  color="red"
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
                    color="primary" 
                    icon="add_shopping_cart" 
                    label="Adicionar ao Carrinho"
                    @click="addToCart(selectedProduct, quantity)"
                    class="cart-btn"
                    size="lg"
                  />
                  <q-btn 
                    color="positive" 
                    icon="flash_on" 
                    label="Comprar Agora"
                    @click="buyNow(selectedProduct, quantity)"
                    class="buy-btn"
                    size="lg"
                  />
                </div>

                <div class="secure-purchase">
                  <q-icon name="verified_user" color="green" />
                  <span>Compra 100% segura e protegida</span>
                </div>
              </div>

              <!-- Descrição Expandida -->
              <div class="description-section">
                <h3 class="section-title">Descrição do Produto</h3>
                <p class="product-description-full">{{ selectedProduct.description }}</p>
                
                <div class="product-highlights">
                  <h4>Destaques:</h4>
                  <ul class="highlights-list">
                    <li v-for="(highlight, index) in getProductHighlights(selectedProduct)" :key="index">
                      <q-icon name="check_circle" color="green" />
                      {{ highlight }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Características -->
              <div class="features-section">
                <h3 class="section-title">Características</h3>
                <div class="features-grid">
                  <div class="feature-item">
                    <q-icon name="local_shipping" color="blue" />
                    <div class="feature-content">
                      <div class="feature-title">Entrega Rápida</div>
                      <div class="feature-desc">Receba em 2-3 dias úteis</div>
                    </div>
                  </div>
                  <div class="feature-item">
                    <q-icon name="assignment_return" color="orange" />
                    <div class="feature-content">
                      <div class="feature-title">Devolução Grátis</div>
                      <div class="feature-desc">30 dias para devolução</div>
                    </div>
                  </div>
                  <div class="feature-item">
                    <q-icon name="security" color="green" />
                    <div class="feature-content">
                      <div class="feature-title">Garantia</div>
                      <div class="feature-desc">12 meses de garantia</div>
                    </div>
                  </div>
                  <div class="feature-item">
                    <q-icon name="support_agent" color="purple" />
                    <div class="feature-content">
                      <div class="feature-title">Suporte 24/7</div>
                      <div class="feature-desc">Atendimento sempre disponível</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Especificações Técnicas -->
              <div class="specs-section" v-if="selectedProduct.specifications">
                <h3 class="section-title">Especificações Técnicas</h3>
                <div class="specs-table">
                  <div 
                    v-for="(spec, key) in selectedProduct.specifications" 
                    :key="key"
                    class="spec-row"
                  >
                    <div class="spec-label">{{ formatSpecKey(key) }}:</div>
                    <div class="spec-value">{{ spec }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <!-- Footer Fixo para Mobile -->
        <q-card-section class="modal-footer" v-if="$q.screen.lt.md">
          <div class="mobile-actions">
            <q-btn 
              color="primary" 
              icon="add_shopping_cart" 
              label="Adicionar"
              @click="addToCart(selectedProduct, quantity)"
              class="mobile-cart-btn"
            />
            <q-btn 
              color="positive" 
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

    const getProductHighlights = (product) => {
      const highlights = [
        'Produto de alta qualidade',
        'Material durável e resistente',
        'Design moderno e elegante',
        'Fácil de usar e manter'
      ]
      
      if (product.discountPercentage > 30) {
        highlights.unshift('Oferta especial com desconto exclusivo')
      }
      if (product.rating > 4.5) {
        highlights.unshift('Avaliação excelente pelos clientes')
      }
      
      return highlights.slice(0, 4)
    }

    const formatSpecKey = (key) => {
      const specNames = {
        'weight': 'Peso',
        'dimensions': 'Dimensões',
        'material': 'Material',
        'color': 'Cor',
        'warranty': 'Garantia',
        'brand': 'Marca'
      }
      return specNames[key] || key
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

    const addToCompare = (product) => {
      $q.notify({
        message: `${product.name} adicionado à comparação`,
        color: 'info',
        position: 'top'
      })
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

    const truncateDescription = (description, length = 80) => {
      if (!description) return 'Descrição não disponível'
      return description.length > length 
        ? description.substring(0, length) + '...' 
        : description
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
      addToCompare,
      buyNow,
      quickView,
      getImageUrl,
      truncateDescription,
      formatPrice,
      formatTimeRemaining,
      getTimeProgress,
      getTimeUnits,
      getProductHighlights,
      formatSpecKey,
      shareProduct
    }
  }
}
</script>

<style scoped>
.promotions-page {
  min-height: 100vh;
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

/* 🎨 Hero Section com Banner de Background */
.promotions-hero {
  position: relative;
  border-radius: 24px;
  padding: 60px 40px;
  margin: 24px 0;
  color: white;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 40px;
  align-items: center;
  overflow: hidden;
  min-height: 400px;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* 🎨 Overlay com tonalidade mais suave */
.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(242, 124, 56, 0.6) 0%,        /* Laranja principal mais suave */
    rgba(255, 165, 0, 0.4) 50%,       /* Laranja médio */
    rgba(255, 140, 0, 0.3) 100%       /* Laranja escuro suave */
  );
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

/* 🎨 Badge com tonalidade vibrante */
.hero-badge {
  background: linear-gradient(135deg, #ff8c00, #ffa500); /* Laranja vibrante */
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(255, 140, 0, 0.3);
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 40px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.hero-features {
  display: flex;
  gap: 24px;
}

/* 🎨 Features com tonalidade suave */
.feature {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  opacity: 0.9;
  background: rgba(255, 165, 0, 0.2); /* Laranja muito suave */
  padding: 8px 16px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 165, 0, 0.3);
}

/* 🎨 Floating Discount com tonalidade média */
.floating-discount {
  background: linear-gradient(135deg, #ff7b00, #ff9500); /* Laranja médio */
  padding: 20px;
  border-radius: 50%;
  font-size: 1.2rem;
  font-weight: 700;
  backdrop-filter: blur(10px);
  animation: float 3s ease-in-out infinite;
  border: 2px solid rgba(255, 255, 255, 0.3);
  text-align: center;
  min-width: 120px;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(255, 123, 0, 0.4);
}

@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-10px) scale(1.05); }
}

/* 🎨 Stats Bar */
.stats-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 32px 0;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
}

.stat-item {
  text-align: center;
}

/* 🎨 Estatísticas com gradiente laranja */
.stat-value {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f27c38, #ff8c00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

/* 🎨 Filtros Section */
.filters-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin: 32px 0;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
}

/* 🎨 Filtros - Borda inferior laranja */
.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 3px solid #f27c38; /* Borda laranja */
  background: linear-gradient(to right, #f27c38, transparent);
  background-size: 100% 3px;
  background-repeat: no-repeat;
  background-position: bottom;
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
  border: 2px solid #e1e5e9;
  border-radius: 25px;
  background: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;
  font-weight: 500;
}

.filter-chip:hover {
  border-color: #f27c38;
  color: #f27c38;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(242, 124, 56, 0.1);
}

/* 🎨 Filtros Ativos - Gradiente laranja diferente */
.filter-chip.active {
  background: linear-gradient(135deg, #ff6b00, #ff8c00); /* Laranja mais quente */
  border-color: #ff6b00;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3);
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

/* 🎨 Products Grid */
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
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

/* 🎨 Badge de Desconto com tonalidade vibrante */
.discount-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: linear-gradient(135deg, #ff8c00, #ffa500); /* Laranja vibrante */
  color: white;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 700;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 4px 8px rgba(255, 140, 0, 0.3);
}

.discount-ribbon {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 6px solid #ff8c00;
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
}

/* 🎨 Hot Badge com tonalidade avermelhada */
.hot-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: linear-gradient(135deg, #ff4500, #ff6347); /* Laranja avermelhado */
  color: white;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 4px 8px rgba(255, 69, 0, 0.3);
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
  background: #f27c38;
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
}

.action-btn:hover {
  background: #f27c38;
  color: white;
  transform: scale(1.1);
}

.action-btn.active {
  background: #f27c38;
  color: white;
}

.product-info {
  padding: 20px;
}

.product-category {
  color: #f27c38;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-description {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.stars {
  display: flex;
  gap: 2px;
}

.rating-value {
  font-weight: 600;
  color: #333;
  margin: 0 4px;
}

.rating-count {
  color: #666;
  font-size: 0.8rem;
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

/* 🎨 Preços com gradiente laranja */
.price-current {
  font-size: 1.3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f27c38, #ff8c00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
}

.price-savings {
  color: #00c851;
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
  color: #ff6b35;
  font-size: 0.8rem;
  font-weight: 600;
}

.timer-bar {
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
}

/* 🎨 Timer com gradiente laranja */
.timer-progress {
  height: 100%;
  background: linear-gradient(90deg, #ff8c00, #ffa500, #ff6b00);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.product-actions-bottom {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 12px;
}

/* 🎨 Botão Carrinho com gradiente */
.add-to-cart-btn {
  background: linear-gradient(135deg, #f27c38, #ff8c00); /* Do principal para laranja */
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
  background: linear-gradient(135deg, #d26932, #e67e22);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(242, 124, 56, 0.3);
}

/* 🎨 Botão Comprar com gradiente invertido */
.buy-now-btn {
  background: linear-gradient(135deg, #ff6b00, #f27c38); /* Invertido */
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.buy-now-btn:hover {
  background: linear-gradient(135deg, #e65c00, #d26932);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3);
}

/* 🎨 Load More Section */
.load-more-section {
  text-align: center;
  margin: 60px 0;
}

.load-more-btn {
  border-color: #f27c38;
  color: #f27c38;
}

.load-more-btn:hover {
  background: #f27c38;
  color: white;
}

/* 🎨 Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #666;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin: 20px 0 12px;
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
  border-color: #f27c38;
  color: #f27c38;
}

.reset-filters-btn:hover {
  background: #f27c38;
  color: white;
}

.retry-btn {
  background: #f27c38;
  color: white;
}

.retry-btn:hover {
  background: #d26932;
}

/* 🎨 Quick View Modal */
.quick-view-modal {
  width: 95vw;
  height: 95vh;
  max-width: 1400px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

/* 🎨 Header Fixo */
.modal-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 20px 30px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
  background: linear-gradient(135deg, #f27c38, #ff8c00);
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
  color: #00c853;
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
  color: #f27c38;
  transform: scale(1.1);
}

/* 🎨 Conteúdo Principal */
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

/* 🎨 Coluna da Galeria */
.gallery-column {
  background: #f8f9fa;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-image-container {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
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
  background: linear-gradient(135deg, #ff4444, #ff6b6b);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(255, 68, 68, 0.3);
}

.featured-badge {
  background: linear-gradient(135deg, #ff8c00, #ffa500);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 🎨 Miniaturas */
.thumbnails {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 10px 0;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.thumbnail.active {
  border-color: #f27c38;
  transform: scale(1.05);
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 🎨 Coluna de Informações */
.info-column {
  padding: 30px;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 25px;
  overflow-y: auto;
}

/* 🎨 Seção de Preços */
.pricing-section {
  border-bottom: 1px solid #e0e0e0;
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
  background: linear-gradient(135deg, #f27c38, #ff8c00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.savings {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #00c853;
  font-weight: 600;
  font-size: 0.9rem;
}

.rating-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rating-display {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stars {
  display: flex;
  gap: 2px;
}

.rating-text {
  display: flex;
  align-items: center;
  gap: 6px;
}

.review-count {
  color: #666;
  font-size: 0.9rem;
}

.reviews-btn {
  font-size: 0.8rem;
}

/* 🎨 Timer de Promoção */
.promotion-timer-card {
  background: linear-gradient(135deg, #fff3e0, #ffecb3);
  border: 1px solid #ffd54f;
  border-radius: 12px;
  padding: 20px;
  margin: 15px 0;
}

.timer-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.timer-title {
  font-weight: 600;
  color: #e65100;
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
}

.time-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #e65100;
}

.time-label {
  font-size: 0.7rem;
  color: #666;
  text-transform: uppercase;
}

.time-separator {
  font-size: 1.2rem;
  font-weight: 700;
  color: #e65100;
  margin-top: -8px;
}

.timer-progress {
  height: 6px;
  border-radius: 3px;
}

/* 🎨 Ações de Compra */
.purchase-actions {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e0e0e0;
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
}

.quantity-value {
  font-weight: 600;
  font-size: 1.1rem;
  min-width: 30px;
  text-align: center;
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
  background: linear-gradient(135deg, #f27c38, #ff8c00);
}

.buy-btn {
  background: linear-gradient(135deg, #00c853, #00e676);
}

.secure-purchase {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #666;
  font-size: 0.9rem;
}

/* 🎨 Seções de Conteúdo */
.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
}

.product-description-full {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.product-highlights {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid #f27c38;
}

.highlights-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.highlights-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  color: #555;
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #f27c38;
}

.feature-content {
  display: flex;
  flex-direction: column;
}

.feature-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.feature-desc {
  color: #666;
  font-size: 0.9rem;
}

.specs-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.spec-row {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 15px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.spec-label {
  font-weight: 600;
  color: #333;
}

.spec-value {
  color: #666;
}

/* 🎨 Footer Mobile */
.modal-footer {
  background: white;
  border-top: 1px solid #e0e0e0;
  padding: 15px 20px;
  position: sticky;
  bottom: 0;
  z-index: 100;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
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

/* Skeleton Loading */
.skeleton {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
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

.skeleton-line.long {
  width: 100%;
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

/* Responsividade */
@media (max-width: 1024px) {
  .promotions-hero {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 24px;
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
  
  .modal-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .quick-view-modal {
    width: 98vw;
    height: 98vh;
  }
  
  .product-layout {
    grid-template-columns: 1fr;
  }
  
  .gallery-column {
    max-height: 400px;
  }
}

@media (max-width: 768px) {
  .stats-bar {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .filters-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }
  
  .product-actions-bottom {
    grid-template-columns: 1fr;
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
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .spec-row {
    grid-template-columns: 1fr;
    gap: 5px;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
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
    min-width: 100px;
    min-height: 100px;
    font-size: 1rem;
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
</style>