<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Configurações</div>
      </q-card-section>
      <q-card-section>
        <q-list>
          <q-item>
            <q-item-section>Notificações</q-item-section>
            <q-item-section side>
              <q-toggle v-model="notifications" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Idioma</q-item-section>
            <q-item-section side>
              <q-select v-model="language" :options="languages" />
            </q-item-section>
          </q-item>
          <!-- Adicione mais configurações conforme necessário -->
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      notifications: true,
      language: 'pt',
      languages: [
        { label: 'English', value: 'en' },
        { label: 'Português', value: 'pt' },
        // Adicione mais idiomas conforme necessário
      ],
    };
  },
};
</script>
