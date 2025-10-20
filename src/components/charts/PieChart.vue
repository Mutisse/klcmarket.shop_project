<template>
  <div>
    <h3>{{ title }}</h3>
    <pie-chart :chart-data="data" :options="options" />
  </div>
</template>

<script>
import { Pie } from 'vue-chartjs/legacy'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

export default {
  name: 'PieChart',
  props: {
    data: Object,
    title: String
  },
  extends: Pie,
  data () {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },
  mounted () {
    this.renderChart(this.data, this.options)
  }
}
</script>
