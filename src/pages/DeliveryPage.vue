<template>
  <q-layout>
    <div class="q-mt-xl q-mb-md q-ml-md row justify-around">
      <div class="text-subtitle1 text-bold text-orange" style="font-size: 2rem">
        Glen Delivery
      </div>
      <q-btn
        style="border-radius: 1rem"
        class="col-2 bg-black text-grey"
        @click="toggleLeftDrawer"
        icon="menu"
      />
    </div>

    <q-stepper style="box-shadow: none;" v-model="step" vertical animated>
      <q-step
        :name="1"
        title="Detalhes do Pacote"
        caption="An ad group contains one or more ads which target a shared set of keywords."
        icon="create_new_folder"
        :done="step > 1"
      >
        <q-dialog v-model="itemsDialog" full-width>
          <q-card>
            <q-card-section>
              <div class="text-h6">Adicionar item</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input
                filled
                v-model="item.descricao"
                label="Descrição"
                required
                type="textarea"
                prepend-icon="description"
                class="q-mb-md"
              />
              <q-input
                filled
                v-model="item.dimensoes"
                label="Dimensões"
                required
                prepend-icon="zoom_out_map"
                class="q-mb-md"
              />
              <q-input
                filled
                v-model="item.quantidade"
                label="Quantidade"
                type="number"
                required
                prepend-icon="format_list_numbered"
                class="q-mb-md"
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
                  @change="onImageAdded(item, $event)"
                  class="upload-input"
                />
              </div>

              <div v-if="item.images.length > 0">
                <div
                  v-for="(image, imgIndex) in item.images"
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
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                @click="addItem"
                style="background-color: #f27c38; color: white"
                label="Adicionar item"
                v-close-popup
              />
              <q-btn
                flat
                label="cancelar"
                style="color: #f27c38"
                v-close-popup
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- Package Details -->
        <q-card-section>
          <div class="text-h6 text-bold">Detalhes do Pacote</div>
        </q-card-section>
        <q-card-section>
          <q-btn
            label="Adicionar item"
            style="background-color: #f29b30; color: white"
            @click="itemsDialog = true"
            class="q-mb-md full-width"
          />
          <q-card-section>
            <div class="text-h6 text-bold">Items</div>
          </q-card-section>

          <div v-for="(item, index) in form.items" :key="index" class="q-mb-md">
            <q-item
              clickable
              v-ripple
              class="rounded-borders"
              :class="$q.dark.isActive ? 'bg-grey-9 text-white' : 'bg-grey-2'"
            >
              <q-item-section avatar>
                <q-avatar rounded>
                  <div v-if="item.images.length > 0">
                    <img
                      :src="item.images[0]"
                      alt="Pré-visualização da imagem"
                      style="max-width: 100px; max-height: 100px"
                    />
                  </div>
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ item.descricao }}</q-item-label>
              </q-item-section>

              <q-item-section side class="row">
                <span>Qtd: {{ item.quantidade }}</span>
              </q-item-section>
              <q-btn style="color: #f27c38; right: -25px" flat icon="close" />
            </q-item>
          </div>
          <div v-if="form.items.length == 0" class="text-subtitle">
            Sem items
          </div>

          <q-card-section>
            <q-form @submit.prevent="submitForm">
              <q-input
                filled
                v-model="form.nota"
                label="Nota"
                type="textarea"
                prepend-icon="edit"
                class="q-mt-md"
              />
            </q-form>
          </q-card-section>
        </q-card-section>

        <q-stepper-navigation>
          <q-btn
            @click="step = 2"
            style="background-color: #f27c38; color: white"
            label="Continue"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="2"
        title="Informações de localização "
        caption="An ad group contains one or more ads which target a shared set of keywords."
        icon="create_new_folder"
        :done="step > 2"
      >
        <!-- Package Details -->
        <q-card-section>
          <div class="text-h5 text-bold text-center">
            Informações de localização
          </div>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="submitForm">
            <div class="row justify-between">
              <q-input
                filled
                v-model="form.origem"
                label="Origem"
                required
                prepend-icon="place"
                class="q-mt-md col-10"
              />

              <q-btn
                square
                style="background-color: #f27c38; color: white"
                icon="place"
                class="q-mt-md col-2"
              />
            </div>

            <div class="row justify-between">
              <q-input
                filled
                v-model="form.destino"
                label="Destino"
                required
                prepend-icon="place"
                class="q-mt-md col-10"
              />

              <q-btn
                square
                style="background-color: #f27c38; color: white"
                icon="place"
                class="q-mt-md col-2"
              />
            </div>

            <q-input
              filled
              v-model="form.horaDeLevantamento"
              label="Hora de Levantamento"
              type="time"
              prepend-icon="schedule"
              class="q-mt-md"
            />
            <q-input
              filled
              v-model="form.horaDeEntrega"
              label="Hora de Entrega"
              type="time"
              prepend-icon="schedule"
              class="q-mt-md"
            />

            <q-input
              filled
              v-model="form.valor"
              label="Valor"
              type="number"
              required
              prepend-icon="attach_money"
              class="q-mt-md"
            />
            <div class="text-subtitle">
              Digite o Valor disposto a pagar pelo servico!
            </div>
          </q-form>
        </q-card-section>

        <q-stepper-navigation>
          <q-btn
            style="background-color: #f27c38; color: white"
            type="submit"
            label="Continue"
            @click="step = 3"
          >
          </q-btn>
          <q-btn
            flat
            @click="step = 1"
            style="color: #f27c38"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="3"
        title="Informações de contacto"
        icon="settings"
        :done="step > 3"
      >
        <!-- Sender Information -->

        <q-card-section>
          <div class="text-h5 text-bold text-center">
            Informações do Remetente
          </div>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="submitForm">
            <q-input
              filled
              v-model="form.sender.name"
              label="Nome"
              required
              prepend-icon="person"
              class="q-mt-md"
            />
            <q-input
              filled
              v-model="form.sender.apelido"
              label="Apelido"
              required
              prepend-icon="person_pin"
              class="q-mt-md"
            />
            <q-input
              filled
              v-model="form.sender.telefone"
              label="Telefone"
              required
              prepend-icon="phone"
              class="q-mt-md"
            />
          </q-form>
        </q-card-section>

        <!-- Receiver Information -->

        <q-card-section>
          <div class="text-h5 text-bold text-center">
            Informações do Destinatário
          </div>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="submitForm">
            <q-input
              filled
              v-model="form.receiver.name"
              label="Nome"
              required
              prepend-icon="person"
              class="q-mt-md"
            />
            <q-input
              filled
              v-model="form.receiver.apelido"
              label="Apelido"
              required
              prepend-icon="person_pin"
              class="q-mt-md"
            />
            <q-input
              filled
              v-model="form.receiver.telefone"
              label="Telefone"
              required
              prepend-icon="phone"
              class="q-mt-md"
            />
          </q-form>
        </q-card-section>

        <q-stepper-navigation>
          <q-btn
            @click="step = 4"
            style="background-color: #f27c38; color: white"
            label="Continue"
          />

          <q-btn
            flat
            @click="step = 2"
            style="color: #f27c38"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="4"
        title="Resumo"
        caption="An ad group contains one or more ads which target a shared set of keywords."
        icon="create_new_folder"
        :done="step > 4"
      >
        <q-item v-ripple>
          <q-item-section side>
            <q-avatar icon="card_giftcard" rounded size="80px"> </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>Hoje</q-item-label>
            <q-item-label caption>agora</q-item-label>
          </q-item-section>
          <q-item-section side> {{ form.valor }} MT</q-item-section>
        </q-item>

        <q-timeline color="secondary">
          <q-timeline-entry
            title="Origem"
            :subtitle="form.origem"
            icon="my_location"
          >
            <div class="text-subtitle text-bold">
              {{ form.sender.name }}
            </div>
            <div>Hora De Levantamento: {{ form.horaDeLevantamento }}</div>
          </q-timeline-entry>

          <q-timeline-entry
            title="Destino"
            :subtitle="form.destino"
            icon="place"
          >
            <div class="text-subtitle text-bold">
              {{ form.receiver.name }}
            </div>
            <div>Hora de entrega: {{ form.horaDeEntrega }}</div>
          </q-timeline-entry>
        </q-timeline>

        <!-- Package Details -->

        <q-card-section>
          <q-card-section>
            <div class="text-h6 text-bold">Detalhes do Pacote</div>

            <div class="text-h61 text-bold">Items</div>
          </q-card-section>

          <div v-for="(item, index) in form.items" :key="index" class="q-mb-md">
            <q-item
              clickable
              v-ripple
              class="rounded-borders"
              :class="$q.dark.isActive ? 'bg-grey-9 text-white' : 'bg-grey-2'"
            >
              <q-item-section avatar>
                <q-avatar rounded>
                  <div v-if="item.images.length > 0">
                    <img
                      :src="item.images[0]"
                      alt="Pré-visualização da imagem"
                      style="max-width: 100px; max-height: 100px"
                    />
                  </div>
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ item.descricao }}</q-item-label>
              </q-item-section>

              <q-item-section side class="row">
                <span>Qtd: {{ item.quantidade }}</span>
              </q-item-section>
              <q-btn style="color: #f27c38; right: -25px" flat icon="close" />
            </q-item>
          </div>
          <div v-if="form.items.length == 0" class="text-subtitle">
            Sem items
          </div>

          <q-card-section>
            <q-form @submit.prevent="submitForm">
              <q-input
                filled
                v-model="form.nota"
                label="Nota"
                disable
                type="textarea"
                prepend-icon="edit"
                class="q-mt-md"
              />

              <q-input
                filled
                v-model="form.valor"
                label="Valor"
                disable
                prepend-icon="edit"
                class="q-mt-md"
              />
            </q-form>
          </q-card-section>
        </q-card-section>

        <q-stepper-navigation>
          <q-btn
            :disable="registering"
            style="background-color: #f27c38; color: white"
            type="submit"
            label="Enviar"
            @click="submitForm"
          >
            <q-spinner-hourglass v-if="registering" color="white" size="24px" />
          </q-btn>
          <q-btn
            flat
            @click="step = 3"
            style="color: #f27c38"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>

    <q-drawer v-model="leftDrawerOpen" show-if-above>
      <div class="text-start justify-center align-center row q-pt-xs">
        <img
          src="~assets/glen_delivery_logo_red_sem_fundo.png"
          alt="Logo"
          class="col-2"
          style="width: 100px"
        />
        <p class="text-bold col-8 items-center">Seu Parceiro de entregas</p>
      </div>
      <q-list>
        <q-item to="/" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="store" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Loja</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          v-if="user && user.scope != 'cliente'"
          :to="dashboard"
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>

        <!-- <q-item to="/current-orders" clickable v-ripple> -->
        <q-item v-if="user" to="/c/show-packs" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="list" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Pedidos Atuais</q-item-label>
          </q-item-section>
        </q-item>

        <!-- <q-item to="/delivery-history" clickable v-ripple> -->
        <q-item
          v-if="user && user.scope != 'cliente'"
          to="/c/show-packs"
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon name="history" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Histórico de Entregas</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="user" to="/c/profile" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Perfil</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/support" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="help" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Suporte</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="user" clickable @click="logout" v-ripple>
          <q-item-section avatar>
            <q-icon name="exit_to_app" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Sair</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="!user" clickable to="/login" v-ripple>
          <q-item-section avatar>
            <q-icon name="login" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Entrar</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="!user" clickable to="/register" v-ripple>
          <q-item-section avatar>
            <q-icon name="edit_note" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Criar Conta</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import apiMethods from "src/router/api.js"; // Verifique o alias utilizado, pode ser @ ou outro configurado no seu projeto Quasar

export default {
  name: "PackageFormPage",
  data() {
    return {
      form: {
        sender: {
          name: "",
          apelido: "",
          telefone: "",
        },
        receiver: {
          name: "",
          apelido: "",
          telefone: "",
        },
        origem: "",
        origemLat: 0,
        origemLong: 0,
        destino: "",
        destinoLat: 0,
        destinoLong: 0,
        service: "DELIVER_MAN",
        nota: "",
        horaDeLevantamento: "",
        horaDeEntrega: "",
        valor: 0,
        items: [],
        // Example: array to hold item details
      },
      item: {
        descricao: "",
        dimensoes: "",
        quantidade: "",
        images: [],
      },
      serviceOptions: ["DELIVER_MAN", "TRACK"], // Example: service options
      showItemsSection: false, // Example: flag to show/hide item section based on logic
      registering: false,
      leftDrawerOpen: false,
    };
  },
  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    async submitForm() {
      try {
        this.registering = true; // Define registering como true durante o login

        // Validate form fields
        if (!this.validateForm()) {
          return;
        }

        // Set submitting flag to true
        this.submitting = true;

        // Example: Prepare data to send to API
        const requestData = {
          sender: {
            name: this.form.sender.name,
            apelido: this.form.sender.apelido,
            telefone: this.form.sender.telefone,
          },
          origem: this.form.origem,
          origemLat: this.form.origemLat,
          origemLong: this.form.origemLong,
          receiver: {
            name: this.form.receiver.name,
            apelido: this.form.receiver.apelido,
            telefone: this.form.receiver.telefone,
          },
          destino: this.form.destino,
          destinoLat: this.form.destinoLat,
          destinoLong: this.form.destinoLong,
          service: this.form.service,
          nota: this.form.nota,
          horaDeLevantamento: this.form.horaDeLevantamento,
          horaDeEntrega: this.form.horaDeEntrega,
          valor: this.form.valor,
          items: this.form.items, // Example: pass items array if needed
        };

        // Call API method to store data
        const response = await apiMethods.personalizePedido(requestData);

        // Handle successful response
        console.log("Package stored successfully:", response);

        this.$router.push("/c/show-packs/" + response.data.id);
        // Show success message to user
        this.$q.notify({
          color: "green",
          textColor: "white",
          icon: "cloud_done",
          message: "Pacote cadastrado com sucesso!",
        });
        this.registering = false;

        // Reset form after successful submission
        this.resetForm();
      } catch (error) {
        // Handle error response from API
        console.error("Erro ao cadastrar pacote:", error);
        this.registering = false;
        // Show error message to user
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "report_problem",
          message: "Erro ao cadastrar pacote. Por favor, tente novamente.",
        });
      } finally {
        // Set submitting flag back to false
        this.submitting = false;
      }
    },
    addItem() {
      // Add new item object to items array
      this.form.items.push({
        descricao: this.item.descricao,
        dimensoes: this.item.dimensoes,
        quantidade: this.item.quantidade,
        images: [],
      });
      // console.log(this.form.items[this.form.items.length-1]);
      for (let i = 0; i < this.item.images.length; i++) {
        this.form.items[this.form.items.length - 1].images.push(
          this.item.images[i].preview
        );
      }
      console.log(this.form);
    },
    onImageAdded(item, event) {
      item.images = [];
      // Handle image upload for specific item
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          item.images.push({
            file: files[i],
            preview: e.target.result,
          });
        };
        reader.readAsDataURL(files[i]);
      }
    },

    validateForm() {
      // Example: Perform validation logic here
      // You can validate fields, check conditions, etc.
      // Return true if form is valid, false otherwise
      return true; // Placeholder, implement your logic
    },
    resetForm() {
      // Example: Reset form fields after submission
      this.form.sender.name = "";
      this.form.sender.apelido = "";
      this.form.sender.telefone = "";
      this.form.origem = "";
      this.form.origemLat = 0;
      this.form.origemLong = 0;
      this.form.receiver.name = "";
      this.form.receiver.apelido = "";
      this.form.receiver.telefone = "";
      this.form.destino = "";
      this.form.destinoLat = 0;
      this.form.destinoLong = 0;
      this.form.service = "";
      this.form.nota = "";
      this.form.horaDeLevantamento = "";
      this.form.horaDeEntrega = "";
      this.form.valor = 0;
      this.form.items = []; // Reset items array if needed
    },
  },
  setup() {
    return {
      step: ref(1),
      itemsDialog: ref(false),
    };
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
