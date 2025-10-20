<template>
  <q-page>
    <q-toolbar>
      <q-toolbar-title> Relatório de Vendas </q-toolbar-title>
    </q-toolbar>

    <q-table :rows="sales" :columns="columns" title="Tabela Resumida" />

    <div class="summary">
      <h5>Sumário Final</h5>
      <div>Total de Vendas: {{ totalSales }} MZN</div>
      <div>Taxa Total: {{ totalFees }} MZN</div>
      <div>Valor a Pagar: {{ totalFees }} MZN</div>
    </div>
  </q-page>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const sales = ref([
      { date: "2024-10-01", product: "Produto A", value: 100, fee: 5, net: 95 },
      {
        date: "2024-10-02",
        product: "Produto B",
        value: 200,
        fee: 10,
        net: 190,
      },
      // Adicione mais dados conforme necessário
    ]);

    const totalSales = computed(() =>
      sales.value.reduce((sum, sale) => sum + sale.value, 0)
    );
    const totalFees = computed(() => totalSales.value * 0.05);

    const columns = [
      { name: "date", label: "Data da Venda", align: "left", field: "date" },
      { name: "product", label: "Produto", align: "left", field: "product" },
      {
        name: "value",
        label: "Valor da Venda",
        align: "right",
        field: "value",
      },
      { name: "fee", label: "Taxa (5%)", align: "right", field: "fee" },
      { name: "net", label: "Valor Líquido", align: "right", field: "net" },
    ];

    return { sales, totalSales, totalFees, columns };
  },
};
</script>

<style scoped>
.summary {
  margin-top: 16px;
}
</style>
