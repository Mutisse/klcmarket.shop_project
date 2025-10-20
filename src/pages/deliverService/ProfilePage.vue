<template>
  <q-page padding>
    <q-card class="q-ma-md">
      <q-card-section>
        <div class="text-h5">Perfil do Entregador</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-list>
          <q-item>
            <q-item-section>
              <q-avatar icon="person" size="100px"> </q-avatar>
              <q-item-label class="text-h6">Nome</q-item-label>
              <q-item-label>{{ user.name }}</q-item-label>
              <q-separator spaced />
              <q-item-label class="text-h6">Email</q-item-label>
              <q-item-label>{{ user.email }}</q-item-label>
              <q-separator spaced />
              <q-item-label class="text-h6" v-if="entregador"
                >Telefone</q-item-label
              >
              <q-item-label v-if="entregador">{{
                entregador.telefone
              }}</q-item-label>
              <q-separator spaced v-if="entregador" />
              <q-item-label class="text-h6" v-if="entregador"
                >Status</q-item-label
              >
              <q-item-label v-if="entregador">{{
                entregador.status
              }}</q-item-label>
              <q-separator spaced v-if="entregador" />
              <q-item-label class="text-h6" v-if="entregador"
                >Morada</q-item-label
              >
              <q-item-label v-if="entregador">{{
                entregador.morrada
              }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-separator />
        <div class="row q-gutter-md q-mt-md">
          <q-btn
            label="Editar Perfil"
            color="primary"
            @click="showEditProfileModal = true"
            icon="edit"
          />
          <q-btn
            label="Trocar Senha"
            color="secondary"
            @click="showChangePasswordModal = true"
            icon="lock"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Modal para Editar Perfil -->
    <q-dialog full-width

      maximized v-model="showEditProfileModal" persistent>
      <q-card>
        <q-header class="q-mb-md text-start bg-white text-black">
          <q-toolbar>
            <q-btn
              flat
              round
              dense
            @click="showEditProfileModal = false"
              size="md"
              icon="arrow_back"
            ></q-btn>
            <q-toolbar-title>
              <q-card-section style="padding-bottom: 0px; padding-top: 0px">
                <h2 v-show="entregador" class="text-h6">Editar perfil</h2>
                <h2 v-show="entregador == null" class="text-h6">Adicionar Entregador</h2>
              </q-card-section>
            </q-toolbar-title>

            <q-btn
              v-show="entregador == null"
              rounded
              dense
              label="Guardar"
              class="bg-green-2 glowing-shadow-add"
              type="submit"
              @click="SaveStore"
            ></q-btn>

            <q-btn
              v-show="entregador"
              rounded
              dense
              label="Atualizar"
              class="bg-green-2 glowing-shadow-update"
              @click="updateProfile"
            ></q-btn>

            <q-btn
              v-show="entregador"
              rounded
              dense
              class="bg-red-2 glowing-shadow-cancel"
              label="Apagar"
            />
          </q-toolbar>
        </q-header>
        <q-card-section>
          <div class="text-h6">Editar Perfil</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form class="q-gutter-md" @submit="updateProfile">
            <q-input filled v-model="form.name" label="Nome" />
            <q-input filled v-model="form.email" label="Email" />
            <q-input
              filled
              v-model="form.telefone"
              label="Telefone"
              v-if="entregador"
            />
            <q-input
              filled
              v-model="form.morrada"
              label="Morada"
              v-if="entregador"
            />

          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal para Trocar Senha -->
    <q-dialog full-width

maximized  v-model="showChangePasswordModal" persistent>
      <q-card >
        <q-header class="q-mb-md text-start bg-white text-black">
          <q-toolbar>
            <q-btn
              flat
              round
              dense
            @click="showChangePasswordModal = false"
              size="md"
              icon="arrow_back"
            ></q-btn>
            <q-toolbar-title>
              <q-card-section style="padding-bottom: 0px; padding-top: 0px">
                <h2 v-show="entregador" class="text-h6">Editar perfil</h2>
                <h2 v-show="entregador == null" class="text-h6">Adicionar Entregador</h2>
              </q-card-section>
            </q-toolbar-title>


            <q-btn
              rounded
              dense
              label="Atualizar"
              class="bg-green-2 glowing-shadow-update"
              @click="changePassword"
            ></q-btn>


          </q-toolbar>
        </q-header>
        <q-card-section>
          <div class="text-h6">Trocar Senha</div>
        </q-card-section>
        <q-separator />
        <q-card-section >
          <q-form class="q-gutter-md" @submit="changePassword">
            <q-input
              filled
              v-model="passwordForm.oldPassword"
              type="password"
              label="Senha Antiga"
            />
            <q-input
              filled
              v-model="passwordForm.newPassword"
              type="password"
              label="Nova Senha"
            />
            <q-input
              filled
              v-model="passwordForm.confirmPassword"
              type="password"
              label="Confirmar Nova Senha"
            />

          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      user: {
        id: 7,
        name: "Maria entregador",
        email: "et1@g.com",
        email_verified_at: null,
        created_at: "2024-07-17T05:53:12.000000Z",
        updated_at: "2024-07-17T05:53:12.000000Z",
        empresas: [],
        entregadores: [
          {
            id: 1,
            user_id: 7,
            telefone: "82987654321",
            status: "ATIVO",
            morrada: "Rua dos Navegantes, 456",
            created_at: "2024-07-17T05:53:12.000000Z",
            updated_at: "2024-07-17T05:53:12.000000Z",
          },
        ],
      },
      showEditProfileModal: false,
      showChangePasswordModal: false,
      form: {
        name: "Maria entregador",
        email: "et1@g.com",
        telefone: "82987654321",
        morrada: "Rua dos Navegantes, 456",
      },
      passwordForm: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    };
  },
  computed: {
    entregador() {
      return this.user.entregadores.length ? this.user.entregadores[0] : null;
    },
  },
  methods: {
    updateProfile() {
      // Lógica para atualizar o perfil
      console.log("Perfil atualizado", this.form);
      this.showEditProfileModal = false;
    },
    changePassword() {
      // Lógica para trocar a senha
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.$q.notify({
          type: "negative",
          message: "As senhas não coincidem",
        });
        return;
      }
      console.log("Senha trocada", this.passwordForm);
      this.showChangePasswordModal = false;
    },
  },
};
</script>

<style>
#ods {
}
</style>
