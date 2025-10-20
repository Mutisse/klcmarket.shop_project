<template>
  <q-layout>
    <HeaderC />
    <div class="q-pa-md">
      <q-card flat bordered class="q-pa-md">
        <q-card-section>
          <h3 class="text-h5">KLC Market - Guia para Vendedores</h3>
          <p class="text-caption">Última atualização: 14/10/2024</p>
        </q-card-section>

        <q-card-section>
          <p><strong>Bem-vindo ao KLC Market!</strong></p>
          <p>
            KLC Market é uma plataforma de marketplace dedicada a conectar
            vendedores e compradores de forma prática e segura. Se você está
            interessado em começar a vender seus produtos, este guia é para
            você! Aqui, vamos explicar como você pode se cadastrar, listar seus
            produtos e realizar suas vendas através da nossa plataforma, tudo
            isso com a conveniência do pagamento Cash on Delivery (COD).
          </p>
        </q-card-section>

        <q-card-section>
          <h4 class="text-h6">1. Como Iniciar no KLC Market</h4>
          <ul>
            <li>
              <strong>Passo 1: Cadastro</strong> - Para se cadastrar como
              vendedor, acesse a nossa plataforma e preencha as informações
              necessárias no formulário de inscrição. Certifiquese de fornecer
              dados completos e precisos, pois eles serão usados para a
              validação da sua conta e para o processo de pagamento..
            </li>
            <li>
              <strong>Passo 2: Verificação de Conta</strong> - Após o cadastro,
              nossa equipe realizará a verificação da sua conta. Isso pode
              incluir a validação dos dados fornecidos e a conformidade com
              nossos requisitos de venda.
            </li>
            <li>
              <strong>Passo 3: Listagem de Produtos</strong> - Com a conta
              verificada, você poderá listar seus produtos na plataforma. Cada
              produto deve ser descrito detalhadamente, incluindo preço,
              categoria, quantidade disponível e fotos de boa qualidade.
              Lembrese: a qualidade das imagens e a descrição precisa do produto
              são essenciais para atrair compradores.
            </li>
          </ul>
        </q-card-section>

        <q-card-section>
          <h4 class="text-h6">2. Requisitos para Vendedores</h4>
          <ul>
            <li>
              SVocê deve garantir que os produtos que está vendendo estejam em
              conformidade com as leis locais e não violam os direitos de
              propriedade intelectual de terceiros.
            </li>
            <li>
              Seja claro e honesto ao descrever seus produtos. Isso inclui
              detalhes sobre as condições (novos, usados, etc.), características
              e garantias oferecidas.
            </li>
            <li>
              Qualidade: Apenas produtos de boa qualidade devem ser oferecidos
              na plataforma. Evite listar itens danificados ou que não atendem
              às expectativas dos consumidores.
            </li>
          </ul>
        </q-card-section>

        <q-card-section>
          <h4 class="text-h6">3. Como Funciona a Venda</h4>
          <ul>
            <li>
              <strong>Pagamento COD</strong> - Todos os pagamentos no KLC Market
              são feitos via Cash on Delivery (COD), ou seja, o cliente paga em
              dinheiro no momento da entrega do produto. Isso garante maior
              segurança tanto para o vendedor quanto para o comprador, evitando
              riscos relacionados ao pagamento antecipado. .
            </li>
            <li>
              <strong>Confirmação do Pedido</strong> - Após o cliente fazer um
              pedido, você receberá uma notificação para confirmar o item e
              iniciar o processo de entrega.
            </li>
            <li>
              <strong>Entrega</strong> - As entregas serão realizadas nas
              segundas, quartas e sextasfeiras, que são os dias destinados para
              recolha e entrega dos produtos. É importante que os vendedores
              garantam que os produtos estejam prontos para envio nessas datas,
              para evitar atrasos.
            </li>
          </ul>
        </q-card-section>

        <q-card-section>
          <h4 class="text-h6">4. Política de Cancelamento e Devolução</h4>
          <ul>
            <li>
              <strong>Cancelamento de Pedidos:</strong> O cliente pode cancelar
              um pedido antes da entrega. Caso contrário, o pedido será
              finalizado.
            </li>
            <li>
              <strong> Devolução:</strong> A devolução de produtos só será
              aceita em casos de defeitos ou discrepâncias com a descrição do
              produto. O cliente deve solicitar a devolução em até 1 dia após a
              entrega. Devoluções são aceitas em casos de defeito ou
              discrepância com a descrição.
            </li>
          </ul>
        </q-card-section>

        <q-card-section>
          <h4 class="text-h6">5. Benefícios de Vender no KLC Market</h4>
          <ul>
            <li>Alcance clientes locais.</li>
            <li>Segurança no pagamento.</li>
            <li>Suporte ao vendedor.</li>
          </ul>
        </q-card-section>

        <q-card-section>
          <h4 class="text-h6">6. O Que Esperamos de Você</h4>
          <ul>
            <li>Seja profissional e cordial com os compradores.</li>
            <li>Responda rapidamente às perguntas dos clientes.</li>
            <li>Garanta que os pedidos sejam entregues no tempo prometido para aumentar a confiança dos compradores e melhorar sua reputação na plataforma.</li>
          </ul>
        </q-card-section>

        <q-card-section>
          <h4 class="text-h6">7. Contato</h4>
          <p>
            Para dúvidas ou mais informações, entre em contato:
            <strong>87 3703 909</strong>.
          </p>
        </q-card-section>
      </q-card>
    </div>
    <FooterC />
  </q-layout>
</template>
<script>
import HeaderC from "components/store/HeaderC.vue";
import FooterC from "components/store/FooterC.vue";
export default {
  components: {
    HeaderC,
    FooterC,
  },
};
</script>

<style scoped>
q-card-section {
  margin-bottom: 10px;
}
</style>
