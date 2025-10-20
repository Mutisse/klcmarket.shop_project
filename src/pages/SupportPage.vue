<template>
   <q-layout>
  <!-- Header -->
  <HeaderC />
  <div>
    <q-toolbar
      class="bg-white q-pt-md q-pb-md"
      style="border-bottom: 1px solid rgba(0, 0, 0, 0.1); z-index: 99"
    >
      <q-btn
        flat
        round
        dense
        size="md"
        icon="arrow_back"
        @click="voltar"
      ></q-btn>
      <q-toolbar-title class="text-center"
        >Perguntas Frequentes</q-toolbar-title
      >
    </q-toolbar>
  </div>

  <div class="q-pa-md q-mb-xl">
    <q-card flat>
      <q-card-section>
        <q-list>
          <!-- FAQ Content -->
          <q-expansion-item
            class="text-primary faq-header text-center text-h6 q-mb-md"
            label="Perguntas Frequentes de Vendedores"
            expand-separator
            dense
            style="line-height: 1.5; font-size: 14px"
          >
            <q-card-section>
              <q-card flat bordered>
                <q-card-section
                  class="q-pa-md q-mb-xl text- text-black text-left"
                >
                  <q-list>
                    <!-- Seção 1: Sobre os Produtos -->
                    <div class="faq-category text-h6 text-primary q-mb-lg">
                      1. Sobre a Taxa de 5%
                    </div>

                    <q-expansion-item
                      label="Como a taxa de 5% será cobrada? É sobre o valor bruto ou apenas sobre o lucro do produto?"
                      expand-separator
                      dense
                    >
                      <q-card-section>
                        A taxa de 5% será cobrada sobre o valor bruto do
                        produto, ou seja, o preço total do produto, sem
                        descontar custos de produção, impostos ou outros
                        encargos. Isso significa que o vendedor paga a taxa com
                        base no preço final de venda do produto,
                        independentemente de seu lucro.
                      </q-card-section>
                    </q-expansion-item>

                    <q-expansion-item
                      label="A taxa é aplicada mesmo em casos de devoluções ou cancelamentos?"
                      expand-separator
                      dense
                    >
                      <q-card-section>
                        A taxa de 5% será retirada do valor do reembolso em
                        casos de devolução ou cancelamento, ou seja, se o
                        produto for devolvido ou o pedido cancelado, a taxa não
                        será cobrada do valor que o vendedor irá devolver ao
                        cliente. No entanto, essa política pode variar
                        dependendo das condições específicas da plataforma.
                      </q-card-section>
                    </q-expansion-item>

                    <q-expansion-item
                      label="O que cobre essa taxa de 5%? É apenas pelo uso da plataforma, ou inclui logística, marketing, etc.?"
                      expand-separator
                      dense
                    >
                      <q-card-section>
                        A taxa de 5% cobre principalmente o uso da plataforma,
                        incluindo a manutenção do sistema de vendas, gestão de
                        pedidos e transações financeiras. Dependendo da
                        plataforma, ela pode também incluir marketing básico,
                        como a exibição do produto na plataforma. No entanto,
                        logística, embalagem e seguro de transporte geralmente
                        são custos separados, a menos que a plataforma ofereça
                        um serviço integrado.
                      </q-card-section>
                    </q-expansion-item>

                    <!-- Seção 2: Preços e Pagamento -->
                    <div
                      class="faq-category text-h6 text-primary q-mb-lg q-mt-lg"
                    >
                      2. Pagamento e Recebimento
                    </div>

                    <q-expansion-item
                      label="Como e quando recebo o pagamento pelos produtos vendidos?"
                      expand-separator
                      dense
                    >
                      <q-card-section>
                        O pagamento é feito ao vendedor na hora da entrega. O
                        cliente paga diretamente ao entregador, que pode ser uma
                        pessoa ou uma empresa parceira de entrega, dependendo do
                        modelo da plataforma. Após a entrega e confirmação do
                        pagamento, o valor é repassado ao vendedor.
                      </q-card-section>
                    </q-expansion-item>

                    <q-expansion-item
                      label="Há algum prazo para o repasse dos valores?"
                      expand-separator
                      dense
                    >
                      <q-card-section>
                        O prazo de repasse pode variar de acordo com as
                        condições da plataforma. Em geral, pode levar entre 1 a
                        7 dias úteis após a confirmação do pagamento do cliente.
                        Algumas plataformas podem repassar o pagamento no mesmo
                        dia da entrega, enquanto outras exigem um processo de
                        verificação.
                      </q-card-section>
                    </q-expansion-item>

                    <q-expansion-item
                      label="É possível deduzir a taxa automaticamente no momento do repasse?"
                      expand-separator
                      dense
                    >
                      <q-card-section>
                        Sim, muitas plataformas fazem a dedução automática da
                        taxa de 5% no momento do repasse do pagamento ao
                        vendedor. Isso facilita o processo e garante que o
                        vendedor não precise fazer esse cálculo manualmente.
                      </q-card-section>
                    </q-expansion-item>

                    <q-expansion-item
                      label="O que acontece se o cliente não pagar na entrega?"
                      expand-separator
                      dense
                    >
                      <q-card-section>
                        Se o cliente não pagar na entrega, a plataforma
                        geralmente oferece uma solução de cancelamento do
                        pedido. O entregador poderá retornar com o produto ao
                        vendedor, e o pedido será marcado como não concluído.
                        Dependendo da política da plataforma, o vendedor pode
                        ter que lidar com o reembolso de qualquer valor pago
                        previamente ou assumir o custo do frete se já tiver sido
                        pago.
                      </q-card-section>
                    </q-expansion-item>

                    <!-- Seção 3: Sobre a Entrega -->
                    <div
                      class="faq-category text-h6 text-primary q-mb-lg q-mt-lg"
                    >
                      3. Logística e Entrega
                    </div>

                    <q-expansion-item
                      label="Quem é responsável pela entrega do produto ao cliente?"
                      expand-separator
                      dense
                    >
                      <q-card-section>
                        Em um modelo de marketplace, a responsabilidade pela
                        entrega pode ser de ambas as partes. A plataforma pode
                        oferecer serviços de entrega integrados ou permitir que
                        o vendedor faça o envio por conta própria. Caso o
                        vendedor utilize a entrega da plataforma, ele pode
                        precisar pagar uma taxa adicional.</q-card-section
                      >
                    </q-expansion-item>

                    <q-expansion-item
                      label="O que acontece se o produto for danificado durante a entrega?"
                      expand-separator
                      dense
                    >
                      <q-card-section>
                        Caso o produto seja danificado durante o transporte,
                        geralmente o vendedor deve notificar a plataforma para
                        abrir um caso. Algumas plataformas oferecem seguros
                        básicos para proteger os vendedores e compradores contra
                        danos durante o transporte, mas nem todas. O vendedor
                        pode ser responsável pela compensação ou reenvio do
                        produto, dependendo da política da plataforma.
                      </q-card-section>
                    </q-expansion-item>

                    <q-expansion-item
                      label="Existe um seguro para os produtos durante o transporte?"
                      expand-separator
                      dense
                    >
                      <q-card-section>
                        Algumas plataformas oferecem seguro durante o transporte
                        como parte do serviço de logística, enquanto outras
                        podem exigir que o vendedor adquira seguro
                        separadamente. A disponibilidade de seguro pode depender
                        do tipo de entrega (por exemplo, entrega expressa versus
                        padrão).
                      </q-card-section>
                    </q-expansion-item>

                    <q-expansion-item
                      label="Como garantir que o entregador cobre corretamente do cliente?"
                      expand-separator
                      dense
                    >
                      <q-card-section>
                        A plataforma pode fornecer uma sistema de pagamento
                        automatizado para garantir que o entregador receba o
                        valor correto da venda no momento da entrega. Caso o
                        pagamento não seja efetuado corretamente, o entregador
                        ou vendedor pode notificar a plataforma, que pode tomar
                        as medidas necessárias, como reembolso ou
                        reentrega.</q-card-section
                      >
                    </q-expansion-item>

                    <!-- Seção 4: Experiência de Compra -->
                    <div
                      class="faq-category text-h6 text-primary q-mb-lg q-mt-lg"
                    >
                      4. Gestão de Estoque e Pedidos
                    </div>

                    <q-expansion-item
                      label="A plataforma exige que eu mantenha um estoque mínimo?"
                      expand-separator
                      dense
                    >
                      <q-card-section>
                        Em geral, não é comum exigir um estoque mínimo em
                        plataformas de marketplace. No entanto, pode ser
                        recomendado manter um estoque adequado para garantir que
                        você consiga atender aos pedidos rapidamente e manter
                        uma boa reputação de vendedor.
                      </q-card-section>
                    </q-expansion-item>

                    <q-expansion-item
                      label="Há integração com sistemas de gestão de estoque?"
                      expand-separator
                      dense
                    >
                      <q-card-section>
                        Algumas plataformas de e-commerce oferecem integração
                        com sistemas de gestão de estoque para facilitar o
                        controle e a atualização do estoque em tempo real. Isso
                        ajuda a evitar vendas de produtos fora de estoque e
                        melhora a eficiência do vendedor.
                      </q-card-section>
                    </q-expansion-item>

                    <q-expansion-item
                      label="Como lido com pedidos que não posso atender por falta de estoque?"
                      expand-separator
                      dense
                    >
                      <q-card-section>
                        Quando o estoque está esgotado, o pedido é cancelado
                        automaticamente, ou o vendedor é notificado para decidir
                        sobre a disponibilidade. Algumas plataformas permitem
                        que o vendedor indique a quantidade de estoque
                        disponível diretamente na página do produto, e a
                        plataforma pode automaticamente desabilitar o produto se
                        o estoque estiver esgotado.
                      </q-card-section>
                    </q-expansion-item>

                    <!-- Seção 5: Segurança -->
                    <div
                      class="faq-category text-h6 text-primary q-mb-lg q-mt-lg"
                    >
                      5. Relação com Clientes
                    </div>

                    <q-expansion-item
                      label="Quem lida com reclamações e devoluções? Eu ou a plataforma?"
                      expand-separator
                      dense
                    >
                      <q-card-section>
                        A responsabilidade pela reclamação pode variar, mas
                        geralmente é o vendedor quem lida com as reclamações
                        sobre o produto, enquanto a plataforma pode oferecer
                        suporte em casos de disputas. Para devoluções, o
                        vendedor é responsável pelo reembolso, enquanto a
                        plataforma pode mediar o processo para garantir que
                        ambas as partes sigam as políticas estabelecidas.
                      </q-card-section>
                    </q-expansion-item>

                    <q-expansion-item
                      label="Como gerenciar casos de insatisfação com o produto ou entrega?"
                      expand-separator
                      dense
                    >
                      <q-card-section>
                        Caso um cliente esteja insatisfeito, o vendedor deve
                        responder de forma profissional, tentando resolver o
                        problema diretamente com o cliente. Se a insatisfação
                        for relacionada a questões de entrega, como atraso ou
                        danos, a plataforma pode mediar a comunicação e buscar
                        uma solução.
                      </q-card-section>
                    </q-expansion-item>

                    <q-expansion-item
                      label="Posso entrar em contato direto com o cliente para esclarecer dúvidas?"
                      expand-separator
                      dense
                    >
                      <q-card-section>
                        Dependendo da política da plataforma, pode haver
                        restrições quanto ao contato direto com o cliente.
                        Algumas plataformas permitem comunicação direta entre
                        vendedor e cliente, enquanto outras preferem que toda a
                        comunicação seja mediada para manter o controle sobre as
                        transações.
                      </q-card-section>
                    </q-expansion-item>

                    <!-- Seção 6: Política de Trocas e Devoluções -->
                    <div
                      class="faq-category text-h6 text-primary q-mb-lg q-mt-lg"
                    >
                      6. Marketing e Divulgação
                    </div>

                    <q-expansion-item
                      label="A plataforma ajuda na divulgação dos meus produtos?"
                      expand-separator
                      dense
                    >
                      <q-card-section>
                        Sim, muitas plataformas oferecem ferramentas de
                        marketing para ajudar a aumentar a visibilidade dos
                        produtos, como a promoção de anúncios pagos, banners,
                        e-mails marketing, e integração com redes sociais. A
                        visibilidade básica na plataforma é gratuita, mas
                        anúncios pagos podem aumentar o alcance.
                      </q-card-section>
                    </q-expansion-item>
                    <q-expansion-item
                      label="Há custos adicionais para ter maior visibilidade na plataforma?"
                      expand-separator
                      dense
                    >
                      <q-card-section>
                        Sim, muitas plataformas oferecem pacotes pagos para
                        aumentar a visibilidade do vendedor, como destacando os
                        produtos nas páginas de pesquisa ou em campanhas
                        promocionais especiais. O vendedor pode escolher entre
                        várias opções, dependendo do seu orçamento e
                        necessidades.
                      </q-card-section>
                    </q-expansion-item>
                    <q-expansion-item
                      label="Posso oferecer promoções ou descontos dentro da plataforma?"
                      expand-separator
                      dense
                    >
                      <q-card-section>
                        Em muitos casos, sim. A plataforma pode permitir que o
                        vendedor crie promoções e cupons de desconto para atrair
                        mais clientes. Isso pode incluir descontos em produtos
                        específicos ou em compras acima de determinado valor.
                      </q-card-section>
                    </q-expansion-item>

                    <!-- Seção 8: Comunicação e Feedback -->
                    <div
                      class="faq-category text-h6 text-primary q-mb-lg q-mt-lg"
                    >
                      7. Documentação e Regulação
                    </div>

                    <q-expansion-item
                      label="Preciso emitir nota fiscal? A plataforma ajuda com isso?"
                      expand-separator
                      dense
                    >
                      <q-card-section>
                        A emissão de nota fiscal é responsabilidade do vendedor,
                        e depende das regulamentações fiscais locais. Algumas
                        plataformas ajudam os vendedores a gerar as notas
                        fiscais, mas muitas vezes o vendedor terá que usar seu
                        próprio sistema ou um software de terceiros para cumprir
                        com as exigências fiscais.
                      </q-card-section>
                    </q-expansion-item>

                    <q-expansion-item
                      label="Há algum contrato formal ou regulamentação para participar do sistema?"
                      expand-separator
                      dense
                    >
                      <q-card-section>
                        Sim, ao se inscrever para vender em uma plataforma, o
                        vendedor geralmente precisa assinar um contrato de
                        termos e condições, que descreve as políticas da
                        plataforma, incluindo o uso da plataforma, taxas,
                        responsabilidades, e políticas de devolução e reembolso.
                      </q-card-section>
                    </q-expansion-item>

                    <!-- Seção 8: Comunicação e Feedback -->
                    <div
                      class="faq-category text-h6 text-primary q-mb-lg q-mt-lg"
                    >
                      8. Suporte e Expansão
                    </div>

                    <q-expansion-item
                      label="Existe suporte técnico para resolver problemas na plataforma?"
                      expand-separator
                      dense
                    >
                      <q-card-section>
                        Sim, a maioria das plataformas oferece suporte técnico
                        por meio de chat, e-mail ou telefone para resolver
                        questões como problemas técnicos, dúvidas sobre o uso da
                        plataforma e outras dificuldades que os vendedores
                        possam enfrentar.
                      </q-card-section>
                    </q-expansion-item>

                    <q-expansion-item
                      label="Há possibilidade de expandir meus negócios para outras regiões ou cidades usando o sistema?"
                      expand-separator
                      dense
                    >
                      <q-card-section>
                        A maioria das plataformas permite que os vendedores
                        expandam seus negócios para outras regiões ou cidades,
                        facilitando a entrega e promoção dos produtos em novas
                        áreas. No entanto, isso pode exigir ajustes logísticos,
                        como encontrar parceiros de entrega em outras
                        regiões.</q-card-section
                      >
                    </q-expansion-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </q-card-section>
          </q-expansion-item>

          <!-- FAQ Content -->
          <q-expansion-item
            class="text-primary faq-header text-center text-h6 q-mb-md"
            label=" Perguntas Frequentes de Clientes"
            expand-separator
            dense
            style="line-height: 1.5; font-size: 14px"
          >
            <q-card flat bordered>
              <q-card-section
                class="q-pa-md q-mb-xl text- text-black text-left"
              >
                <q-list>
                  <!-- Seção 1: Sobre os Produtos -->
                  <div class="faq-category text-h6 text-primary q-mb-lg">
                    1. Sobre os Produtos
                  </div>

                  <q-expansion-item
                    label="Como posso confiar na qualidade dos produtos oferecidos?"
                    expand-separator
                    dense
                  >
                    <q-card-section>
                      Todos os vendedores cadastrados passam por uma verificação
                      rigorosa para garantir a autenticidade e a qualidade dos
                      produtos. Além disso, incentivamos avaliações e feedbacks
                      de clientes, que ajudam a manter altos padrões de
                      qualidade.
                    </q-card-section>
                  </q-expansion-item>

                  <q-expansion-item
                    label="O que acontece se eu receber um produto diferente do que pedi?"
                    expand-separator
                    dense
                  >
                    <q-card-section>
                      Se o produto recebido não for o que você pediu, você pode
                      recusá-lo no momento da entrega. Nosso sistema notifica
                      automaticamente o vendedor e oferece suporte para resolver
                      o problema rapidamente.
                    </q-card-section>
                  </q-expansion-item>

                  <q-expansion-item
                    label="Há garantia ou política de devolução para os produtos?"
                    expand-separator
                    dense
                  >
                    <q-card-section>
                      Sim, produtos que apresentarem defeito ou não atenderem às
                      suas expectativas podem ser devolvidos conforme nossa
                      política de devolução. Em casos específicos, ajudamos você
                      a entrar em contato com o vendedor.
                    </q-card-section>
                  </q-expansion-item>

                  <q-expansion-item
                    label="Posso ver avaliações de outros clientes sobre os produtos?"
                    expand-separator
                    dense
                  >
                    <q-card-section>
                      Sim, cada produto possui uma seção de avaliações e
                      comentários de clientes, para que você possa tomar uma
                      decisão informada antes de comprar.
                    </q-card-section>
                  </q-expansion-item>

                  <!-- Seção 2: Preços e Pagamento -->
                  <div
                    class="faq-category text-h6 text-primary q-mb-lg q-mt-lg"
                  >
                    2. Preços e Pagamento
                  </div>

                  <q-expansion-item
                    label="O preço que vejo na plataforma é o preço final? Há taxas adicionais?"
                    expand-separator
                    dense
                  >
                    <q-card-section>
                      Sim, o preço exibido inclui todos os custos do produto.
                      Caso haja taxas de entrega, elas serão informadas antes da
                      finalização do pedido.
                    </q-card-section>
                  </q-expansion-item>

                  <q-expansion-item
                    label="Posso pagar com outros métodos além de dinheiro na entrega?"
                    expand-separator
                    dense
                  >
                    <q-card-section>
                      Sim, aceitamos pagamentos por Pix, cartões de crédito e
                      débito, além do dinheiro. O entregador estará preparado
                      para receber o método de sua escolha.
                    </q-card-section>
                  </q-expansion-item>

                  <q-expansion-item
                    label="O pagamento é seguro?"
                    expand-separator
                    dense
                  >
                    <q-card-section>
                      Sim. Para pagamentos digitais, utilizamos sistemas
                      criptografados e parceiros de pagamento confiáveis para
                      garantir total segurança.
                    </q-card-section>
                  </q-expansion-item>

                  <!-- Seção 3: Sobre a Entrega -->
                  <div
                    class="faq-category text-h6 text-primary q-mb-lg q-mt-lg"
                  >
                    3. Sobre a Entrega
                  </div>

                  <q-expansion-item
                    label="Qual é o prazo estimado para a entrega?"
                    expand-separator
                    dense
                  >
                    <q-card-section>
                      O prazo exato será informado antes da confirmação do
                      pedido, com base na sua localização e na disponibilidade
                      do produto.
                    </q-card-section>
                  </q-expansion-item>

                  <q-expansion-item
                    label="O entregador pode levar troco?"
                    expand-separator
                    dense
                  >
                    <q-card-section>
                      Sim, nossos entregadores sempre estão preparados para
                      fornecer troco. Pedimos que você informe o valor a ser
                      pago com antecedência, se possível.
                    </q-card-section>
                  </q-expansion-item>

                  <q-expansion-item
                    label="É possível rastrear a entrega?"
                    expand-separator
                    dense
                  >
                    <q-card-section>
                      Sim, você pode rastrear o status da sua entrega em tempo
                      real pela nossa plataforma.
                    </q-card-section>
                  </q-expansion-item>

                  <!-- Seção 4: Experiência de Compra -->
                  <div
                    class="faq-category text-h6 text-primary q-mb-lg q-mt-lg"
                  >
                    4. Experiência de Compra
                  </div>

                  <q-expansion-item
                    label="Como faço para entrar em contato com o suporte em caso de problemas?"
                    expand-separator
                    dense
                  >
                    <q-card-section>
                      Nosso suporte está disponível pelo chat na plataforma,
                      WhatsApp ou telefone. Você pode nos contatar a qualquer
                      momento para esclarecer dúvidas ou relatar problemas.
                    </q-card-section>
                  </q-expansion-item>

                  <q-expansion-item
                    label="Posso cancelar ou alterar meu pedido depois de feito?"
                    expand-separator
                    dense
                  >
                    <q-card-section>
                      Sim, você pode cancelar ou alterar o pedido enquanto ele
                      estiver em processamento. Após o envio, as alterações
                      dependem da política de cada vendedor.
                    </q-card-section>
                  </q-expansion-item>

                  <!-- Seção 5: Segurança -->
                  <div
                    class="faq-category text-h6 text-primary q-mb-lg q-mt-lg"
                  >
                    5. Segurança
                  </div>

                  <q-expansion-item
                    label="Como vocês garantem a segurança dos entregadores e dos clientes?"
                    expand-separator
                    dense
                  >
                    <q-card-section>
                      Investimos em logística segura e verificamos os
                      antecedentes de nossos entregadores e vendedores. Além
                      disso, os entregadores seguem rotas planejadas e podem ser
                      rastreados em tempo real.
                    </q-card-section>
                  </q-expansion-item>

                  <q-expansion-item
                    label="Posso confiar que minhas informações pessoais estão protegidas?"
                    expand-separator
                    dense
                  >
                    <q-card-section>
                      Sim, utilizamos tecnologia de ponta para proteger seus
                      dados pessoais. Eles nunca são compartilhados sem sua
                      autorização.
                    </q-card-section>
                  </q-expansion-item>

                  <!-- Seção 6: Política de Trocas e Devoluções -->
                  <div
                    class="faq-category text-h6 text-primary q-mb-lg q-mt-lg"
                  >
                    6. Política de Trocas e Devoluções
                  </div>

                  <q-expansion-item
                    label="Posso devolver um produto que não gostei ou que veio com defeito?"
                    expand-separator
                    dense
                  >
                    <q-card-section>
                      Sim, basta informar o problema pelo nosso suporte.
                      Organizaremos o processo de devolução sem complicações.
                    </q-card-section>
                  </q-expansion-item>

                  <q-expansion-item
                    label="Qual o prazo para devoluções?"
                    expand-separator
                    dense
                  >
                    <q-card-section>
                      O prazo padrão para devoluções é de 7 dias corridos após o
                      recebimento. Em casos excepcionais, analisamos prazos
                      maiores.
                    </q-card-section>
                  </q-expansion-item>

                  <!-- Seção 7: Diversidade de Produtos -->
                  <div
                    class="faq-category text-h6 text-primary q-mb-lg q-mt-lg"
                  >
                    7. Diversidade de Produtos
                  </div>

                  <q-expansion-item
                    label="A plataforma tem um catálogo atualizado?"
                    expand-separator
                    dense
                  >
                    <q-card-section>
                      Sim, nosso catálogo é constantemente atualizado com novos
                      produtos e promoções. Você sempre encontrará as melhores
                      opções disponíveis.
                    </q-card-section>
                  </q-expansion-item>

                  <!-- Seção 8: Comunicação e Feedback -->
                  <div
                    class="faq-category text-h6 text-primary q-mb-lg q-mt-lg"
                  >
                    8. Comunicação e Feedback
                  </div>

                  <q-expansion-item
                    label="Posso dar feedback sobre o produto ou serviço?"
                    expand-separator
                    dense
                  >
                    <q-card-section>
                      Sim, incentivamos você a avaliar tanto o produto quanto o
                      entregador. Seu feedback é essencial para melhorar nossos
                      serviços.
                    </q-card-section>
                  </q-expansion-item>
                </q-list>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-card-section>

      <q-card-section
        class="q-pa-xl q-gutter-md1 text-center text-white"
        style="
          background: linear-gradient(135deg, #1a237e, #311b92);
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        "
      >
        <div class="text-h4 q-mb-xl text-bold" style="letter-spacing: 1px">
          Fale conosco!
        </div>

        <q-btn
          @click="contactSupport"
          color="green"
          label="Ir ao whatsapp"
          class="q-mt-md text-bold q-px-xl q-py-md"
          style="
            background: linear-gradient(45deg, #ff6f00, #ff9100);
            border-radius: 50px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease;
            color: white;
          "
        />
        <p class="q-mb-xl text-bold" style="letter-spacing: 1px">
          Telefone: 87 370 909
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
  name: "ErrorNotFound",
  components: {
    HeaderC,
    FooterC,
  },
  methods: {
    voltar() {
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push("/");
      }
    },
    contactSupport() {
      // Adicione a lógica para redirecionar ao WhatsApp
      window.open("https://wa.me/258873703909", "_blank");
    },
  },
};
</script>

<style scoped>
.faq-category {
  font-weight: bold;
}
</style>
