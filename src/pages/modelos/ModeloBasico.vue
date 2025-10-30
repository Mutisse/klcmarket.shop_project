<template>
  <q-layout>
    <div ref="pdfContent" class="my-content">
      <HeaderC />

      <!-- Hero Section -->
      <q-banner
        class="text-white q-gutter-md q-pa-lg q-rounded-borders shadow-lg"
        style="background: linear-gradient(135deg, #bd6513, #a3560f)"
      >
        <div class="text-h3 q-mb-md text-bold" style="letter-spacing: 1px">
          Aumente Suas Vendas com Nossa Plataforma!
        </div>
        <div class="text-h6 q-mb-lg">
          Liste seus produtos exclusivamente no perfil da sua loja e aproveite
          uma estrutura de preços acessível e flexível.
        </div>
        <q-btn
          @click="contactSupport"
          color="primary"
          label="Comece Agora"
          class="q-mr-sm text-bold q-px-lg q-py-sm"
          style="
            background: linear-gradient(45deg, #bd6513, #d97c1a);
            border-radius: 30px;
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
            transition: transform 0.3s ease;
            color: white;
          "
        />
      </q-banner>

      <!-- Features Section -->
      <div>
        <div class="q-mt-md">
          <q-card flat bordered>
            <!-- Por Que Escolher Nossa Plataforma  -->
            <q-card-section>
              <div v-if="$q.screen.lt.sm" class="text-h5 text-center">
                <img
                  src="~assets/Click here-pana.png"
                  alt="Logo"
                  class="q-mb-md full-width"
                />
              </div>

              <div
                :class="
                  $q.screen.lt.sm ? '' : 'row items-center justify-around'
                "
              >
                <q-list class="col-5">
                  <div class="text-h4 q-mb-md" style="color: #bd6513">
                    Por Que Escolher Nossa Plataforma?
                  </div>

                  <q-item class="col-12">
                    <q-item-section>
                      <p class="text-h6" style="color: #5d4037">
                        Os produtos são listados tanto no perfil da loja dentro
                        do marketplace quanto em toda a plataforma. Esses
                        produtos aparecem na página inicial do marketplace,
                        recebem destaque em categorias gerais e podem ser
                        encontrados em resultados de busca globais. Assim, os
                        clientes podem acessar os produtos tanto pelo perfil da
                        loja quanto por meio de pesquisas e navegação em outras
                        áreas do marketplace, ampliando a visibilidade e alcance
                        dos itens.
                      </p>
                    </q-item-section>
                  </q-item>
                  <q-item class="q-mb-md q-pa-md bg-grey-1 rounded-borders">
                    <q-item-section avatar>
                      <q-icon
                        name="attach_money"
                        style="color: #bd6513"
                        size="2em"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label
                        class="text-h5 text-bold"
                        style="color: #bd6513"
                      >
                        Custos Reduzidos
                      </q-item-label>
                      <q-item-label caption class="text-grey-7 q-pt-xs">
                        O sistema oferece uma taxa fixa de 5% sobre cada venda,
                        garantindo previsibilidade e transparência.
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item class="q-mb-md q-pa-md bg-grey-1 rounded-borders">
                    <q-item-section avatar>
                      <q-icon
                        name="settings"
                        style="color: #bd6513"
                        size="2em"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label
                        class="text-h5 text-bold"
                        style="color: #bd6513"
                      >
                        Controle Total
                      </q-item-label>
                      <q-item-label caption class="text-grey-7 q-pt-xs">
                        O sistema oferece controle total aos vendedores,
                        permitindo gerenciar vendas, inventário e relatórios
                        financeiros em um painel intuitivo.
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item class="q-pa-md bg-grey-1 rounded-borders">
                    <q-item-section avatar>
                      <q-icon
                        name="visibility"
                        style="color: #bd6513"
                        size="2em"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label
                        class="text-h5 text-bold"
                        style="color: #bd6513"
                      >
                        Foco no Seu Público
                      </q-item-label>
                      <q-item-label caption class="text-grey-7 q-pt-xs">
                        Seu perfil será visível através de links diretos ou da
                        busca por seu perfil, atraindo clientes que já conhecem
                        sua loja.
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>

                <div v-if="$q.screen.gt.xs" class="col-5 text-h5 text-center">
                  <img
                    src="~assets/Click here-pana.png"
                    alt="Logo"
                    class="q-mb-md full-width"
                  />
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <!-- Estrutura de Preço -->
            <q-card-section class="q-pa-md q-gutter-md text-center">
              <div class="text-h4 q-mb-lg" style="color: #bd6513">
                Estrutura de Preço
              </div>
              <div
                :class="
                  $q.screen.lt.sm ? '' : 'row items-center justify-around'
                "
              >
                <div v-if="!$q.screen.lt.sm" class="text-h5 text-center col-3">
                  <img
                    src="~assets/Subscriber-bro.png"
                    alt="Logo"
                    class="q-mb-md full-width"
                  />
                </div>
                <div class="col-7">
                  <!-- Free Plan -->
                  <q-card
                    flat
                    bordered
                    class="q-mb-md rounded-lg"
                    style="background: #bd6513; color: white"
                  >
                    <q-card-section>
                      <div class="text-h5" style="color: #ffcc80">
                        Taxa de Comissão
                      </div>
                      <p class="q-mt-sm">
                        A plataforma cobra ao vendedor 5% de comissão sobre o
                        valor da venda, mínimo de 10 MZN por venda.
                      </p>
                    </q-card-section>
                  </q-card>

                  <!-- Basic Plan -->
                  <q-card
                    flat
                    bordered
                    class="q-mb-md rounded-lg"
                    style="background: #d97c1a; color: white"
                  >
                    <q-card-section>
                      <div class="text-h5">Cobrança da Taxa</div>
                      <p class="q-mt-sm">
                        As taxas são cobradas periodicamente (semanal ou
                        mensal). No final do período, um relatório é gerado com
                        o total das vendas e a taxa acumulada.
                      </p>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <!-- Benefícios -->
            <q-card-section
              class="q-pa-xl q-gutter-md rounded-lg shadow-lg bg-white"
            >
              <div
                class="text-h4 q-mb-xl text-center text-bold"
                style="color: #bd6513; letter-spacing: 1px"
              >
                Benefícios
              </div>

              <div v-if="$q.screen.lt.sm" class="text-h5 text-center">
                <img
                  src="~assets/Revenue-bro.png"
                  alt="Logo"
                  class="q-mb-md full-width"
                />
              </div>
              <div
                :class="
                  $q.screen.lt.sm ? '' : 'row items-center justify-around'
                "
              >
                <q-list padding separator class="col-6">
                  <q-item
                    class="q-pa-md q-mb-md"
                    style="background: #f5f5f5; border-radius: 12px"
                  >
                    <q-item-section avatar>
                      <q-icon
                        name="attach_money"
                        style="color: #bd6513"
                        size="xl"
                      />
                    </q-item-section>
                    <q-item-section>
                      <div class="text-h5 text-bold" style="color: #bd6513">
                        Custo Acessível
                      </div>
                      <p class="q-mt-sm text-subtitle2" style="color: #5d4037">
                        Ideal para vendedores que querem maximizar o retorno
                        sobre o investimento.
                      </p>
                    </q-item-section>
                  </q-item>

                  <q-item
                    class="q-pa-md q-mb-md"
                    style="background: #f5f5f5; border-radius: 12px"
                  >
                    <q-item-section avatar>
                      <q-icon
                        name="visibility"
                        style="color: #bd6513"
                        size="xl"
                      />
                    </q-item-section>
                    <q-item-section>
                      <div class="text-h5 text-bold" style="color: #bd6513">
                        Visibilidade Controlada
                      </div>
                      <p class="q-mt-sm text-subtitle2" style="color: #5d4037">
                        Atraia clientes específicos com links diretos.
                      </p>
                    </q-item-section>
                  </q-item>

                  <q-item
                    class="q-pa-md q-mb-md"
                    style="background: #f5f5f5; border-radius: 12px"
                  >
                    <q-item-section avatar>
                      <q-icon name="build" style="color: #bd6513" size="xl" />
                    </q-item-section>
                    <q-item-section>
                      <div class="text-h5 text-bold" style="color: #bd6513">
                        Flexibilidade
                      </div>
                      <p class="q-mt-sm text-subtitle2" style="color: #5d4037">
                        Adapte a aparência do seu perfil para se alinhar com sua
                        marca.
                      </p>
                    </q-item-section>
                  </q-item>
                </q-list>

                <div v-if="$q.screen.gt.xs" class="col-4 text-h5 text-center">
                  <img
                    src="~assets/Click here-pana.png"
                    alt="Logo"
                    class="q-mb-md full-width"
                  />
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section
              class="q-pa-xl q-gutter-md1 text-center text-white"
              style="
                background: linear-gradient(135deg, #bd6513, #d97c1a);
                border-radius: 16px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
              "
            >
              <div
                class="text-h4 q-mb-xl text-bold"
                style="letter-spacing: 1px"
              >
                Pronto para Começar?
              </div>

              <q-btn
                @click="contactSupport"
                color="primary"
                label="Inscreva-se Agora"
                class="q-mt-md text-bold q-px-xl q-py-md"
                style="
                  background: linear-gradient(45deg, #bd6513, #d97c1a);
                  border-radius: 50px;
                  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
                  transition: transform 0.3s ease;
                  color: white;
                "
                @mouseover="event.target.style.transform = 'scale(1.05)'"
                @mouseleave="event.target.style.transform = 'scale(1)'"
              />
            </q-card-section>

            <div class="f">
              <q-card class="q-pa-md q-rounded-borders shadow-2 bg-white">
                <q-card-section>
                  <q-expansion-item
                    label="Quais meios de pagamento posso oferecer na KLC Market?"
                    expand-separator
                    style="color: #bd6513"
                  >
                    <p class="q-pl-lg">
                      Na KLC Market, oferecemos flexibilidade para seus
                      clientes: eles somente podem por pagar no momento da
                      entrega ou ao retirar seu pedido.
                    </p>
                  </q-expansion-item>

                  <q-expansion-item
                    label="Por que vender na KLC Market?"
                    expand-separator
                    style="color: #bd6513"
                  >
                    <p class="q-pl-lg">
                      Enquanto os vendedores se beneficiam em ter seus produtos
                      à venda em um site que possibilita que alcancem um número
                      maior de clientes. A KLC Market deseja ajudar vendedores e
                      negócios a impulsionarem suas vendas, assegurando que
                      possam vender utilizando uma ferramenta simples e
                      confiável. Trabalhamos sempre para atrair mais
                      consumidores para nosso site por meio de nossa seleção de
                      produtos, conveniência e atendimento ao cliente.
                    </p>
                  </q-expansion-item>

                  <q-expansion-item
                    label="Quem pode vender na KLC Market?"
                    expand-separator
                    style="color: #bd6513"
                  >
                    <p class="q-pl-lg">
                      Para se cadastrar na KLC Market, qualquer pessoa ou
                      empresa deve possuir um Bilhete de Identidade (BI) e um
                      comprovativo de residência válido. Os comprovativos de
                      residência aceitos incluem:
                    </p>
                    <ul class="q-pl-lg">
                      <li>Conta de água ou eletricidade</li>
                      <li>Extrato bancário recente com endereço</li>
                      <li>Contrato de aluguel ou escritura de imóvel</li>
                      <li>
                        Documento oficial de órgão governamental que inclua o
                        endereço. Declaração do Bairro.
                      </li>
                    </ul>
                  </q-expansion-item>

                  <q-expansion-item
                    label="Quanto custa vender na KLC Market?"
                    expand-separator
                    style="color: #bd6513"
                  >
                    <p class="q-pl-lg">
                      Não possui mensalidade, porém existe uma comissão de 5%
                      por item vendido, comissão minima 10,00 MZN. Mais
                      informações sobre tarifas e preços disponiveis com o
                      suporte na KLC Market.
                    </p>
                  </q-expansion-item>

                  <q-expansion-item
                    label="Como eu gerencio minha conta na KLC Market?"
                    expand-separator
                    style="color: #bd6513"
                  >
                    <p class="q-pl-lg">
                      Toda a sua conta é gerenciada através da Seller Central da
                      KLC Market. Nesse sistema, você tem acesso a ferramentas
                      que vão te ajudar a gerenciar e crescer o seu negócio.
                    </p>
                  </q-expansion-item>

                  <q-expansion-item
                    label="Qual a tarifa de envio para os itens que eu vendo na KLC Market?"
                    expand-separator
                    style="color: #bd6513"
                  >
                    <p class="q-pl-lg">
                      Quando um cliente compra seus produtos, a KLC Market
                      aplica as configurações de envio que você definiu para
                      calcular a tarifa de envio por item, em cada pedido. Você
                      pode definir suas taxas de envio com um modelo baseado no
                      item. No plano de vendas Individual, a KLC Market define a
                      tarifa de envio.
                    </p>
                  </q-expansion-item>

                  <q-expansion-item
                    label="Como funciona a cobrança sob demanda, onde o vendedor paga apenas pelo que usou, mensal ou semanalmente?"
                    expand-separator
                    style="color: #bd6513"
                  >
                    <p class="q-pl-lg">
                      O vendedor recebe uma notificação sobre o valor que deve
                      ser pago, com instruções de pagamento. O pagamento da taxa
                      é feito manualmente via depósito ou transferência
                      bancária, ou ainda transferência usando nossas carteiras
                      moveis (Mpesa e E-mola) para a conta da plataforma.
                    </p>
                    <p class="q-pl-lg">
                      Caso o vendedor não pague até o prazo estipulado (mensal
                      ou semanal), o sistema pode aplicar penalidades, como
                      bloquear novas vendas até que a taxa seja paga. O sistema
                      mantém um registro do histórico de pagamentos e débitos.
                    </p>
                  </q-expansion-item>
                </q-card-section>
              </q-card>
            </div>
          </q-card>
        </div>
      </div>

      <FooterC />
    </div>
  </q-layout>
</template>

<script>
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
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
      saleAmount: 0,
      paymentMethod: null,
      result: false,
      paymentOptions: [
        { label: "Na hora", fee: 4.98 },
        { label: "7 dias", fee: 4.69 },
        { label: "14 dias", fee: 4.49 },
        { label: "30 dias", fee: 3.98 },
      ],
      receivedAmount: 0,
      rows: [
        { id: 1, name: "Item 1", price: "$10" },
        { id: 2, name: "Item 2", price: "$15" },
      ],
      columns: [
        { name: "id", required: true, label: "ID", align: "left", field: "id" },
        { name: "name", label: "Nome", align: "left", field: "name" },
        { name: "price", label: "Preço", align: "left", field: "price" },
      ],
    };
  },
  methods: {
    async generatePDF() {
      try {
        const pdfContent = this.$refs.pdfContent;
        const canvas = await html2canvas(pdfContent, {
          useCORS: true,
        });

        const imgData = canvas.toDataURL("image/png");
        const doc = new jsPDF("p", "mm", "a4");
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        doc.save("relatorio.pdf");
      } catch (error) {
        console.error("Erro ao gerar PDF:", error);
      }
    },
    contactSupport() {
      this.$router.push("/formulario");
    },
    simulate() {
      if (this.saleAmount > 0 && this.paymentMethod) {
        const fee = this.paymentMethod.fee;
        const fixedFee = this.paymentMethod.fixedFee || 0;

        this.receivedAmount =
          this.saleAmount - this.saleAmount * (fee / 100) - fixedFee;
        this.result = true;
      }
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
.my-card {
  max-width: 900px;
  margin: auto;
}
.q-header,
.q-footer {
  background-color: #bd6513;
}
.q-banner {
  background-color: #bd6513;
}
.q-btn {
  font-weight: bold;
}
</style>
