<template>
  <HeaderC />
  <div class="q-pa-md">
    <q-card class="q-pa-md">
      <q-card-section class="klc">
        <div class="text-h6">Junte-se ao KLC Market</div>
        <div class="q-mt-md">
          <p>
            Expanda seu negócio! O nosso marketplace oferece uma plataforma
            segura, prática e eficiente para você vender seus produtos,
            conquistar novos clientes e impulsionar as suas vendas. Preencha o
            cadastro de vendedor com o seu perfil, informações sobre seus
            produtos e canais de venda. Estamos prontos para ajudá-lo a crescer
            no mundo digital!
          </p>
        </div>
      </q-card-section>

      <q-stepper v-model="step" vertical header-nav animated color="primary">
        <q-step
          :name="1"
          title="Perfil do Vendedor e Produtos"
          icon="store"
          :done="step > 1"
        >
          <div class="input-container">
            <label for="nome" class="input-label"
              >Qual é o nome da sua loja ou marca? *</label
            >
            <q-input
              id="nome"
              v-model="form.nome"
              filled
              class="q-mb-md input-field"
              :rules="[val => !!val || 'Campo obrigatório']"
              lazy-rules
              @blur="validateField('nome')"
            />
          </div>

          <div class="input-container">
            <label for="nomep" class="input-label">Qual seu o nome? *</label>
            <q-input
              id="nomep"
              v-model="form.nomep"
              filled
              class="q-mb-md input-field"
              :rules="[val => !!val || 'Campo obrigatório']"
              lazy-rules
              @blur="validateField('nomep')"
            />
          </div>
          <div class="input-container">
            <label for="fabricacao" class="input-label">Tipo de Loja *</label>
            <q-select
              id="fabricacao"
              v-model="form.lojaFisicaOuOnline"
              :options="['Física ', 'Online', 'Ambos']"
              filled
              class="q-mb-md input-field"
              :rules="[val => !!val || 'Campo obrigatório']"
              lazy-rules
              @blur="validateField('lojaFisicaOuOnline')"
            />
          </div>
          <div class="input-container">
            <label for="descricao" class="input-label"
              >Breve descrição da loja: *</label
            >
            <q-input
              id="descricao"
              v-model="form.descricao"
              type="textarea"
              filled
              autogrow
              placeholder="Ex: Loja especializada em eletrônicos e acessórios..."
              class="q-mb-md input-field"
              :rules="[val => !!val || 'Campo obrigatório']"
              lazy-rules
              @blur="validateField('descricao')"
            />
          </div>
          <div class="input-container">
            <label for="nome" class="input-label">Localização exacta *</label>
            <q-input
              id="nome"
              v-model="form.localizacao"
              filled
              class="q-mb-md input-field"
              placeholder="Ex: Av. Eduardo Mondlane, nº 123, Maputo"
              :rules="[val => !!val || 'Campo obrigatório']"
              lazy-rules
              @blur="validateField('localizacao')"
            />
          </div>
          <div class="input-container">
            <label for="horario" class="input-label"
              >Horário de funcionamento: *</label
            >
            <q-input
              id="horario"
              v-model="form.horario"
              filled
              placeholder="Ex: Seg-Sex, 08h00 - 18h00"
              class="q-mb-md input-field"
              :rules="[val => !!val || 'Campo obrigatório']"
              lazy-rules
              @blur="validateField('horario')"
            />
          </div>
          <div class="input-container">
            <label for="telefone" class="input-label">Número de telefone *</label>
            <q-input
              id="telefone"
              v-model="form.telefone"
              filled
              class="q-mb-md input-field"
              :rules="[val => !!val || 'Campo obrigatório']"
              lazy-rules
              @blur="validateField('telefone')"
            />
          </div>
          <div class="input-container">
            <label for="produtos" class="input-label"
              >Quais tipos de produtos você vende? *</label
            >
            <q-input
              id="produtos"
              v-model="form.produtos"
              filled
              class="q-mb-md input-field"
              :rules="[val => !!val || 'Campo obrigatório']"
              lazy-rules
              @blur="validateField('produtos')"
            />
          </div>
          <div class="input-container">
            <label for="fabricacao" class="input-label"
              >Seus produtos são de fabricação própria, revendidos ou
              ambos? *</label
            >
            <q-select
              id="fabricacao"
              v-model="form.fabricacao"
              :options="['Fabricação própria', 'Revenda', 'Ambos']"
              filled
              class="q-mb-md input-field"
              :rules="[val => !!val || 'Campo obrigatório']"
              lazy-rules
              @blur="validateField('fabricacao')"
            />
          </div>
          <div class="input-container">
            <label for="vendasMensais" class="input-label"
              >Qual o seu volume médio de vendas mensal? *</label
            >
            <q-input
              id="vendasMensais"
              v-model="form.vendasMensais"
              filled
              type="number"
              class="q-mb-md input-field"
              :rules="[val => !!val || 'Campo obrigatório']"
              lazy-rules
              @blur="validateField('vendasMensais')"
            />
          </div>
        </q-step>

        <q-step
          :name="2"
          title="Forma de Entrega"
          icon="local_shipping"
          :done="step > 2"
        >
          <div class="input-container">
            <label for="entrega" class="input-label"
              >Seus produtos estão disponíveis para entrega imediata ou sob
              encomenda? *</label
            >
            <q-select
              id="entrega"
              v-model="form.entrega"
              :options="['Imediata', 'Sob encomenda', 'Ambas']"
              filled
              class="q-mb-md input-field"
              :rules="[val => !!val || 'Campo obrigatório']"
              lazy-rules
              @blur="validateField('entrega')"
            />
          </div>
          <div class="input-container">
            <label for="tempoEntrega" class="input-label"
              >Qual é o tempo médio de entrega para produtos sob
              encomenda? *</label
            >
            <q-input
              id="tempoEntrega"
              v-model="form.tempoEntrega"
              filled
              class="q-mb-md input-field"
              :rules="[val => !!val || 'Campo obrigatório']"
              lazy-rules
              @blur="validateField('tempoEntrega')"
            />
          </div>
          <div class="input-container">
            <label for="logistica" class="input-label"
              >Você já possui uma logística própria para entrega ou precisa de
              suporte nesse aspecto? *</label
            >
            <q-select
              id="logistica"
              v-model="form.logistica"
              :options="['Possuo logística própria', 'Preciso de suporte']"
              filled
              class="q-mb-md input-field"
              :rules="[val => !!val || 'Campo obrigatório']"
              lazy-rules
              @blur="validateField('logistica')"
            />
          </div>
        </q-step>

        <q-step
          :name="3"
          title="Experiência e Desafios na Venda Online"
          icon="shopping_cart"
          :done="step > 3"
        >
          <div class="input-container">
            <label for="canaisVenda" class="input-label"
              >Você já vende seus produtos online? Se sim, por quais
              canais? *</label
            >
            <q-input
              id="canaisVenda"
              v-model="form.canaisVenda"
              filled
              class="q-mb-md input-field"
              :rules="[val => !!val || 'Campo obrigatório']"
              lazy-rules
              @blur="validateField('canaisVenda')"
            />
          </div>
          <div class="input-container">
            <label for="desafios" class="input-label"
              >Quais desafios você enfrenta ao vender online? *</label
            >
            <q-input
              id="desafios"
              v-model="form.desafios"
              filled
              type="textarea"
              class="q-mb-md input-field"
              :rules="[val => !!val || 'Campo obrigatório']"
              lazy-rules
              @blur="validateField('desafios')"
            />
          </div>
          <div class="input-container">
            <label for="motivacaoMarketplace" class="input-label"
              >O que mais te motivaria a usar um marketplace para vender seus
              produtos? *</label
            >
            <q-input
              id="motivacaoMarketplace"
              v-model="form.motivacaoMarketplace"
              filled
              type="textarea"
              class="q-mb-md input-field"
              :rules="[val => !!val || 'Campo obrigatório']"
              lazy-rules
              @blur="validateField('motivacaoMarketplace')"
            />
          </div>
        </q-step>

        <q-step
          :name="4"
          title="Pagamento e Preferências"
          icon="payments"
          :done="step > 4"
        >
          <div class="input-container">
            <label for="pagamentoAceito" class="input-label"
              >Quais métodos de pagamento você aceita atualmente? *</label
            >
            <q-select
              id="pagamentoAceito"
              v-model="form.pagamentoAceito"
              multiple
              :options="[
                'M-Pesa',
                'E-mola',
                'Transferência Bancária',
                'Dinheiro',
                'Cartão',
              ]"
              filled
              class="q-mb-md input-field"
              :rules="[val => val && val.length > 0 || 'Selecione pelo menos um método']"
              lazy-rules
              @blur="validateField('pagamentoAceito')"
            />
          </div>
          <div class="input-container">
            <label for="pagamentoTipo" class="input-label"
              >Você aceita pagamento antecipado, no ato da entrega ou ambas as
              opções? *</label
            >
            <q-select
              id="pagamentoTipo"
              v-model="form.pagamentoTipo"
              :options="['Antecipado', 'Na Entrega', 'Ambos']"
              filled
              class="q-mb-md input-field"
              :rules="[val => !!val || 'Campo obrigatório']"
              lazy-rules
              @blur="validateField('pagamentoTipo')"
            />
          </div>
          <div class="input-container">
            <label for="novosPagamentos" class="input-label"
              >Você gostaria de integrar novos métodos de pagamento através do
              marketplace? Se sim, quais? *</label
            >
            <q-input
              id="novosPagamentos"
              v-model="form.novosPagamentos"
              filled
              class="q-mb-md input-field"
              :rules="[val => !!val || 'Campo obrigatório']"
              lazy-rules
              @blur="validateField('novosPagamentos')"
            />
          </div>
          <div class="input-container">
            <label for="recebimento" class="input-label"
              >Você prefere receber os pagamentos imediatamente ou
              periodicamente? *</label
            >
            <q-select
              id="recebimento"
              v-model="form.recebimento"
              :options="['Imediatamente', 'Semanalmente', 'Mensalmente']"
              filled
              class="q-mb-md input-field"
              :rules="[val => !!val || 'Campo obrigatório']"
              lazy-rules
              @blur="validateField('recebimento')"
            />
          </div>
        </q-step>

        <q-step :name="5" title="Necessidades e Expectativas" icon="support">
          <div class="input-container">
            <label for="expectativas" class="input-label"
              >O que você espera de um marketplace para facilitar suas
              vendas? *</label
            >
            <q-input
              id="expectativas"
              v-model="form.expectativas"
              filled
              type="textarea"
              class="q-mb-md input-field"
              :rules="[val => !!val || 'Campo obrigatório']"
              lazy-rules
              @blur="validateField('expectativas')"
            />
          </div>
          <div class="input-container">
            <label for="suporteFotos" class="input-label"
              >Você gostaria de receber suporte com fotos e descrições
              profissionais dos seus produtos? *</label
            >
            <q-select
              id="suporteFotos"
              v-model="form.suporteFotos"
              :options="['Sim', 'Não']"
              filled
              class="q-mb-md input-field"
              :rules="[val => !!val || 'Campo obrigatório']"
              lazy-rules
              @blur="validateField('suporteFotos')"
            />
          </div>
          <div class="input-container">
            <label for="preocupacoes" class="input-label"
              >Qual a sua maior preocupação ao vender em um marketplace? *</label
            >
            <q-input
              id="preocupacoes"
              v-model="form.preocupacoes"
              filled
              type="textarea"
              class="q-mb-md input-field"
              :rules="[val => !!val || 'Campo obrigatório']"
              lazy-rules
              @blur="validateField('preocupacoes')"
            />
          </div>
          <div class="input-container">
            <label for="promocoes" class="input-label"
              >Você estaria interessado em participar de promoções e descontos
              oferecidos pelo marketplace? *</label
            >
            <q-select
              id="promocoes"
              v-model="form.promocoes"
              :options="['Sim', 'Não']"
              filled
              class="q-mb-md input-field"
              :rules="[val => !!val || 'Campo obrigatório']"
              lazy-rules
              @blur="validateField('promocoes')"
            />
          </div>
        </q-step>
      </q-stepper>

      <q-btn
        v-if="step === 5"
        label="Enviar Cadastro"
        color="primary"
        @click="enviarFormulario"
        :disable="!isStep5Valid"
        :class="{ 'btn-disabled': !isStep5Valid }"
      />

      <q-btn
        v-if="step < 5"
        label="Próximo Passo"
        color="primary"
        @click="proximaEtapa"
        :disable="!canProceed"
        :class="{ 'btn-disabled': !canProceed }"
      />
    </q-card>
  </div>
  <FooterC />
</template>

<script>
import HeaderC from "components/store/HeaderC.vue";
import FooterC from "components/store/FooterC.vue";

export default {
  name: "ModeloListagem",
  components: {
    HeaderC,
    FooterC,
  },
  data() {
    return {
      step: 1,
      form: {
        nome: "",
        nomep: "",
        telefone: "",
        produtos: "",
        fabricacao: "",
        vendasMensais: "",
        entrega: "",
        tempoEntrega: "",
        logistica: "",
        canaisVenda: "",
        desafios: "",
        motivacaoMarketplace: "",
        pagamentoAceito: [],
        pagamentoTipo: "",
        novosPagamentos: "",
        recebimento: "",
        expectativas: "",
        suporteFotos: "",
        preocupacoes: "",
        promocoes: "",
        localizacao: "",
        lojaFisica: "",
        lojaFisicaOuOnline: "",
        horario: "",
        descricao: "",
      },
      validation: {
        step1: false,
        step2: false,
        step3: false,
        step4: false,
        step5: false,
      }
    };
  },
  computed: {
    canProceed() {
      switch (this.step) {
        case 1:
          return this.isStep1Valid;
        case 2:
          return this.isStep2Valid;
        case 3:
          return this.isStep3Valid;
        case 4:
          return this.isStep4Valid;
        default:
          return false;
      }
    },
    isStep1Valid() {
      return !!(
        this.form.nome &&
        this.form.nomep &&
        this.form.lojaFisicaOuOnline &&
        this.form.descricao &&
        this.form.localizacao &&
        this.form.horario &&
        this.form.telefone &&
        this.form.produtos &&
        this.form.fabricacao &&
        this.form.vendasMensais
      );
    },
    isStep2Valid() {
      return !!(
        this.form.entrega &&
        this.form.tempoEntrega &&
        this.form.logistica
      );
    },
    isStep3Valid() {
      return !!(
        this.form.canaisVenda &&
        this.form.desafios &&
        this.form.motivacaoMarketplace
      );
    },
    isStep4Valid() {
      return !!(
        this.form.pagamentoAceito.length > 0 &&
        this.form.pagamentoTipo &&
        this.form.novosPagamentos &&
        this.form.recebimento
      );
    },
    isStep5Valid() {
      return !!(
        this.form.expectativas &&
        this.form.suporteFotos &&
        this.form.preocupacoes &&
        this.form.promocoes
      );
    }
  },
  methods: {
    validateField(field) {
      // Esta função é chamada no @blur para validar cada campo
      // A validação real é feita nas computed properties
      console.log(`Validando campo: ${field}`, this.form[field]);
    },
    enviarFormulario() {
      if (!this.isStep5Valid) {
        this.$q.notify({
          type: "negative",
          message: "Preencha todos os campos obrigatórios antes de enviar.",
        });
        return;
      }

      const mensagem = encodeURIComponent(`
    *Cadastro de Vendedores*

    *1. Localização:* ${this.form.localizacao}
    *2. Horário de Funcionamento:* ${this.form.horario}
    *3. Breve Descrição da Loja:* ${this.form.descricao}
    *4. Loja Física ou Online:* ${this.form.lojaFisicaOuOnline}
    *5. Nome da Loja:* ${this.form.nome}
    *6. Nome da Proprietario:* ${this.form.nomep}
    *7. Telefone:* ${this.form.telefone}
    *8. Produtos:* ${this.form.produtos}
    *9. Fabricação:* ${this.form.fabricacao}
    *10. Vendas Mensais:* ${this.form.vendasMensais}

    *11. Forma de Entrega:* ${this.form.entrega}
    *12. Tempo de Entrega:* ${this.form.tempoEntrega}
    *13. Logística:* ${this.form.logistica}

    *14. Canais de Venda:* ${this.form.canaisVenda}
    *15. Desafios:* ${this.form.desafios}
    *16. Motivação para Marketplace:* ${this.form.motivacaoMarketplace}

    *17. Métodos de Pagamento Aceitos:* ${this.form.pagamentoAceito.join(", ")}
    *18. Tipo de Pagamento:* ${this.form.pagamentoTipo}
    *19. Recebimento:* ${this.form.recebimento}

    *20. Expectativas:* ${this.form.expectativas}
    *21. Suporte com Fotos:* ${this.form.suporteFotos}
    *22. Preocupações:* ${this.form.preocupacoes}
    *23. Promoções:* ${this.form.promocoes}
  `);

      const numeroWhatsApp = "258873703909";

      const link = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;

      window.open(link, "_blank");
      console.log("Mensagem para enviar:", mensagem);
      this.$q.notify({
        type: "positive",
        message: "Cadastro enviado com sucesso!",
      });
    },
    proximaEtapa() {
      if (this.canProceed) {
        this.step++;
      } else {
        this.$q.notify({
          type: "negative",
          message: "Preencha todos os campos obrigatórios antes de continuar.",
        });
      }
    },
  },
};
</script>

<style scoped>
.input-container {
  margin-bottom: 20px;
}

.input-label {
  color: #bd6513;
  font-weight: bold;
}

.input-field {
  background-color: #f9f4e8;
}

.klc {
  background-color: #f5f0e1;
}

.btn-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-disabled:hover {
  transform: none !important;
}

/* Estilos para validação - apenas linha inferior */
:deep(.q-field--success .q-field__control:after) {
  background: #e08b1b !important;
  height: 2px !important;
}

:deep(.q-field--error .q-field__control:after) {
  background: #c10015 !important;
  height: 2px !important;
}

/* Remove outras cores de validação do Quasar */
:deep(.q-field--success) {
  color: inherit !important;
}

:deep(.q-field--error) {
  color: inherit !important;
}

:deep(.q-field--success .q-field__label) {
  color: inherit !important;
}

:deep(.q-field--error .q-field__label) {
  color: inherit !important;
}

:deep(.q-field--success .q-field__messages) {
  color: #c10015 !important;
}

:deep(.q-field--error .q-field__messages) {
  color: #c10015 !important;
}

/* Override Quasar colors para laranja */
:deep(.q-btn--primary) {
  background: #e08b1b !important;
}

:deep(.q-btn--primary:hover) {
  background: #c67a15 !important;
}

:deep(.q-stepper__tab--active) {
  color: #e08b1b !important;
}

:deep(.q-stepper__tab--active .q-stepper__dot) {
  background: #e08b1b !important;
}

:deep(.q-stepper__title) {
  color: #e08b1b !important;
}

:deep(.q-field--focused .q-field__control:after) {
  background: #e08b1b !important;
}

:deep(.q-field--focused .q-field__label) {
  color: #e08b1b !important;
}
</style>