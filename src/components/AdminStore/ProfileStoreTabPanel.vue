<template>
  <q-page>
    <q-tab-panel name="info">
      <!-- Insformações da Loja   -->
      <q-card flat bordered class="q-mb-md q-mt-xl">
        <q-card-section class="q-gutter-md">
          <div class="q-mb-md" v-if="false">
            <div class="image-preview">
              <img
                v-if="
                  store && store.perfil_foto && store.perfil_foto.length > 0
                "
                :src="store.perfil_foto[0]"
                alt="Pré-visualização da imagem"
                style="max-width: 100px; max-height: 100px"
              />
            </div>
            <label for="upload-images" class="upload-label text-center">
              <q-icon name="add_photo_alternate" size="48px" />
              <span>Adicionar Foto</span>
            </label>
          </div>
          <q-input v-model="store.nome" label="Nome da Loja" />
          <q-input v-model="store.categoria" label="Categoria" />
          <q-input
            v-model="store.horario_funcionamento"
            label="Horário de Funcionamento"
          />
          <q-input v-model="store.localizacao" label="Localização" />
          <q-input v-model="store.numero" label="Número de Contato" />
          <q-input
            v-model="store.descricao"
            label="Descrição"
            type="textarea"
          />

          <q-btn
            label="editar loja"
            @click="openStoreForm"
            fab
            icon="edit"
            color="accent"
          />
        </q-card-section>
      </q-card>

      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h5">Perfil</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-list>
            <q-item>
              <q-item-section>
                <q-avatar icon="person" size="100px"> </q-avatar>
                <q-item-label class="text-h6">Nome</q-item-label>
                <q-item-label>{{ store.user.name }}</q-item-label>
                <q-separator spaced />
                <q-item-label class="text-h6">Email</q-item-label>
                <q-item-label>{{ store.user.email }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-separator />
          <div class="row q-gutter-md q-mt-md">
            <q-btn
              label="Editar Perfil"
              color="primary"
              @click="openModal"
              icon="edit"
              fab
            />
            <q-btn
              label="Trocar Senha"
              color="secondary"
              @click="showChangePasswordModal = true"
              icon="lock"
              fab
            />
          </div>
        </q-card-section>
      </q-card>

      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h5">Usuario1</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label>{{ store.username }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-separator />
          <div class="row q-gutter-md q-mt-md">
            <q-btn
              label="Trocar Usuario"
              color="secondary"
              @click="showChangeUsernameModal = true"
              icon="lock"
              fab
            />
          </div>
        </q-card-section>
      </q-card>
    </q-tab-panel>

    <q-dialog
      full-width
      persistent
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
      v-model="dialog"
    >
      <q-card flat bordered class="q-mb-md">
        <q-header class="q-mb-md text-start bg-white text-black">
          <q-toolbar>
            <q-btn
              flat
              round
              dense
              @click="cancelar"
              size="md"
              icon="arrow_back"
            ></q-btn>
            <q-toolbar-title>
              <q-card-section style="padding-bottom: 0px; padding-top: 0px">
                <h2 v-show="empresa" class="text-h6">Editar Loja</h2>
                <h2 v-show="empresa == null" class="text-h6">Adicionar loja</h2>
              </q-card-section>
            </q-toolbar-title>

            <q-btn
              v-show="empresa == null"
              rounded
              dense
              label="Guardar"
              class="bg-green-2 glowing-shadow-add"
              type="submit"
              @click="SaveStore"
            ></q-btn>

            <q-btn
              v-show="empresa"
              rounded
              dense
              label="Atualizar"
              class="bg-green-2 glowing-shadow-update"
              @click="SaveStore"
            ></q-btn>

            <q-btn
              v-show="empresa"
              rounded
              dense
              class="bg-red-2 glowing-shadow-cancel q-ml-md"
              label="Desativar"
              v-if="false"
            />
          </q-toolbar>
        </q-header>
        <q-card-section>
          <q-form @submit="SaveStore" class="q-mt-xl q-gutter-md">
            <!-- <q-input
              v-model="empresa.nome"
              label="Nome do Proprietario"
              required
            /> -->
            <!-- <q-input v-model="empresa.email" label="email" required />
            <q-input v-model="empresa.password" label="Senha" required /> -->
            <q-input v-model="empresa.nome" label="Nome da loja" required />
            <q-input v-model="empresa.categoria" label="Categoria" required />

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

            <div class="q-mb-md" v-if="false">
              <label
                for="upload-images"
                class="upload-label full-width text-center"
                >Adicionar Imagem de perfil</label
              >
              <input
                type="file"
                id="upload-images"
                accept="image/*"
                @change="onImageAdded('perfil', empresa, $event)"
                class="upload-input"
              />
            </div>

            <div
              v-if="
                false &&
                empresa &&
                empresa.perfil_foto &&
                empresa.perfil_foto.length > 0
              "
            >
              <div
                v-for="(image, imgIndex) in empresa.perfil_foto"
                :key="imgIndex"
                class="q-mb-sm"
              >
                <img
                  :src="empresa.perfil_foto[0]"
                  alt="Pré-visualização da imagem"
                  style="max-width: 100px; max-height: 100px"
                />
              </div>
            </div>

            <div class="q-mb-md" v-if="false">
              <label
                for="upload-images1"
                class="upload-label full-width text-center"
                >Adicionar imagem de capa</label
              >
              <input
                type="file"
                id="upload-images1"
                accept="image/*"
                @change="onImageAdded('capa', empresa, $event)"
                class="upload-input"
              />
            </div>

            <div
              v-if="
                empresa && empresa.capa_foto && empresa.capa_foto.length > 0
              "
            >
              <div
                v-for="(image, imgIndex) in empresa.capa_foto"
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
      </q-card>
    </q-dialog>

    <!-- Modal para Editar Perfil -->
    <q-dialog v-model="showEditProfileModal" persistent full-width>
      <q-card>
        <q-card-section>
          <div class="text-h6">Editar Perfil</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit="updateProfile" class="q-gutter-md">
            <q-input filled v-model="form.name" label="Nome" />
            <q-input filled v-model="form.email" label="Email" />

            <div class="q-mt-md">
              <q-btn type="submit" label="Salvar" color="primary" />
              <q-btn
                flat
                label="Cancelar"
                color="primary"
                @click="cancelarEvent"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal para Trocar Senha -->
    <!-- Modal para Trocar Senha -->
    <q-dialog v-model="showChangePasswordModal" persistent full-width>
      <q-card>
        <q-card-section>
          <div class="text-h6">Trocar Senha</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form
            @submit="changePassword"
            v-if="getUserOnline.scope !== 'admin'"
            class="q-gutter-md"
          >
            <q-input
              filled
              v-model="passwordForm.password"
              type="password"
              label="Senha Antiga"
              :error="!!errors.password"
              :error-message="errors.password"
            />
            <q-input
              filled
              v-model="passwordForm.newPassword"
              type="password"
              label="Nova Senha"
              :error="!!errors.newPassword"
              :error-message="errors.newPassword"
            />
            <q-input
              filled
              v-model="passwordForm.confirmPassword"
              type="password"
              label="Confirmar Nova Senha"
              :error="!!errors.confirmPassword"
              :error-message="errors.confirmPassword"
            />
            <div class="q-mt-md">
              <q-btn type="submit" label="Trocar Senha" color="primary" />
              <q-btn
                flat
                label="Cancelar"
                color="primary"
                @click="showChangePasswordModal = false"
              />
            </div>
          </q-form>

          <q-form v-if="getUserOnline.scope == 'admin'" class="q-gutter-md">
            <div class="q-mt-md">
              <q-btn
                @click="showConfirmModal = true"
                label="Trocar Senha"
                color="primary"
              />
              <q-btn
                flat
                label="Cancelar"
                color="primary"
                @click="showChangePasswordModal = false"
              />
            </div>
          </q-form>

          <q-dialog v-model="showConfirmModal">
            <q-card>
              <q-card-section>
                <div class="text-h6">Confirmação</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                Tem certeza de que deseja continuar?
              </q-card-section>

              <q-card-actions align="right">
                <q-btn
                  flat
                  label="Cancelar"
                  color="grey"
                  @click="showConfirmModal = false"
                />
                <q-btn
                  label="Confirmar"
                  color="primary"
                  @click="resetPassword"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showChangeUsernameModal" persistent full-width>
      <q-card>
        <q-card-section>
          <div class="text-h6">Alterar Usuario</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit="changeUserName" class="q-gutter-md">
            <q-input
              filled
              v-model="usernameForm.username"
              label="Usuario"
              :error="!!errors.username"
              :error-message="errors.username"
            />
            <div class="q-mt-md">
              <q-btn
                type="submit"
                label="Alterar"
                color="primary"
                :disable="registering"
              >
                <q-spinner-hourglass
                  v-if="registering"
                  color="white"
                  size="24px"
                />
              </q-btn>

              <q-btn
                flat
                label="Cancelar"
                color="primary"
                @click="showChangeUsernameModal = false"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import apiMethods from "src/router/api.js";
import store from "src/store/index.js";
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
        perfil_foto: [],
        capa_foto: [],
      },
      registering: false,
      showConfirmModal: false,

      store: {
        nome: "",
        categoria: "",
        horario_funcionamento: "",
        localizacao: "",
        numero: "",
        descricao: "",

        password: "",
        perfil_foto: [],
        capa_foto: [],
        user: { name: "", email: "" },
      },

      selected: [],
      dialog: false,
      editMode: false,
      imagePreview: [],
      showEditProfileModal: false,
      showChangePasswordModal: false,
      showChangeUsernameModal: false,
      form: {
        name: "",
        email: "",
        telefone: "",
        morrada: "",
      },
      originalForm: {
        name: "",
        email: "",
        telefone: "",
        morrada: "",
      },
      passwordForm: {
        password: "",
        newPassword: "",
        confirmPassword: "",
      },
      usernameForm: {
        username: "",
      },
      errors: {},
    };
  },
  computed: {
    getUserOnline() {
      return store.state.user;
    },
  },
  methods: {
    cancelarEvent() {
      // Restore original form values
      this.form = { ...this.originalForm };
      this.showEditProfileModal = false;
    },
    openModal() {
      // Store original form values before opening the modal
      this.form = { ...this.store.user };
      this.showEditProfileModal = true;
    },
    getUser() {
      this.form = { ...this.store.user };
      this.user = { ...this.store.user };
    },
    validateForm() {
      return this.form.email && this.form.name;
    },
    async updateProfile() {
      if (this.validateForm()) {
        try {
          this.$q.loading.show();

          const userData = {
            email: this.form.email,
            name: this.form.name,
            id: this.form.id,
          };
          // console.log( this.form)
// return;
          // Chama a API para atualizar o perfil
          let response = await apiMethods.updateUser(userData);
          // console.log(response.data);
          this.$q.loading.hide();
          this.showEditProfileModal = false;
          // Exemplo de notificação de sucesso
          this.$q.notify({
            color: "green",
            textColor: "white",
            icon: "cloud_done",
            message: "Dados editados com sucesso!",
          });
        } catch (error) {
          // Exemplo de tratamento de erro
          console.error("Erro ao editar dados:", error);
          this.getUser();
          this.$q.loading.hide();
          this.$q.notify({
            color: "red",
            textColor: "white",
            icon: "report_problem",
            message: "Erro ao editar dados. Por favor, tente novamente.",
          });
        }
      }
    },
    formatErrors(errors) {
      let formattedErrors = {};
      for (const [key, value] of Object.entries(errors)) {
        formattedErrors[key] = Array.isArray(value) ? value[0] : value;
      }
      return formattedErrors;
    },
    async changePassword() {
      this.$q.loading.show();
      this.errors = {};
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.errors.newPassword = "As senhas não coincidem";
        this.$q.loading.hide();
        return;
      }
      if (this.passwordForm.newPassword.length < 8) {
        this.errors.newPassword =
          "A nova senha deve ter pelo menos 8 caracteres";
        this.$q.loading.hide();
        return;
      }

      try {
        let response = await apiMethods.resetPassword(
          this.empresa.user_id,
          this.passwordForm
        );
        this.$q.notify({
          type: "positive",
          message: "Senha atualizada com sucesso",
        });
        this.$q.loading.hide();
        this.showChangePasswordModal = false;
      } catch (error) {
        console.error("Erro ao editar dados:", error);
        // Handle validation errors returned by the API
        if (error.response && error.response.data.errors) {
          if (
            error.response.data.errors.password.includes(
              "The password field confirmation does not match."
            )
          ) {
            this.errors.password = "A confirmação da senha não corresponde.";
          }
        } else {
          // Handle other errors
          this.$q.notify({
            color: "red",
            textColor: "white",
            icon: "report_problem",
            message: "Erro ao trocar senha. Por favor, tente novamente.",
          });
        }
        this.$q.loading.hide();
      }
    },

    async changeUserName() {
      this.errors = {};
      if (!this.usernameForm.username) {
        this.errors.username = "Digite um usuario";
        return;
      }

      try {
        this.registering = true;
        let response = await apiMethods.resetUserName(
          this.store.id,
          this.usernameForm
        );
        // console.log(response)
        this.$q.notify({
          type: "positive",
          message: "Usuario atualizado com sucesso",
        });
        this.fetchstore();
        this.showChangeUsernameModal = false;
        this.registering = false;
      } catch (error) {
        // console.error("Erro ao atualizar Usuario:", error.response.data);
        // Handle validation errors returned by the API
        // if (error.response && error.response.data.errors) {
        //   if (
        //     error.response.data.errors.password.includes(
        //       "The password field confirmation does not match."
        //     )
        //   ) {
        //     this.errors.password = "A confirmação da senha não corresponde.";
        //   }
        // } else {
        // Handle other errors
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "report_problem",
          message: "Erro ao atualizar Usuario. Por favor, tente novamente.",
        });
        // }
      }
      this.registering = false;
    },

    async resetPassword() {
      console.log(this.$route.params.id || 0);
      this.$q.loading.show();
      try {
        this.registering = true;
        let response = await apiMethods.resetPassword(
          this.$route.params.id || 0
        );
        console.log(response);
        this.$q.notify({
          type: "positive",
          message: "Senha atualizada com sucesso",
        });
        this.fetchstore();
        this.$q.loading.hide();
        this.showResetPasswordModal= this.showConfirmModal= false;
        this.registering = false;
      } catch (error) {
        // Handle other errors
        this.$q.loading.hide();
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "report_problem",
          message: "Erro ao atualizar Senha. Por favor, tente novamente.",
        });
        // }
      }
      this.registering = false;
    },

    onImageAdded(tipo, item, event) {
      console.log(tipo, item);

      if (tipo == "capa") {
        item.capa_foto = [];
        // Handle image upload for specific item
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
          const reader = new FileReader();
          reader.onload = (e) => {
            item.capa_foto.push({
              file: files[i],
              preview: e.target.result,
            });
          };
          reader.readAsDataURL(files[i]);
        }
        return;
      }

      if (tipo == "perfil") {
        item.perfil_foto = [];
        // Handle image upload for specific item
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
          const reader = new FileReader();
          reader.onload = (e) => {
            item.perfil_foto.push({
              file: files[i],
              preview: e.target.result,
            });
          };
          reader.readAsDataURL(files[i]);
        }
      }
    },

    previewImage(event) {
      this.imagePreview = [];
      this.store.perfil_foto = []; // Limpa as prévias de imagem anteriores
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) {
          continue; // Ignora arquivos que não são imagens
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview.push(e.target.result);
          this.store.perfil_foto.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    },
    async viewProduct(product) {
      this.empresa = product;
      this.fillForm(product);
      this.dialog = true;
    },
    async editProduct(product) {
      this.empresa = product;
      this.fillForm(product);
      this.dialog = true;
    },
    cancelar() {
      this.dialog = false;
      this.resetForm();
    },

    async fetchstore() {
      const isOnlyAdmin = this.$route.meta.requiredScopes.includes("admin");

      try {
        const response = await apiMethods.getEmpresaDoUsuarioLogado(
          isOnlyAdmin ? this.$route.params.id : 0
        );
        this.store = response.data;
        // console.log(this.store);
        this.carregando = false;
      } catch (error) {
        this.carregando = false;

        console.error("Erro ao buscar estatísticas:", error);
      }
    },
    openStoreForm() {
      this.resetForm();
      this.fillForm();
      this.dialog = true;
    },
    resetForm() {
      (this.form = {
        nome: "",
        categoria: "",
        horario_funcionamento: "",
        localizacao: "",
        numero: "",
        descricao: "",
        name: "",
        email: "",
        password: "",
        perfil_foto: [],
        capa_foto: [],
      }),
        (this.imagePreview = []);
    },
    fillForm() {
      this.empresa = {
        ...this.store,
      };
      console.log(this.empresa);
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
    async SaveStore() {
      console.log(this.empresa);
      this.$q.loading.show();
      this.empresa.name = this.empresa.nome;
      try {    this.registering = true;
        const response = await apiMethods.updateEmpresa(this.empresa);
        response.data;
        // console.log(response);
        this.carregando = false;
        this.$q.notify({
          type: "positive",
          message: "Loja atualizada com sucesso",
        }); this.$q.loading.hide(); this.registering = false;
        this.dialog=false
      } catch (error) {
        this.carregando = false;
      ; this.$q.loading.hide(); this.registering = false;

        console.error("Erro ao buscar estatísticas:", error);
      }
    },
    deleteCustomer(id) {
      axios.delete(`/api/admin/store/${id}`).then(() => {
        this.fetchstore();
      });
    },
  },
  mounted() {
    this.fetchstore();
  },
};
</script>

<style scoped>
.image-preview {
  display: flex;
  overflow-x: auto; /* Habilita a rolagem horizontal */
  white-space: nowrap; /* Impede quebra de linha */
  gap: 10px; /* Espaçamento entre os itens */
}

.preview-image {
  flex: 0 0 90%; /* Evita redimensionamento automático */
  max-height: 250px; /* Altura máxima das imagens */
  object-fit: cover;
}

.upload-label {
  flex: 0 0 90%; /* Faz a label ocupar 90% da largura da tela */
  display: flex; /* Usar Flexbox */
  flex-direction: column; /* Colocar ícone e texto em coluna */
  padding: 6px 12px;
  cursor: pointer;
  background-color: #97928e;
  color: white;
  border-radius: 4px;
  font-size: 14px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  height: 200px;
  align-items: center; /* Centralizar itens horizontalmente */
  text-align: center;
  justify-content: center; /* Centralizar itens verticalmente */
}

.upload-input {
  display: none;
}

.glowing-shadow-add {
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.6),
    /* Brilho verde */ 0 0 20px rgba(0, 255, 0, 0.4),
    0 0 30px rgba(0, 255, 0, 0.2);
  transition: box-shadow 0.3s ease-in-out;
}

.glowing-shadow-update {
  box-shadow: 0 0 10px rgba(0, 0, 255, 0.6),
    /* Brilho azul */ 0 0 20px rgba(0, 0, 255, 0.4),
    0 0 30px rgba(0, 0, 255, 0.2);
  transition: box-shadow 0.3s ease-in-out;
}

.glowing-shadow-cancel {
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.6),
    /* Brilho vermelho */ 0 0 20px rgba(255, 0, 0, 0.4),
    0 0 30px rgba(255, 0, 0, 0.2);
  transition: box-shadow 0.3s ease-in-out;
}
</style>
