<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Relatórios</div>
    </q-card-section>
    <q-card-section>
      <q-select v-model="reportType" :options="reportTypes" label="Tipo de Relatório" />
      <q-btn label="Gerar Relatório" @click="generateReport" />
      <div v-if="reportData">
        <q-table :rows="reportData" :columns="columns" row-key="id" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  data() {
    return {
      reportType: '',
      reportTypes: [
        { label: 'Usuários Ativos', value: 'activeUsers' },
        { label: 'Entregas Pendentes', value: 'pendingDeliveries' },
        { label: 'Desempenho dos Entregadores', value: 'deliveryPerformance' }
      ],
      reportData: null, // Dados do relatório serão carregados aqui
      columns: [] // Colunas serão configuradas com base no tipo de relatório
    };
  },
  methods: {
    generateReport() {
      // Lógica para gerar relatório com base no tipo selecionado
      if (this.reportType === 'activeUsers') {
        this.columns = [
          { name: 'name', label: 'Nome', field: 'name' },
          { name: 'email', label: 'Email', field: 'email' }
        ];
        this.reportData = [
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
        ];
      } else if (this.reportType === 'pendingDeliveries') {
        this.columns = [
          { name: 'package', label: 'Pacote', field: 'package' },
          { name: 'sender', label: 'Remetente', field: 'sender' },
          { name: 'receiver', label: 'Destinatário', field: 'receiver' },
          { name: 'status', label: 'Status', field: 'status' }
        ];
        this.reportData = [
          { id: 1, package: 'Pacote 1', sender: 'John Doe', receiver: 'Jane Smith', status: 'pendente' },
          { id: 2, package: 'Pacote 2', sender: 'Alice Brown', receiver: 'Bob White', status: 'pendente' }
        ];
      } else if (this.reportType === 'deliveryPerformance') {
        this.columns = [
          { name: 'name', label: 'Entregador', field: 'name' },
          { name: 'deliveries', label: 'Entregas', field: 'deliveries' },
          { name: 'rating', label: 'Avaliação', field: 'rating' }
        ];
        this.reportData = [
          { id: 1, name: 'Carlos Mendes', deliveries: 120, rating: 4.5 },
          { id: 2, name: 'Mariana Silva', deliveries: 98, rating: 4.7 }
        ];
      }
    }
  }
};
</script>
