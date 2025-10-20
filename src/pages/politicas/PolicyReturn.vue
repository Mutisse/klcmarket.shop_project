<template>
  <HeaderC />
  <!-- Toolbar -->
  <div>
    <q-toolbar
      style="
        width: 100%;
        display: flex;
        justify-content: center;
        z-index: 99;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      "
      class="bg-white q-pt-md q-pb-md"
    >
      <q-btn
        flat
        round
        dense
        size="md"
        icon="arrow_back"
        class="q-mr-sm"
        @click="voltar"
      ></q-btn>
      <div style="flex: 1; text-align: center">
        <q-toolbar-title>
          <div class="text-h41 text-primary q-mb-md">Política de Devolução</div>
        </q-toolbar-title>
      </div>
      <div style="width: 56px"></div>
      <!-- Placeholder to balance the space -->
    </q-toolbar>
  </div>

  <!-- Política de Devolução -->
  <div class="policies-section q-pa-md q-mt-lg">
    <q-card class="policy-card q-pa-md">
      <q-card-section>
        <p class="text-body1 q-mt-md">
          O KLC Market valoriza a confiança e a satisfação de seus clientes.
          Abaixo estão as diretrizes completas para devoluções e reembolsos.
        </p>

        <h3 class="text-h6 q-mt-md">1. Condições Gerais para Devolução</h3>
        <p class="text-body2">
          Para que um produto seja aceito para devolução, as seguintes condições
          devem ser atendidas:
        </p>
        <ul>
          <li>
            O pedido de devolução deve ser realizado em até
            <strong>7 dias corridos</strong> após o recebimento do produto.
          </li>
          <li>
            O produto deve estar <strong>em perfeitas condições</strong>, sem
            sinais de uso, manchas, danos ou alterações e não podem estar
            lavadas ou sujas.
          </li>
          <li>
            O item deve ser devolvido na <strong>embalagem original</strong>, ou
            em uma embalagem adequada.
          </li>
          <li>
            Todas as <strong>etiquetas e lacres</strong> originais devem estar
            intactos.
          </li>
        </ul>

        <h3 class="text-h6 q-mt-md">
          2. Produtos Não Elegíveis para Devolução
        </h3>
        <ul>
          <li>
            Roupas íntimas, peças de banho e acessórios de higiene pessoal.
          </li>
          <li>Produtos personalizados ou sob medida.</li>
          <li>
            Itens adquiridos em promoções com a indicação "Sem Troca ou
            Devolução".
          </li>
        </ul>

        <h3 class="text-h6 q-mt-md">3. Motivos Aceitos para Devolução</h3>
        <ul>
          <li>
            Defeito de Fabricação: O produto apresenta falhas ou defeitos
            identificados no momento do recebimento.
          </li>
          <li>
            Produto Incorreto: Foi enviado um item diferente do solicitado.
          </li>
          <li>Insatisfação com o produto dentro do prazo em 48h.</li>
        </ul>

        <h3 class="text-h6 q-mt-md">4. Como Solicitar a Devolução</h3>
        <ol>
          <li>
            <strong>Contato com o Suporte:</strong> Informe número do pedido,
            nome completo, motivo da devolução e fotos do produto.
          </li>
          <li>
            <strong>Análise do Pedido:</strong> Nossa equipe avaliará sua
            solicitação e enviará as instruções.
          </li>
          <li>
            <strong>Envio do Produto:</strong> Após a aprovação, o cliente
            deverá levar o produto para uma agência
            <strong>KLC Market</strong> indicada. O cliente é responsável por
            garantir que o produto seja entregue em condições adequadas e
            acompanhado do comprovante de compra no sistema.
          </li>
        </ol>

        <h3 class="text-h6 q-mt-md">5. Opções Após a Devolução</h3>
        <ul>
          <li>Troca por outro produto de valor equivalente ou superior.</li>
          <li>Reembolso.</li>
        </ul>

        <h3 class="text-h6 q-mt-md">6. Custos de Devolução</h3>
        <p>
          Custos de transporte serão cobertos pelo KLC Market em casos de erro
          da plataforma. Caso contrário, são responsabilidade do cliente.
        </p>

        <h3 class="text-h6 q-mt-md">7. Reembolsos e Prazos</h3>
        <ul>
          <li>
            Prazo de até <strong>10 dias úteis</strong> para reembolso após
            aprovação.
          </li>
          <li>Trocas processados em até <strong>5 dias úteis</strong>.</li>
        </ul>

        <h3 class="text-h6 q-mt-md">8. Produtos com Defeito ou Danificados</h3>

        <ul>
          <li>
            Informe imediatamente: Entre em contato com o suporte em até 48
            horas após o recebimento do item.
          </li>
          <li>
            Envie evidências: Forneça fotos detalhadas que comprovem os defeitos
            ou danos.
          </li>
          <li>
            Solução oferecida: Nossa equipe avaliará o caso e, se confirmado o
            problema, será oferecida uma substituição ou reembolso total.
          </li>
        </ul>
      </q-card-section>
    </q-card>
  </div>

  <!-- Seção de Contato -->
  <q-card class="contact-section q-pa-md q-mt-xl text-center">
    <q-card-section>
      <h2 class="text-h5 text-green">Ainda tem dúvidas?</h2>
      <p class="text-body1">
        Entre em contato com a nossa equipe de suporte via WhatsApp.
      </p>
      <q-btn
        label="Fale Conosco"
        color="primary"
        icon="chat"
        @click="contactSupport"
        class="q-mt-md"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import HeaderC from "components/store/HeaderC.vue";
export default {
  name: "FAQPage",
  components: {
    HeaderC,
  },
  methods: {
    contactSupport() {
      // Lógica para redirecionar ao WhatsApp
      window.open("https://wa.me/258873703909", "_blank");
    },
    voltar() {
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push("/");
      }
    },
  },
};
</script>

<style scoped>
.policies-section {
  max-width: 800px;
  margin: 0 auto;
}

.policy-card {
  background-color: #ffffff;
  border-radius: 8px;
}

.contact-section {
  max-width: 800px;
  margin: 0 auto;
  background-color: #007bff;
  color: white;
  border-radius: 8px;
}
</style>
