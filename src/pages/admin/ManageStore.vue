<template>
  <q-page>
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Gerenciamento de Lojas</div>


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
                @click="$router.push('/admin/store/' + props.row.id)"
              >
                ver
              </q-btn>
              <q-btn size="sm" color="primary" @click="editCustomer(props.row)">
                Editar
              </q-btn>
              <q-btn
                size="sm"
                color="negative"
                @click="confirmDelete(props.row.id)"
              >
                Excluir
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
      <q-card-section>
        <q-btn color="primary" @click="openAddCustomerDialog"
          >Adicionar Empresa</q-btn
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
              @click="dialog = false"
              size="md"
              icon="arrow_back"
            ></q-btn>
            <q-toolbar-title>
              <q-card-section style="padding-bottom: 0px; padding-top: 0px">
                <h2 class="text-h6">Cadastro de empresa</h2>
              </q-card-section>
            </q-toolbar-title>

            <q-btn
              v-if="!empresa.id"
              rounded
              dense
              label="Guardar"
              class="bg-green-2 glowing-shadow-add"
              type="submit"
              @click="saveCustomer"
              :disable="registering"
            >
              <q-spinner-hourglass
                v-if="registering"
                color="white"
                size="24px"
              />
            </q-btn>

            <q-btn
              v-if="empresa.id"
              rounded
              dense
              label="Atualizar"
              class="bg-green-2 glowing-shadow-add"
              type="submit"
              @click="confirmEdit"
              :disable="registering"
            >
              <q-spinner-hourglass
                v-if="registering"
                color="white"
                size="24px"
              />
            </q-btn>
          </q-toolbar>
        </q-header>

        <div class="q-mt-xl">
          <q-card-section>
            <q-form @submit="saveCustomer" class="q-gutter-md">
              <q-input
                v-model="empresa.name"
                label="Nome do Proprietario"
                required
              />
              <q-input v-model="empresa.nome" label="Nome da loja" required />

              <q-input
                v-model="empresa.username"
                placeholder=""
                label="Usuario"
                required
              />
              <div class="text-subitle text-grey">
                o Usuario deve estar em minuscula e sem espaços
              </div>
              <q-input v-model="empresa.email" label="email" required />
              <div class="text-subitle text-grey">usuario@klcmarket.shop</div>
              <q-input v-model="empresa.password" label="Senha" required />
              <q-input v-model="empresa.categoria" label="Categoria" required />
              <div class="text-subitle text-grey">
                Roupas, calçados, acessorios, etc
              </div>

              <q-input
                v-model="empresa.horario_funcionamento"
                label="Horário de Funcionamento"
                required
              />
              <q-input
                v-model="empresa.localizacao"
                label="Localização"
                required
              />
              <q-input
                v-model="empresa.numero"
                label="Número de Contato"
                required
              />
              <q-input
                v-model="empresa.descricao"
                label="Descrição"
                type="textarea"
                required
              />

              <div class="q-mb-md">
                <label
                  for="upload-images"
                  class="upload-label full-width text-center"
                  >Adicionar Imagens</label
                >
                <input
                  type="file"
                  id="upload-images"
                  accept="image/*"
                  multiple
                  @change="onImageAdded('perfil', empresa, $event)"
                  class="upload-input"
                />
              </div>

              <div v-if="empresa.perfilFoto.length > 0">
                <div
                  v-for="(image, imgIndex) in empresa.perfilFoto"
                  :key="imgIndex"
                  class="q-mb-sm"
                >
                  <img
                    :src="image.preview"
                    alt="Pré-visualização da imagem"
                    style="max-width: 100px; max-height: 100px"
                  />
                </div>
              </div>

              <div class="q-mb-md">
                <label
                  for="upload-images1"
                  class="upload-label full-width text-center"
                  >Adicionar capa</label
                >
                <input
                  type="file"
                  id="upload-images1"
                  accept="image/*"
                  multiple
                  @change="onImageAdded('capa', empresa, $event)"
                  class="upload-input"
                />
              </div>

              <div v-if="empresa.capaFoto.length > 0">
                <div
                  v-for="(image, imgIndex) in empresa.capaFoto"
                  :key="imgIndex"
                  class="q-mb-sm"
                >
                  <img
                    :src="image.preview"
                    alt="Pré-visualização da imagem"
                    style="max-width: 100px; max-height: 100px"
                  />
                </div>
              </div>
            </q-form>
          </q-card-section>
        </div>
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
          <q-btn
            flat
            label="Sim, continuar"
            color="primary"
            @click="updateEmpresa"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirmDeleteDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirmação</div>
        </q-card-section>
        <q-card-section>
          Tem certeza que deseja continuar exluindo este usuario?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn
            flat
            label="Sim, continuar"
            color="primary"
            @click="deleteCustomer"
          />
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
      empresa: {
        nome: "",
        categoria: "",
        horario_funcionamento: "",
        localizacao: "",
        numero: "",
        descricao: "",
        name: "",
        email: "",
        password: "",
        perfilFoto: [],
        capaFoto: [],
      },
      searchQuery:'',
      confirmEditDialog: false,
      confirmDeleteDialog: false,
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
      pagination: {
        rowsPerPage: 50, // Mostra no mínimo 50 usuários por página
        page: 1, // Começa na primeira página
      },
      selected: [],
      dialog: false,
      editMode: false,
      deleteMode: false,
      customerData: {
        name: "",
        email: "",
        password: "",
      },
      registering: false,
    };
  },
  computed: {
    filteredCustomers() {
      // Filtra os clientes com base na pesquisa
      return this.customers.filter((customer) => {
        const query = this.searchQuery.toLowerCase();
        return (
          customer.name.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query)
        );
      });
    },
  },
  methods: {
    async searchStores() {
      this.$q.loading.show();
      try {
        this.registering = true;
        const response = await apiMethods.fetchPesquisaStores(this.searchQuery);
        response.data;
        console.log(response.data);
        // this.fetchCustomers();
        let rowsArray = Array.from(response.data); // Converte rows para um array
        this.customers = rowsArray
        this.dialog = false;
        this.editMode = false;
        this.registering = false;
      } catch (error) {
        this.registering = false;
        console.error("Erro ao buscar estatísticas:", error); this.$q.loading.hide();
      }
      this.$q.loading.hide();
    },
    onImageAdded(tipo, item, event) {
      console.log(tipo);

      if (tipo == "capa") {
        item.capaFoto = [];
        // Handle image upload for specific item
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
          const reader = new FileReader();
          reader.onload = (e) => {
            item.capaFoto.push({
              file: files[i],
              preview: e.target.result,
            });
          };
          reader.readAsDataURL(files[i]);
        }
        return;
      }

      if (tipo == "perfil") {
        item.perfilFoto = [];
        // Handle image upload for specific item
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
          const reader = new FileReader();
          reader.onload = (e) => {
            item.perfilFoto.push({
              file: files[i],
              preview: e.target.result,
            });
          };
          reader.readAsDataURL(files[i]);
        }
      }
    },
    async fetchCustomers() {
      try {
        this.$q.loading.show();
        const response = await apiMethods.fetchStores();
        this.customers = response.data;
        console.log(response.data);
        this.carregando = false;
      } catch (error) {
        this.carregando = false;

        console.error("Erro ao buscar estatísticas:", error);
      }
      this.$q.loading.hide();
    },
    openAddCustomerDialog() {
      this.editMode = false;
      this.empresa = {
        id: null,
        nome: "",
        username: "",
        categoria: "",
        horario_funcionamento: "",
        localizacao: "",
        numero: "",
        descricao: "",
        perfilFoto: [],
        capaFoto: [],
      };
      this.dialog = true;
    },

    confirmEdit() {
      this.confirmEditDialog = true;
    },
    confirmDelete(id) {
      this.customerToDelete = id;
      this.confirmDeleteDialog = true;
    },

    editCustomer(customer) {
      this.editMode = true;
      this.customerData = {
        ...customer,
        password: "",
      };

      // Garante que `empresa` seja corretamente populada
      if (customer.empresas && customer.empresas.length > 0) {
        this.empresa = {
          ...customer,
          ...customer.empresas[0],
          password: "",
          email: customer.email,
          perfilFoto: customer.empresas[0].perfilFoto || [],
          capaFoto: customer.empresas[0].capaFoto || [],
        };
      } else {
        this.empresa = {
          id: null,
          nome: "",
          username: "",
          categoria: "",
          horario_funcionamento: "",
          localizacao: "",
          numero: "",
          descricao: "",
          perfilFoto: [],
          capaFoto: [],
        };
      }

      // console.log("Empresa:", customer);
      this.dialog = true;
    },

    async saveCustomer() {
      this.$q.loading.show();
      try {
        this.registering = true;
        const response = await apiMethods.createEmpresa(this.empresa);
        response.data;
        console.log(response);
        this.fetchCustomers();
        this.dialog = false;
        this.editMode = false;

        this.registering = false;
      } catch (error) {
        this.registering = false;

        console.error("Erro ao buscar estatísticas:", error);
      }
      this.$q.loading.hide();
    },
    async updateEmpresa() {
      this.confirmEditDialogDialog = false;
      this.$q.loading.show();
      try {
        this.registering = true;
        const response = await apiMethods.updateEmpresa(this.empresa);
        response.data;
        console.log(response);
        this.fetchCustomers();
        this.dialog = false;
        this.editMode = false;
        this.registering = false;
      } catch (error) {
        this.registering = false;
        console.error("Erro ao buscar estatísticas:", error);
      }
      this.$q.loading.hide();
    },
    async deleteCustomer(id) {
      this.confirmDeleteDialog = false;
      this.$q.loading.show();
      try {
        this.registering = true;
        const response = await apiMethods.deleteUser(this.customerToDelete);
        response.data;
        console.log(response);
        this.fetchCustomers();
        this.dialog = false;
        this.editMode = false;
        this.registering = false;
      } catch (error) {
        this.registering = false;
        console.error("Erro ao buscar estatísticas:", error);
      }
      this.$q.loading.hide();
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
