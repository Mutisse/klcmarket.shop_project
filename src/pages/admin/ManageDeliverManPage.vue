<template>
  <q-page>
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Gerenciamento de Entregadores</div>
        <q-table
          :rows="customers"
          :columns="columns"
          row-key="id"
          selection="single"
          v-model:selected="selected"
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                size="sm"
                color="green"
                icon="eyes"
                @click="$router.push('/admin/deliver-mans/' + props.row.id)"
              >
                ver
              </q-btn>
              <q-btn size="sm" color="primary" @click="editCustomer(props.row)">
                Editar
              </q-btn>
              <q-btn
                size="sm"
                color="negative"
                @click="deleteCustomer(props.row.id)"
              >
                Excluir
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
      <q-card-section>
        <q-btn color="primary" @click="openAddCustomerDialog"
          >Adicionar Entregador</q-btn
        >
      </q-card-section>
    </q-card>

    <q-dialog
      persistent
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
      full-width
      v-model="dialog"
    >
      <q-card flat bordered class="q-mb-md">
        <q-header class="q-mb-md text-start bg-white text-black">
          <q-toolbar>
            <q-btn
              flat
              round
              dense
              @click="dialog=false"
              size="md"
              icon="arrow_back"
            ></q-btn>
            <q-toolbar-title>
              <q-card-section style="padding-bottom: 0px; padding-top: 0px">
                <h2 class="text-h6">
                  Cadastro de entregador
                </h2>
              </q-card-section>
            </q-toolbar-title>

            <q-btn
              rounded
              dense
              label="Guardar"
              class="bg-green-2 glowing-shadow-add"
              type="submit"
              @click="saveCustomer"
            :disable="registering"
          >
            <q-spinner-hourglass v-if="registering" color="white" size="24px" />
          </q-btn>


          </q-toolbar>
        </q-header>

        <div class="q-mt-xl">
          <q-card-section>
            <q-form @submit="saveCustomer" class="q-gutter-md">
              <q-input
                v-model="empresa.name"
                label="Nome completo"
                required
              />
              <q-input v-model="empresa.email" label="email" required />
              <q-input v-model="empresa.password" label="Senha" required />
              <q-input v-model="empresa.morrada" label="Morada" required />


              <q-input
                v-model="empresa.telefone"
                label="Número de telefone"
                required
              />

            </q-form>
          </q-card-section>
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import apiMethods from "src/router/api.js";

export default {
  data() {
    return {
      empresa: {
        morrada: "",
        telefone: "",
        name: "",
        email: "",
        password: "",
      },

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
      dialog: false,
      editMode: false,
      customerData: {
        name: "",
        email: "",
        password: "",
      },
      registering: false,
    };
  },
  methods: {

    async fetchCustomers() {
      try {
        const response = await apiMethods.getEntregadores();
        this.customers = response.data;
        this.carregando = false;
        console.log( response.data);
      } catch (error) {
        this.carregando = false;

        console.error("Erro ao buscar estatísticas:", error);
      }
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
    async saveCustomer() {
      try {
        this.registering = true;
        const response = await apiMethods.createEntregador(this.empresa);
        response.data;
        console.log(response);
        this.registering = false;
        // this.editCustomer()
      } catch (error) {
        this.registering  = false;

        console.error("Erro ao buscar estatísticas:", error);
      }
    },
    deleteCustomer(id) {
      axios.delete(`/api/admin/customers/${id}`).then(() => {
        this.fetchCustomers();
      });
    },
  },
  mounted() {
    this.fetchCustomers();
  },
};
</script>

<style scoped>
.upload-label {
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
  background-color: #f27c38;
  color: white;
  border-radius: 4px;
  font-size: 14px;
}

.upload-input {
  display: none;
}
</style>
