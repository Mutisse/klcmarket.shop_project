<template>
  <q-div class="q-pa-md">
    <div class="text-h5 q-my-md">Categorias</div>
    <q-btn-group spread>
      <q-btn v-for="category in categories" :key="category.name" outline @click="goToCategory(category.name)">
        <q-icon :name="category.icon" />
        {{ category.name }}
      </q-btn>
    </q-btn-group>
  </q-div>
</template>

<script>
export default {
  data() {
    return {
      categories: [
        { name: 'Eletrônicos', icon: 'devices' },
        { name: 'Roupas', icon: 'shopping_bag' },
        { name: 'Alimentos', icon: 'restaurant' },
        { name: 'Livros', icon: 'book' }
      ]
    }
  },
  methods: {
    goToCategory(category) {
      this.$router.push({ path: '/category/' + category })
    }
  }
}
</script>
