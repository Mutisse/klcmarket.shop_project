<template>
  <HeaderC />

  <div class="">
    <!-- Hero Section -->
    <q-banner
      class="text-white q-gutter-md q-pa-lg q-rounded-borders shadow-lg"
      style="background: linear-gradient(135deg, #1a237e, #311b92)"
    >
      <div class="text-h3 q-mb-md text-bold" style="letter-spacing: 1px">
        Aumente Suas Vendas com Nossa Plataforma!
      </div>
      <div class="text-h6 q-mb-lg">
        Liste seus produtos exclusivamente no perfil da sua loja e aproveite uma
        estrutura de preços acessível e flexível.
      </div>
      <q-btn
        @click="contactSupport"
        color="primary"
        label="Comece Agora"
        class="q-mr-sm text-bold q-px-lg q-py-sm"
        style="
          background: linear-gradient(45deg, #ff6f00, #ff9100);
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
            <div class="text-h4 q-mb-md">
              Por Que Escolher Nossa Plataforma?
            </div>

            <div v-if="$q.screen.lt.sm" class="text-h5 text-center">
              <img
                src="~assets/Click here-pana.png"
                alt="Logo"
                class="q-mb-md full-width"
              />
            </div>

            <div
              :class="$q.screen.lt.sm ? '' : 'row items-center justify-around'"
            >
              <q-list class="col-5">
                <q-item class="col-12">
                  <q-item-section>
                    <p>
                      Neste modelo, os produtos ou serviços são listados
                      exclusivamente no perfil da loja dentro do marketplace.
                      Esses produtos não aparecem na página inicial do
                      marketplace, nem recebem destaque em categorias gerais ou
                      resultados de busca globais. Eles só podem ser acessados
                      por meio do perfil específico da loja ou através de links
                      diretos compartilhados pelo vendedor.
                    </p>
                  </q-item-section>
                </q-item>
                <q-item class="q-mb-md q-pa-md bg-grey-1 rounded-borders">
                  <q-item-section avatar>
                    <q-icon
                      name="attach_money"
                      class="text-primary"
                      size="2em"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-h5 text-bold"
                      >Custos Reduzidos</q-item-label
                    >
                    <q-item-label caption class="text-grey-7 q-pt-xs">
                      Com nossas taxas de assinatura acessíveis, você mantém o
                      custo baixo enquanto se beneficia de uma presença online.
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item class="q-mb-md q-pa-md bg-grey-1 rounded-borders">
                  <q-item-section avatar>
                    <q-icon name="settings" class="text-primary" size="2em" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-h5 text-bold"
                      >Controle Total</q-item-label
                    >
                    <q-item-label caption class="text-grey-7 q-pt-xs">
                      Personalize seu perfil de loja e compartilhe links diretos
                      para seus produtos.
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item class="q-pa-md bg-grey-1 rounded-borders">
                  <q-item-section avatar>
                    <q-icon name="visibility" class="text-primary" size="2em" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-h5 text-bold"
                      >Foco no Seu Público</q-item-label
                    >
                    <q-item-label caption class="text-grey-7 q-pt-xs">
                      Seu perfil só será visível através de links diretos ou da
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
            <div class="text-h4 q-mb-lg">Estrutura de Preço</div>
            <div
              :class="$q.screen.lt.sm ? '' : 'row items-center justify-around'"
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
                <q-card flat bordered class="q-mb-md bg-grey-1 rounded-lg">
                  <q-card-section>
                    <div class="text-h5 text-primary">Assinatura Grátis</div>
                    <p class="q-mt-sm">
                      Até 10 produtos, comissão de 5% por venda, tema padrão
                      gratuito.
                    </p>
                  </q-card-section>
                  <q-card-actions align="center">
                    <q-btn flat color="primary" label="Comece Agora" />
                  </q-card-actions>
                </q-card>

                <!-- Basic Plan -->
                <q-card
                  flat
                  bordered
                  class="q-mb-md bg-primary text-white rounded-lg"
                >
                  <q-card-section>
                    <div class="text-h5">Assinatura Básica</div>
                    <p class="q-mt-sm">500 MZN/mês – Até 50 produtos.</p>
                  </q-card-section>
                </q-card>

                <!-- Advanced Plan -->
                <q-card
                  flat
                  bordered
                  class="q-mb-md bg-secondary text-white rounded-lg"
                >
                  <q-card-section>
                    <div class="text-h5">Assinatura Avançada</div>
                    <p class="q-mt-sm">1.000 MZN/mês – Até 200 produtos.</p>
                  </q-card-section>
                </q-card>

                <!-- Premium Plan -->
                <q-card
                  flat
                  bordered
                  class="q-mb-md bg-dark text-white rounded-lg"
                >
                  <q-card-section>
                    <div class="text-h5">Assinatura Premium</div>
                    <p class="q-mt-sm">2.500 MZN/mês – Produtos ilimitados.</p>
                  </q-card-section>
                </q-card>

                <!-- Commission and Customization Options -->
                <q-card flat bordered class="bg-grey-2 rounded-lg">
                  <q-card-section>
                    <div class="text-h6 text-dark">Comissão por Venda</div>
                    <p class="q-mt-sm">
                      Além da taxa de assinatura, o marketplace cobra uma
                      pequena comissão sobre cada venda realizada através do
                      perfil da loja.
                    </p>
                    <p class="q-mt-sm">
                      2% do valor da venda, mínimo de 10 MZN por venda.
                    </p>
                    <div class="text-h6 text-dark q-mt-md">
                      Opções de Personalização
                    </div>
                    <p class="q-mt-sm">
                      Tema Padrão: Gratuito<br />
                      Tema Personalizado: 300 MZN/mês<br />
                      Análise de Perfil: 500 MZN/mês
                    </p>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <!-- Benedicios -->
          <q-card-section
            class="q-pa-xl q-gutter-md bg-gradient text-white1 rounded-lg shadow-lg"
          >
            <div
              class="text-h4 q-mb-xl text-center text-bold"
              style="letter-spacing: 1px"
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
              :class="$q.screen.lt.sm ? '' : 'row items-center justify-around'"
            >
              <q-list padding separator class="transparent text-white1 col-6">
                <q-item
                  class="q-pa-md q-mb-md"
                  style="
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                  "
                >
                  <q-item-section avatar>
                    <q-icon name="attach_money" color="green-4" size="xl" />
                  </q-item-section>
                  <q-item-section>
                    <div class="text-h5 text-bold">Custo Acessível</div>
                    <p class="q-mt-sm text-subtitle2">
                      Ideal para vendedores que querem maximizar o retorno sobre
                      o investimento.
                    </p>
                  </q-item-section>
                </q-item>

                <q-item
                  class="q-pa-md q-mb-md"
                  style="
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                  "
                >
                  <q-item-section avatar>
                    <q-icon name="visibility" color="blue-4" size="xl" />
                  </q-item-section>
                  <q-item-section>
                    <div class="text-h5 text-bold">Visibilidade Controlada</div>
                    <p class="q-mt-sm text-subtitle2">
                      Atraia clientes específicos com links diretos.
                    </p>
                  </q-item-section>
                </q-item>

                <q-item
                  class="q-pa-md q-mb-md"
                  style="
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                  "
                >
                  <q-item-section avatar>
                    <q-icon name="build" color="orange-4" size="xl" />
                  </q-item-section>
                  <q-item-section>
                    <div class="text-h5 text-bold">Flexibilidade</div>
                    <p class="q-mt-sm text-subtitle2">
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

          <!-- Simulacao de venda -->
          <div
            class="q-gutter-md row justify-center items-center q-mt-md q-mb-md"
          >
            <!-- Caixa de Simulação -->
            <div
              class="col-12 col-md-5 q-pa-md q-rounded-borders shadow-2 bg-white"
            >
              <q-card-section>
                <div class="text-h5 text-center text-primary q-mb-lg">
                  Simule uma Venda
                </div>
                <q-input
                  v-model="saleAmount"
                  type="number"
                  label="Valor da venda"
                  outlined
                  dense
                  class="q-mb-md"
                />
                <q-select
                  v-model="paymentMethod"
                  label="Escolha a forma de pagamento"
                  :options="paymentOptions"
                  outlined
                  dense
                  class="q-mb-md"
                />
                <q-btn
                  @click="simulate"
                  label="Simular"
                  color="primary"
                  class="full-width q-mb-md"
                />
              </q-card-section>
            </div>

            <!-- Resultado da Simulação -->
            <div class="col-12 col-md-5">
              <div v-if="result">
                <q-card class="q-pa-md q-rounded-borders shadow-2 bg-light">
                  <q-card-section>
                    <div class="text-h6 text-center text-teal q-mb-md">
                      Resumo da Simulação
                    </div>
                    <q-separator />
                    <p class="q-mt-md">
                      <strong>Forma de Pagamento:</strong>
                      {{ paymentMethod.label }}
                    </p>
                    <p>
                      <strong>Taxa Aplicada:</strong> {{ paymentMethod.fee }}%
                    </p>
                    <p>
                      <strong>Você recebe:</strong>
                      {{ receivedAmount.toFixed(2) }} MZN
                    </p>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>

          <q-separator />

          <q-card-section
            class="q-pa-xl q-gutter-md1 text-center text-white"
            style="
              background: linear-gradient(135deg, #1a237e, #311b92);
              border-radius: 16px;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            "
          >
            <div class="text-h4 q-mb-xl text-bold" style="letter-spacing: 1px">
              Pronto para Começar?
            </div>

            <q-btn
              @click="contactSupport"
              color="primary"
              label="Inscreva-se Agora"
              class="q-mt-md text-bold q-px-xl q-py-md"
              style="
                background: linear-gradient(45deg, #ff6f00, #ff9100);
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
                >
                  <p class="q-pl-lg">
                    Na KLC Market, oferecemos flexibilidade para seus clientes:
                    eles somente podem por pagar no momento da entrega ou ao
                    retirar seu pedido.
                  </p>
                </q-expansion-item>

                <q-expansion-item
                  label="Por que vender na KLC Market?"
                  expand-separator
                >
                  <p class="q-pl-lg">
                    Enquanto os vendedores se beneficiam em ter seus produtos à
                    venda em um site que possibilita que alcancem um número
                    maior de clientes. A KLC Market deseja ajudar vendedores e
                    negócios a impulsionarem suas vendas, assegurando que possam
                    vender utilizando uma ferramenta simples e confiável.
                    Trabalhamos sempre para atrair mais consumidores para nosso
                    site por meio de nossa seleção de produtos, conveniência e
                    atendimento ao cliente.
                  </p>
                </q-expansion-item>

                <q-expansion-item
                  label="Quem pode vender na KLC Market?"
                  expand-separator
                >
                  <p class="q-pl-lg">
                    Para se cadastrar na KLC Market, qualquer pessoa ou empresa
                    deve possuir um Bilhete de Identidade (BI) e um comprovativo
                    de residência válido. Os comprovativos de residência aceitos
                    incluem:
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
                >
                  <p class="q-pl-lg">
                    Não possui mensalidade, porém existe uma comissão de 5% por
                    item vendido, comissão minima 2,00 MZN. Mais informações
                    sobre tarifas e preços disponiveis com o suporte na KLC
                    Market.
                  </p>
                </q-expansion-item>

                <q-expansion-item
                  label="Como eu gerencio minha conta na KLC Market?"
                  expand-separator
                >
                  <p class="q-pl-lg">
                    Toda a sua conta é gerenciada através da Seller Central da
                    KLC Market. Nesse sistema, você tem acesso a ferramentas que
                    vão te ajudar a gerenciar e crescer o seu negócio.
                  </p>
                </q-expansion-item>

                <q-expansion-item
                  label="Qual a tarifa de envio para os itens que eu vendo na KLC Market?"
                  expand-separator
                >
                  <p class="q-pl-lg">
                    Quando um cliente compra seus produtos, a KLC Market aplica
                    as configurações de envio que você definiu para calcular a
                    tarifa de envio por item, em cada pedido. Você pode definir
                    suas taxas de envio com um modelo baseado no item. No plano
                    de vendas Individual, a KLC Market define a tarifa de envio.
                  </p>
                </q-expansion-item>

                <q-expansion-item
                  label="Quando recebo meus pagamentos na KLC Market?"
                  expand-separator
                >
                  <p class="q-pl-lg">
                    A KLC Market deposita ou tranfere o pagamento em sua conta
                    bancária, m-pesa ou e-mola, quinzenalmente e avisa quando o
                    depósito for feito. Na Seller Central, você pode acompanhar
                    o valor e a data dos próximos depósitos.
                  </p>
                  <p class="q-pl-lg">
                    Na KLC Market, oferecemos opções flexíveis para você
                    escolher como receber o dinheiro de suas vendas, adaptadas
                    às suas necessidades. Veja as opções disponíveis:
                  </p>
                  <ul class="q-pl-lg">
                    <li><strong>Na hora:</strong> 4,98%</li>
                    <li><strong>Em 7 dias:</strong> 4,69%</li>
                    <li><strong>Em 14 dias:</strong> 4,49%</li>
                    <li><strong>Em 30 dias:</strong> 3,98%</li>
                  </ul>
                  <p class="q-pl-lg">
                    Escolha a opção que melhor se adapta ao seu fluxo de caixa e
                    maximize seus ganhos na KLC Market!
                  </p>

                  <p class="q-pl-lg">
                    Você pode configurar as taxas e os prazos no app, entrando
                    em "Seu negócio", depois em "Custos" e, então, em
                    "Checkouts".
                  </p>
                </q-expansion-item>
              </q-card-section>
            </q-card>
          </div>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderC from "components/store/HeaderC.vue";
export default {
  name: "ModeloListagem",
  components: {
    HeaderC,
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
    };
  },
  methods: {
    contactSupport() {
      // Adicione a lógica para redirecionar ao WhatsApp
      window.open(
        "https://wa.me/258873703909?text=Olá!%20Estou%20interessado%20em%20vender%20na%20plataforma%20KLC%20Market.%20Gostaria%20de%20mais%20informações.",
        "_blank"
      );
    },
    simulate() {
      if (this.saleAmount > 0 && this.paymentMethod) {
        const fee = this.paymentMethod.fee;
        const fixedFee = this.paymentMethod.fixedFee || 0;

        // Cálculo do valor recebido
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
  background-color: #1e88e5;
}
.q-banner {
  background-color: #1976d2;
}
.q-btn {
  font-weight: bold;
}
</style>
