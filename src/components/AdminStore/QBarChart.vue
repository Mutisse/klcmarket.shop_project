<template>
  <q-bar-chart :data="data" :options="options" />
  <Bar/>
</template>

<script>
import { ref } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  components: { Bar },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup() {
    const options = ref({
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'Vendas e Taxas'
        }
      }
    });

    return { options };
  }
};
</script>
