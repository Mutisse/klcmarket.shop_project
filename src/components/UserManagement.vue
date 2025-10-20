<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Gestão de Usuários</div>
    </q-card-section>
    <q-card-section>
      <q-input v-model="search" placeholder="Buscar usuários..." />
      <q-table :rows="users" :columns="columns" row-key="id">
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat icon="edit" @click="editUser(props.row)" />
            <q-btn flat icon="delete" color="negative" @click="deleteUser(props.row)" />
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
      users: [], // Dados dos usuários serão carregados aqui
      columns: [
        { name: 'name', label: 'Nome', field: 'name' },
        { name: 'email', label: 'Email', field: 'email' },
        { name: 'role', label: 'Papel', field: 'role' },
        { name: 'status', label: 'Status', field: 'status' },
        { name: 'actions', label: 'Ações', field: 'actions' }
      ]
    };
  },
  methods: {
    editUser(user) {
      // Lógica para editar usuário
    },
    deleteUser(user) {
      // Lógica para deletar usuário
    }
  },
  mounted() {
    // Carregar dados dos usuários
    this.users = [
      // Exemplo de dados
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'inactive' }
    ];
  }
};
</script>
