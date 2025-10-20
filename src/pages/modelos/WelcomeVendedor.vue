<template>
  <HeaderC />
  <div class="q-pa-md">
    <q-btn
      label="Abrir Guia do KLC Market"
      color="primary"
      @click="showModal('welcome')"
    />

    <q-dialog v-model="modal.open" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ modal.title }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p v-html="modal.content"></p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Fechar" color="primary" v-close-popup />
          <q-btn
            v-if="modal.next"
            flat
            label="Próximo"
            color="secondary"
            @click="showModal(modal.next)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
      modal: {
        open: false,
        title: "",
        content: "",
        next: null,
      },
      modalsContent: {
        welcome: {
          title: "Bem-vindo ao KLC Market!",
          content:
            "Estamos muito felizes em tê-lo(a) aqui. Vou explicar rapidamente como funciona nossa plataforma de vendas.",
          next: "about",
        },
        about: {
          title: "O que é o KLC Market?",
          content:
            "O KLC Market é um marketplace que conecta vendedores e compradores locais. Aqui, você pode cadastrar seus produtos, vendê-los e entregá-los de forma prática e segura.",
          next: "how_it_works",
        },
        how_it_works: {
          title: "Como Funciona?",
          content:
            "<b>Cadastro e Venda:</b><br>Você pode cadastrar seus produtos gratuitamente na plataforma.<br>Quando um cliente compra seu produto, o KLC Market organiza a entrega para você.",
          next: "delivery",
        },
        delivery: {
          title: "Entrega e Recolha",
          content:
            "As entregas e recolhas acontecem às segundas, quartas e sextas-feiras.<br>Seu produto deve estar pronto para recolha antes desses dias.",
          next: "payment",
        },
        payment: {
          title: "Pagamento",
          content:
            "<b>Cash on Delivery (COD):</b> O cliente paga no momento da entrega.<br>O valor das suas vendas é repassado ao fim de cada mês, semana ou dia, como preferir.",
          next: "fees",
        },
        fees: {
          title: "Comissão e Taxas",
          content:
            "Não cobramos taxa de cadastro.<br>Existe uma pequena comissão de 5% por venda, cobrada no final do dia.",
          next: "returns",
        },
        returns: {
          title: "Política de Devolução",
          content:
            "Aceitamos devoluções apenas em casos de defeito ou se o produto entregue for diferente do anunciado. O cliente tem até 1 dia para solicitar a devolução.",
          next: "security",
        },
        security: {
          title: "Segurança e Suporte",
          content:
            "O KLC Market se compromete com um ambiente seguro para vendedores e compradores.<br>Caso precise de ajuda, nossa equipe está disponível para auxiliar.",
          next: null,
        },
      },
      step: 1,
      form: {
        nome: "",
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
      },
    };
  },
  methods: {
    enviarFormulario() {
      const mensagem = encodeURIComponent(`
    *Cadastro de Vendedores*

    *1. Localização:* ${this.form.localizacao}
    *2. Loja Física ou Online:* ${this.form.lojaFisicaOuOnline}
    *3. Nome da Loja:* ${this.form.nome}
    *4. Telefone:* ${this.form.telefone}
    *5. Produtos:* ${this.form.produtos}
    *6. Fabricação:* ${this.form.fabricacao}
    *7. Vendas Mensais:* ${this.form.vendasMensais}

    *8. Forma de Entrega:* ${this.form.entrega}
    *9. Tempo de Entrega:* ${this.form.tempoEntrega}
    *10. Logística:* ${this.form.logistica}

    *11. Canais de Venda:* ${this.form.canaisVenda}
    *12. Desafios:* ${this.form.desafios}
    *13. Motivação para Marketplace:* ${this.form.motivacaoMarketplace}

    *14. Métodos de Pagamento Aceitos:* ${this.form.pagamentoAceito.join(", ")}
    *15. Tipo de Pagamento:* ${this.form.pagamentoTipo}
    *16. Recebimento:* ${this.form.recebimento}

    *17. Expectativas:* ${this.form.expectativas}
    *18. Suporte com Fotos:* ${this.form.suporteFotos}
    *19. Preocupações:* ${this.form.preocupacoes}
    *20.Promoções:* ${this.form.promocoes}
  `);

      const numeroWhatsApp = "258873703909"; // Número para envio

      // Aqui você pode usar uma API para enviar a mensagem via WhatsApp.
      const link = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;

      window.open(link, "_blank"); // Abre o WhatsApp com a mensagem
      console.log("Mensagem para enviar:", mensagem);
      this.$q.notify({
        type: "positive",
        message: "Cadastro enviado com sucesso!",
      });
    },
    podeAvancar() {
      const camposObrigatorios = {
        1: ["nome", "telefone", "produtos", "fabricacao", "vendasMensais"],
        2: ["entrega", "tempoEntrega", "logistica"],
        3: ["canaisVenda", "desafios", "motivacaoMarketplace"],
        4: ["pagamentoAceito", "pagamentoTipo", "recebimento"],
        5: [
          "expectativas",
          "suporteFotos",
          "preocupacoes",
          "promocoes",
          "localizacao",
          "lojaFisica",
        ],
      };

      return camposObrigatorios[this.step].every((campo) => {
        const valor = this.form[campo];
        return Array.isArray(valor) ? valor.length > 0 : valor.trim() !== "";
      });
    },
    showModal(key) {
      this.modal = { ...this.modalsContent[key], open: true };
    },
    proximaEtapa() {
      if (this.podeAvancar()) {
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
</style>
