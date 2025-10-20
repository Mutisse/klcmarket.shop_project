<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Gestão de Entregas</div>
    </q-card-section>
    <q-card-section>
      <q-input v-model="search" placeholder="Buscar entregas..." />
      <q-table :rows="deliveries" :columns="columns" row-key="id">
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat icon="visibility" @click="viewDelivery(props.row)" />
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      deliveries: [], // Dados das entregas serão carregados aqui
      columns: [
        { name: 'package', label: 'Pacote', field: 'package' },
        { name: 'sender', label: 'Remetente', field: 'sender' },
        { name: 'receiver', label: 'Destinatário', field: 'receiver' },
        { name: 'status', label: 'Status', field: 'status' },
        { name: 'actions', label: 'Ações', field: 'actions' }
      ]
    };
  },
  methods: {
    viewDelivery(delivery) {
      // Lógica para visualizar detalhes da entrega
    }
  },
  mounted() {
    // Carregar dados das entregas
    this.deliveries = [
      // Exemplo de dados
      { id: 1, package: 'Pacote 1', sender: 'John Doe', receiver: 'Jane Smith', status: 'entregue' },
      { id: 2, package: 'Pacote 2', sender: 'Alice Brown', receiver: 'Bob White', status: 'pendente' }
    ];
  }
};
</script>
