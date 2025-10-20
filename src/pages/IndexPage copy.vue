<template>
  <q-page class="flex flex-center" style="background-color: #F2F2F2;">
    <div class="q-pa-md">
      <!-- Sender Information -->
      <q-card class="q-mb-md">
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
      </q-card>

      <!-- Receiver Information -->
      <q-card class="q-mb-md">
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
      </q-card>

      <!-- Package Details -->
      <q-card>
        <q-card-section>
          <div class="text-h5 text-bold text-center">Detalhes do Pacote</div>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="submitForm">
            <q-input
              filled
              v-model="form.origem"
              label="Origem"
              required
              prepend-icon="place"
              class="q-mt-md"
            />
            <q-input
              filled
              v-model="form.destino"
              label="Destino"
              required
              prepend-icon="place"
              class="q-mt-md"
            />
            <q-select
              filled
              v-model="form.service"
              :options="serviceOptions"
              label="Serviço"
              required
              prepend-icon="work"
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
          </q-form>
        </q-card-section>
      </q-card>

      <!-- Additional Information -->
      <q-card>
        <q-card-section>
          <div class="text-h5 text-bold text-center">
            Informações Adicionais
          </div>
        </q-card-section>
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
          </q-form>
        </q-card-section>
      </q-card>

      <!-- Items Information (if applicable) -->
      <q-card v-if="showItemsSection">
        <q-card-section>
          <div class="text-h5 text-bold text-center">Itens do Pacote</div>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="submitForm">
            <!-- Form fields for items if needed -->
            <!-- Example: dynamic fields for item description, dimensions, quantity -->
          </q-form>
        </q-card-section>
      </q-card>

      <!-- Submit Button -->
      <q-btn
        type="submit"
        label="Enviar"
        color="primary"
        @click="submitForm"
        class="full-width q-mt-lg"
      />
    </div>
  </q-page>
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
        service: "",
        nota: "",
        horaDeLevantamento: "",
        horaDeEntrega: "",
        valor: 0,
        items: [], // Example: array to hold item details
      },
      serviceOptions: ["DELIVER_MAN", "TRACK"], // Example: service options
      showItemsSection: false, // Example: flag to show/hide item section based on logic
    };
  },
  methods: {
    async submitForm() {
      try {
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
        const response = await apiMethods.storePackage(requestData);

        // Handle successful response
        console.log("Package stored successfully:", response);

        // Show success message to user
        this.$q.notify({
          color: "green",
          textColor: "white",
          icon: "cloud_done",
          message: "Pacote cadastrado com sucesso!",
        });

        // Reset form after successful submission
        this.resetForm();
      } catch (error) {
        // Handle error response from API
        console.error("Erro ao cadastrar pacote:", error);

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
};
</script>

<style scoped>
/* Add custom styles if needed */
</style>
