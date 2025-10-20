<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-my-md">Depoimentos de Clientes</div>
    <q-card flat bordered class="q-mb-md" v-for="testimonial in testimonials" :key="testimonial.id">
      <q-card-section>
        <div class="text-subtitle1">{{ testimonial.name }}</div>
        <div class="text-caption">{{ testimonial.message }}</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      testimonials: [
        { id: 1, name: 'Cliente 1', message: 'Ótimo serviço, recomendo!' },
        { id: 2, name: 'Cliente 2', message: 'Produtos de qualidade e entrega rápida.' },
        { id: 3, name: 'Cliente 3', message: 'Muito satisfeito com a compra.' }
      ]
    }
  }
}
</script>
