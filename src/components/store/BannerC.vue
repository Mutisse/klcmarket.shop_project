<template>
  <q-carousel
    swipeable
    animated
    infinite
    arrows
    thumbnails
    class="bg-grey-3"
  >
    <q-carousel-slide
      v-for="(slide, index) in slides"
      :key="index"
      :name="index"
      :img-src="slide.img"
      :caption="slide.caption"
    />
  </q-carousel>
</template>

<script>
export default {
  data() {
    return {
      slides: [
        { img: 'https://via.placeholder.com/1200x400', caption: 'Promotion 1' },
        { img: 'https://via.placeholder.com/1200x400', caption: 'Promotion 2' },
        { img: 'https://via.placeholder.com/1200x400', caption: 'Promotion 3' }
      ]
    }
  }
}
</script>
