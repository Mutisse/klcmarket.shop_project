<template>
  <q-page>
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Gerenciamento de Clientes</div>

        <!-- Campo de pesquisa -->
       <div class="row justify-between q-mb-md">
        <q-input
          v-model="searchQuery"
          label="Pesquisar por Nome ou E-mail"
          outlined
          dense
          debounce="300"
          @input="searchStores"
          class="col-10"
        /> <q-btn color="primary" class="col-2" icon="search" @click="searchStores"
          ></q-btn
        >

       </div>


        <q-table
          :rows="customers"
          :columns="columns"
          row-key="id"
          selection="single"
          :pagination="pagination"
          :rows-per-page-options="[50, 100, 200]"

          v-model:selected="selected"
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                size="sm"
                color="green"
                icon="eyes"
                @click="$router.push('/admin/custumers/' + props.row.id)"
              >
                ver
              </q-btn>
              <q-btn size="sm" color="primary" @click="editCustomer(props.row)">
                Editar
              </q-btn>

            </q-td>
          </template>
        </q-table>
      </q-card-section>
      <q-card-section>
        <q-btn color="primary" @click="openAddCustomerDialog"
          >Adicionar Cliente</q-btn
        >
      </q-card-section>
    </q-card>

    <q-dialog full-width  v-model="dialog">
  <q-card >
    <q-card-section>
      <div class="text-h6">
        {{ editMode ? "Editar Cliente" : "Adicionar Cliente" }}
      </div>
    </q-card-section>
    <q-card-section class="q-gutter-md">
      <q-input v-model="customerData.name" label="Nome" />
      <q-input v-model="customerData.email" label="Email" />
      <q-input v-model="customerData.phone" label="Numero" />
      <q-input v-model="customerData.password" label="Senha" type="password" />
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="Cancelar" color="primary" v-close-popup />
      <q-btn flat label="Salvar" color="primary" @click="confirmEdit" />
      <q-btn
                color="negative"
                @click="confirmDelete"
              >
                Excluir
              </q-btn>
    </q-card-actions>
  </q-card>
</q-dialog>

<!-- Modal de Confirmação para Editar -->
<q-dialog v-model="confirmEditDialog">
  <q-card>
    <q-card-section>
      <div class="text-h6">Confirmação</div>
    </q-card-section>
    <q-card-section>
      Tem certeza que deseja continuar editando este cliente?
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="Cancelar" color="grey" v-close-popup />
      <q-btn flat label="Sim, continuar" color="primary" @click="saveCustomer" />
    </q-card-actions>
  </q-card>
</q-dialog>

<!-- Modal de Confirmação para Excluir -->
<q-dialog v-model="confirmDeleteDialog">
  <q-card>
    <q-card-section>
      <div class="text-h6">Confirmação</div>
    </q-card-section>
    <q-card-section>
      Tem certeza que deseja excluir este cliente? Essa ação não pode ser desfeita.
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="Cancelar" color="grey" v-close-popup />
      <q-btn flat label="Sim, excluir" color="negative" @click="deleteCustomer" />
    </q-card-actions>
  </q-card>
</q-dialog>

  </q-page>
</template>

<script>
import apiMethods from "src/router/api.js";

export default {
  data() {
    return {
      customers: [],
      columns: [
        {
          name: "name",
          required: true,
          label: "Nome",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "email",
          align: "left",
          label: "Email",
          field: "email",
          sortable: true,
        },
        { name: "actions", align: "center", label: "Ações", field: "actions" },
      ],
      selected: [],
      searchQuery:'',
      pagination: {
        rowsPerPage: 50, // Mostra no mínimo 50 usuários por página
        page: 1, // Começa na primeira página
      },
      dialog: false,
      confirmEditDialog: false,
      confirmDeleteDialog: false,
      editMode: false,
      customerData: {
        name: "",
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async fetchCustomers() {
      this.$q.loading.show()
      try {
        const response = await apiMethods.fetchCustomers();
        this.customers = response.data;
        this.carregando = false;
        this.$q.loading.hide()
      } catch (error) {
        this.carregando = false;
        this.$q.loading.hide()
        console.error("Erro ao buscar estatísticas:", error);
      }
    },

    async searchStores() {
      this.$q.loading.show();
      try {
        this.registering = true;
        const response = await apiMethods.pesquisaCustomers(this.searchQuery);
        response.data;
        // console.log(response.data);
        // this.fetchCustomers();
        let rowsArray = Array.from(response.data); // Converte rows para um array
        this.customers = rowsArray
        this.dialog = false;
        this.editMode = false;
        this.registering = false;
      } catch (error) {
        this.registering = false;
        console.error("Erro ao buscar clientes:", error); this.$q.loading.hide();
      }
      this.$q.loading.hide();
    },

    openAddCustomerDialog() {
      this.editMode = false;
      this.customerData = { name: "", email: "", password: "" };
      this.dialog = true;
    },

    editCustomer(customer) {
      this.editMode = true;
      this.customerData = { ...customer, password: "" };
      this.dialog = true;
    },

    confirmEdit() {
      this.confirmEditDialog = true;
    },

    async saveCustomer() {
      this.confirmEditDialog = false;
      this.loading = true;
      this.$q.loading.show()
      try {
        if (this.editMode) {
          await apiMethods.updateCustomers(this.customerData.id, this.customerData);
          this.$q.notify({ type: "positive", message: "Cliente atualizado com sucesso!" });
        } else {
          await apiMethods.addCustomers(this.customerData);
          this.$q.notify({ type: "positive", message: "Cliente cadastrado com sucesso!" });
        }
        this.fetchCustomers();
        this.dialog = false;
      } catch (error) {
        console.error("Erro ao salvar cliente:", error);
        this.$q.notify({ type: "negative", message: "Erro ao salvar cliente." });
      } finally {
        this.loading = false;
        this.$q.loading.hide()
      }
    },

    confirmDelete(id) {
      this.customerToDelete = id;
      this.confirmDeleteDialog = true;
    },

    async deleteCustomer() {

      this.$q.loading.show()

      this.confirmDeleteDialog = false;
      this.loading = true;
      try {
        await apiMethods.deleteCustomers(this.customerData.id);
        this.$q.notify({ type: "positive", message: "Cliente removido com sucesso!" });
        this.fetchCustomers();
        this.confirmDeleteDialog = false;
        this.dialog = false;
      } catch (error) {
        console.error("Erro ao excluir cliente:", error);
        this.$q.notify({ type: "negative", message: "Erro ao excluir cliente." });
      } finally {
        this.loading = false;
        this.$q.loading.hide()
      }
      this.confirmDeleteDialog = false;
    }
  },
  mounted() {
    this.fetchCustomers();
  },
};
</script>

<style>
.q-page {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
