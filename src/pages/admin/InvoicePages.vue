<template>
  <q-page padding>
    <div class="invoice-card">
      <q-card-section>
        <div class="invoice-header">
          <div class="logo text-center">
            <h5>KLC Market</h5>
          </div>
          <p><strong>Identificação da Conta:</strong> {{ owner }}</p>
          <p><strong>Username:</strong> @{{ ownerUsername }}</p>
          <p><strong>Data de Emissão:</strong> {{ currentDate }}</p>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="details row justify-between">
          <div class="col-5">
            <q-item-label>
              <strong>Total de Produtos Vendidos:</strong>
              {{ total_produtos_vendidos }}
              <!-- Contagem dos produtos vendidos -->
            </q-item-label>
            <q-item-label>
              <strong>Valor Total Vendido:</strong>
              {{ totalSales.toFixed(2) }} MZN
            </q-item-label>
          </div>

          <div class="col-5">
            <q-item-label>
              <strong>Taxa (5%):</strong>  {{ totalFees.toFixed(2) }} MZN
            </q-item-label>
            <q-item-label>
              <strong>Status do Pagamento: </strong>
              <span
                :class="{
                  'text-green': paymentStatus === 'PAGO',
                  'text-red':
                    paymentStatus === 'PENDENTE' ||
                    paymentStatus === 'NAO PAGO',
                }"
              >
                {{ paymentStatus }}
              </span>
            </q-item-label>
            <q-item-label v-if="dataUltimaFatura">
              <strong>Data da Última Fatura:</strong>
              {{ formatDate(dataUltimaFatura) }}
            </q-item-label>
            <q-item-label v-else>
              <strong>Data da Última Fatura:</strong> Não disponível
            </q-item-label>
          </div>
          <q-card class="q-mb-md col-12">
            <q-table :rows="sales" :columns="columns" title="" />
          </q-card>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn color="primary" label="Atualizar Fatura"  v-if="false"/>
        <q-btn
          @click="sendInvoiceByEmail"
          color="secondary"
            v-if="false"
          label="Enviar por E-mail"
        />
        <q-btn @click="printInvoice" color="accent" label="Imprimir" />
      </q-card-actions>

      <q-banner
        v-if="alertMessage"
        class="q-mt-md"
        color="red"
        text-color="white"
      >
        {{ alertMessage }}
      </q-banner>
    </div>
  </q-page>
</template>

<script>
import { ref, computed } from "vue";
import apiMethods from "src/router/api.js";

export default {
  name: "InvoiceP",
  mounted() {
    this.fetchEstatisticas();
    // this.ListHistoryPackages();
    // this.fetchMensagens();
  },
  methods: {
    async fetchEstatisticas() {
      try {
        const response = await apiMethods.invoice();
        this.sales = response.data.sales;
        this.total_produtos_vendidos = response.data.total_produtos_vendidos;
        this.totalSales = response.data.valor_total_vendido;

        this.totalFees = response.data.taxa;
        this.paymentStatus = response.data.status_pagamento;
        this.dataUltimaFatura = response.data.data_ultima_fatura;

        this.owner = response.data.owner.name;
        this.ownerUsername = response.data.owner.username;
        this.ownerId = response.data.owner.id;

        // console.log(response.data);
      } catch (error) {
        this.carregando = false;

        console.error("Erro ao buscar estatísticas:", error);
      }
    },
  },
  setup() {
    // Dados estáticos
    const sales = ref([]);

    // const totalSales = computed(() =>
    //   sales.value.reduce((sum, sale) => sum + sale.value, 0)
    // );
    const owner = ref("");
    const ownerUsername = ref("");
    const ownerId = ref("");
    const total_produtos_vendidos = ref(0);

    const totalSales = ref(0);

    const totalFees = ref(0);
    const paymentStatus = ref("PENDENTE"); // Status do pagamento
    const alertMessage = ref("");

    const columns = [
      { name: "date", label: "Data da Venda", align: "left", field: "date" },
      { name: "product", label: "Produto", align: "left", field: "product" },
      { name: "qty", label: "Qtd", align: "left", field: "qty" },
      {
        name: "value",
        label: "Valor da Venda",
        align: "right",
        field: "value",
      },
      { name: "fee", label: "Taxa (5%)", align: "right", field: "fee" },
      { name: "net", label: "Valor Líquido", align: "right", field: "net" },
    ];

    const currentDate = new Date().toLocaleDateString();
    const dataUltimaFatura = null; // Defina uma data de última fatura se necessário

    const formatDate = (dateString) => {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const sendInvoiceByEmail = () => {
      alertMessage.value = "Fatura enviada por e-mail!"; // Implementar lógica real
    };

    const printInvoice = () => {
      window.print(); // Imprimir a fatura
    };

    return {
      owner,
      ownerUsername,
      ownerId,
      sales,
      columns,
      totalSales,
      totalFees,
      total_produtos_vendidos,
      paymentStatus,
      alertMessage,
      currentDate,
      formatDate,
      dataUltimaFatura,
      sendInvoiceByEmail,
      printInvoice,
    };
  },
};
</script>

<style scoped>
.invoice-card {
  padding: 20px;
}

.logo h5 {
  font-size: 24px;
  color: #bd6513;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: bold;
  margin-bottom: 10px;
}

.details {
  display: flex;
  gap: 10px;
}

.text-green {
  color: green;
}

.text-red {
  color: red;
}
</style>
