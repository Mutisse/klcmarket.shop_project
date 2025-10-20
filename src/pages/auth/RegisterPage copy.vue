<template>
  <div class="row">
    <div class="q-pa-md col-12">
      <div class="q-pa-md q-gutter-sm">


        <q-dialog
          v-model="dialog"
          full-height
          full-width
          backdrop-filter="blur(4px)"
          class="q-ma-lg"
        >
          <q-card>
            <q-card-section class="row items-center q-pb-none text-h6">
              Selecione um usuario
            </q-card-section>

            <q-card-section>
              <q-input
                v-model="userEmail"
                label="Pesquise pelo nome ou email"
                outlined
                required
                class="q-mb-md"
                @update:model-value="getUsersList"
              />
            </q-card-section>

            <q-card-section>
              <q-item
                v-for="us in usersList"
                :key="us"
                clickable
                v-ripple
                @click="selectUser(us)"
                class="rounded-borders bg-grey-2 q-mb-sm"
              >
                <q-item-section>
                  <q-item-label> {{ us.name }} </q-item-label>
                  <q-item-label caption>
                    <q-badge color="yellow-6" text-color="black">
                      {{ us.email }}
                    </q-badge>
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-badge
                    v-if="us.entregadores.length > 0"
                    color="blue-6"
                    text-color="white"
                  >
                    Entregador
                  </q-badge>
                  <q-badge
                    v-if="us.empresas.length > 0"
                    color="orange-6"
                    text-color="white"
                  >
                    Empresa
                  </q-badge>
                  <q-badge
                    v-if="
                      us.empresas.length == 0 && us.entregadores.length == 0
                    "
                    color="green-6"
                    text-color="white"
                  >
                    Cliente
                  </q-badge>
                </q-item-section>
              </q-item>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Close" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
      <q-card-section style="padding-bottom: 0px; padding-top: 0px">
        <h2 class="text-h6">Lojas</h2>
      </q-card-section>

      <div>
        <q-form
          class="row"
          :style="{
            width: '100%',
            display: 'flex',
            'flex-wrap': 'wrap',
          }"
          lazy-validation
        >
          <q-card-section
            style="padding-bottom: 0px; padding-top: 0px"
            class="col-md-6 col-12"
          >
          <q-card
              dark
              elevated
              class="bg-white q-mb-md"
              style="border: 1px solid rgba(0, 0, 0, 0.12)"
            >
              <q-card-section>
                <div class="text-h6 text-black">Usuario</div>

              </q-card-section>

              <q-separator dark inset />

              <q-card-section>
                <q-input
                  v-model="name"
                  label="Nome Completo"
                  outlined
                  required
                  class="q-mb-md"
                />
                <q-input
                  v-model="email"
                  label="Email"
                  outlined
                  required
                  class="q-mb-md"
                />
                <q-input
                  v-model="password"
                  label="Senha"
                  outlined
                  required
                  class="q-mb-md"
                />
                <q-input
                  v-model="password2"
                  label="Confirmar senha"
                  outlined
                  required
                  class="q-mb-md"
                />

              </q-card-section>
            </q-card>

            <q-card
              dark
              elevated
              class="bg-white q-mb-md"
              style="border: 1px solid rgba(0, 0, 0, 0.12)"
            >
              <q-card-section>
                <div class="text-h6 text-black">Loja</div>
              </q-card-section>

              <q-separator dark inset />

              <q-card-section>
                <q-input
                  v-model="nameStore"
                  label="Nome Completo"
                  outlined
                  required
                  class="q-mb-md"
                />
                <q-input
                  v-model="categoria"
                  label="categoria"
                  outlined
                  required
                  class="q-mb-md"
                />
                <q-input
                  v-model="horario_funcionamento"
                  label="horario_funcionamento"
                  outlined
                  required
                  class="q-mb-md"
                />

                <q-input
                  v-model="localizacao"
                  label="localizacao"
                  outlined
                  required
                  class="q-mb-md"
                />

                <q-input
                  v-model="numero"
                  label="Telefone"
                  outlined
                  required
                  class="q-mb-md"
                />

                <q-input
                  v-model="descricao"
                  label="descricao"
                  outlined
                  required
                  type="textarea"
                  rows="5"
                  counter
                  maxlength="500"
                  class="q-mb-md"
                />

                <q-input
                  v-model="perfil_foto"
                  label="perfil_foto"
                  outlined
                  required
                  class="q-mb-md"
                />

                <q-input
                  v-model="capa_foto"
                  label="capa_foto"
                  outlined
                  required
                  class="q-mb-md"
                />

                <q-btn
                  style="width: 100%; background-color: #ed2024; color: white"
                  label="Cadastrar Loja"
                  @click="createStore"
                  rounded
                />
              </q-card-section>
            </q-card>

            <q-card
              dark
              class="bg-white q-mb-md"
              style="border: 1px solid rgba(0, 0, 0, 0.12)"
            >
              <q-card-section>
                <div class="text-h6 text-black">Imagens</div>
              </q-card-section>

              <q-separator dark inset />

              <q-card-section>
                <input
                  type="file"
                  @change="previewImage"
                  multiple
                  accept="image/*"
                />
                <div class="image-preview">
                  <img
                    v-if="imagePreview"
                    :src="imagePreview"
                    class="preview-image"
                  />
                  <img
                    v-for="image in imagePreview"
                    :key="image"
                    :src="image"
                    class="preview-image"
                  />
                </div>
              </q-card-section>
            </q-card>
          </q-card-section>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { onBeforeUnmount } from "vue";
import { useQuasar } from "quasar";
// import $api from "src/router/api.js";
// import store from "../../store";

export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
      password2: "",
      name: "",
      morrada: "",
      telefone: "",

      isMobile: false,
      usersList: null,
      selectedUser:null,

      userEmail: "",
      nameStore: "",
      categoria: "",
      horario_funcionamento: "",
      localizacao: "",
      numero: "",
      descricao: "",
      // perfil_foto: "",
      // capa_foto: "",
      images:null,
    };
  },
  created() {
    this.isMobile = this.$q.screen.lt.md;
    const isloged = localStorage.getItem("token");
    if (isloged) {
      // this.$router.go(-1);
    }
  },
  created() {
    this.showBackButton(true);
  },
  methods: {
    showBackButton(value) {
      // store.getters.showBackButton(value);
    },
    previewImage(event) {
      this.imagePreview = [];
      this.images =null; // Limpa as prévias de imagem anteriores
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) {
          continue; // Ignora arquivos que não são imagens
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          // Suponha que result.assets[0].uri contém a imagem em formato base64
          const imageBase64 = e.target.result;

          // Remova o prefixo 'data:image/jpeg;base64,' se estiver presente
          const base64Content = imageBase64.replace(
            /^data:image\/\w+;base64,/,
            ""
          );

          // Converta a string base64 em um ArrayBuffer
          const arrayBuffer = new Uint8Array(
            atob(base64Content)
              .split("")
              .map((char) => char.charCodeAt(0))
          ).buffer;

          // Crie um objeto Blob a partir do ArrayBuffer
          const blob = new Blob([arrayBuffer], { type: "image/jpeg" });
          this.imagePreview.push(e.target.result);
          this.images=blob; // Adiciona o URL da imagem ao array de prévias
        };
        reader.readAsDataURL(file);
      }
    },



    createStore: async function () {
      if (
        !this.name ||
        !this.nameStore||
        !this.email ||
        !this.password ||
        !this.password2||
        !this.nameStore ||
        !this.categoria ||
        !this.horario_funcionamento ||
        !this.localizacao ||
        !this.descricao ||
        !this.nameStore ||
        !this.images ||
        // !this.capa_foto ||
        !this.numero
      ) {
        this.triggerWarning("preencha todos os campos!");
        return;
      }


      if (this.password !== this.password2) {
        this.showNegative("As senhas devem ser iguais!");
        return;
      }

      try {
        const store = {
          name: this.name,
          nome: this.nameStore,
          categoria: this.categoria,
          horario_funcionamento: this.horario_funcionamento,
          localizacao: this.localizacao,
          numero: this.numero,
          descricao: this.descricao,
          perfil_foto: this.images,
          // capa_foto: this.capa_foto,
          email: this.email,
          password: this.password,
        };
        this.showLoading();

        const response = await $api.createEmpresa(store);
        console.log(store);
        // this.$router.push("/user/" + response.data.id);
        this.hideLoading();
      } catch (error) {
        this.hideLoading();
        console.error(error);
        // if (error.response.status == 401) {
        this.showNegative("Aconteceu algum erro, tente novamente");
        // }
      } finally {
         this.hideLoading();
      }
    },

    getUsersList() {
      $api
        .getUsersByEmail(this.userEmail)
        .then((response) => {
          this.usersList = response.data.users;
          console.log(response.data.users);
        })
        .catch((error) => {
          console.error("Erro ao obter categorias:", error);
        });
    },

    selectUser(user){
      this.name = user.name,
      this.email=user.email,
      this.selectedUser=user;
      this.dialog = !this.dialog;
    },
    resetUser(){
      this.selectedUser=null;
      this.name = null;
      this.email=null;
    }
  },
  setup() {
    const imagePreview = ref(null);
    const $q = useQuasar();
    const router = useRouter();

    onBeforeUnmount(() => {
      $q.loading.hide();
    });

    const dialog = ref(false);

    return {
    imagePreview,
      dialog,
      openDialog() {
        dialog.value = !dialog.value;
      },
      showLoading() {
        $q.loading.show();
      },
      hideLoading() {
        $q.loading.hide();
      },
      showNegative(msg) {
        $q.notify({
          type: "negative",
          message: msg,
        });
      },
      triggerWarning(msg) {
        $q.notify({
          type: "warning",
          message: msg,
        });
      },
    };
  },
};
</script>

<style scoped></style>
