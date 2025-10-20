<template>
  <!-- heider -->
  <div>
    <q-toolbar
      class="bg-white"
      style="
        position: fixed;
        top: 0;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        z-index: 99;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      "
    >
      <div style="display: flex; align-items: center">
        <q-avatar square>
          <img src="~assets/tsakissa/Logo Tsakissa 2.png" alt="Logo Tsakissa" />
        </q-avatar>
        <q-toolbar-title style="margin-left: 10px">Tsakissa</q-toolbar-title>
      </div>

      <div style="display: flex; gap: 20px">
        <div class="menu-item" @click="inicio">Inicio</div>
        <div class="menu-item" @click="verProdutos">Produtos</div>
        <div class="menu-item" @click="verPedidos">Pedidos</div>
        <div class="menu-item" @click="verCategorias">Categorias</div>
        <div class="menu-item" v-if="getUserComputed" @click="logout">Sair</div>
        <div
          class="menu-item"
          v-if="!getUserComputed"
          @click="$router.push('/login')"
        >
          entrar
        </div>
      </div>
    </q-toolbar>
  </div>
  <div>
    <div
      v-if="!getUserComputed || getUserComputed.scope == 'cliente'"
      class="q-gutter-md"
    >
      <q-carousel
        v-model="slide"
        transition-prev="scale"
        transition-next="scale"
        swipeable
        animated
        control-color="white"
        navigation
        padding
        arrows
        height="500px"
        class="bg-amber-2 text-black shadow-1 rounded-borders"
      >
        <q-carousel-slide
          name="style"
          :class="this.$q.screen.lt.sm ? 'column' : 'row justify-around'"
          class="no-wrap flex-center text-white1 text-bold text-h4"
        >
          <img
            src="~assets/tsakissa/IMG-20240801-WA0019-removebg-preview.png"
            style="max-width: 100%; max-height: 100%; height: auto"
          />
          <div class="q-mt-md text-center">
            Adesivos personalizados para qualquer ocasião
          </div>
        </q-carousel-slide>

        <q-carousel-slide
          name="tv"
          :class="this.$q.screen.lt.sm ? 'column' : 'row justify-around'"
          class="no-wrap flex-center text-white1 text-bold text-h4"
        >
          <div class="q-mt-md text-center">
            Brindes e mimos para surpreender quem você ama
          </div>
          <img
            src="~assets/tsakissa/IMG-20240801-WA0024-removebg-preview.png"
            style="max-width: 100%; max-height: 100%; height: auto"
          />
        </q-carousel-slide>

        <q-carousel-slide
          name="layers"
          :class="this.$q.screen.lt.sm ? 'column' : 'row justify-around'"
          class="no-wrap flex-center text-white1 text-bold text-h4"
        >
          <img
            src="~assets/tsakissa/IMG-20240801-WA0022-removebg-preview.png"
            style="max-width: 100%; max-height: 100%; height: auto"
          />
          <div class="q-mt-md text-center">
            Cartões de agradecimento para momentos especiais
          </div>
        </q-carousel-slide>

        <q-carousel-slide
          name="map"
          :class="this.$q.screen.lt.sm ? 'column' : 'row justify-around'"
          class="no-wrap flex-center text-white11 text-bold text-h4"
        >
          <div class="q-mt-md text-center">
            Decorações únicas para personalizar sua casa
          </div>
          <img
            src="~assets/tsakissa/IMG-20240801-WA0010-removebg-preview.png"
            style="max-width: 100%; max-height: 100%; height: auto"
          />
        </q-carousel-slide>
      </q-carousel>
    </div>

    <!-- cards -->
    <div v-if="categoySection" class="q-pt-xl q-pl-xl bg-grey-2">
      <div class="text-h3 text-bold">Categorias Principais</div>
      <div class="text-h6 text-bold q-pt-sm">
        Atualização de cadastro, devolução de valores, cancelamento e muito mais
      </div>

      <div v-if="!categoriaSelecionada" class="q-pa-md row justify-center">
        <!-- Adesivos -->
        <q-card
          bordered
          class="text-black col-xs-12 col-sm-3 col-md-3 col-lg-2 q-ma-md"
          style="background-color: transparent; border-radius: 1rem"
        >
          <q-card-section>
            <q-icon color="pink-4" size="3rem" name="label" />
            <div class="text-h5 text-bold">Adesivos</div>
            <div class="text-subtitle1">Personalize com seu estilo</div>
          </q-card-section>
          <q-card-section>
            <img
              v-if="
                adesivos &&
                adesivos.length > 0 &&
                adesivos[0].images &&
                adesivos[0].images.length > 0
              "
              :src="getImageUrl(adesivos[0].images[0])"
              style="
                object-fit: contain;
                overflow: hidden;
                vertical-align: middle;
                border: 1px solid black;
                border-radius: 3rem;
                max-width: 100%;
                max-height: 100%;
                height: auto;
              "
            />

            <div class="text-start" style="border-radius: 1rem">
              <q-btn
                @click="setCategoriaSelecionada('Adesivos')"
                color="pink-4"
                icon="chevron_right"
                label="Ver Mais"
                flat
              />
            </div>
          </q-card-section>
        </q-card>

        <q-card
          bordered
          class="text-black col-xs-12 col-sm-3 col-md-3 col-lg-2 q-ma-md"
          style="background-color: transparent; border-radius: 1rem"
        >
          <q-card-section>
            <q-icon color="pink-4" size="3rem" name="redeem" />
            <div class="text-h5 text-bold">Brindes e Mimos</div>
            <div class="text-subtitle1">Presentes para todas ocasiões</div>
          </q-card-section>
          <q-card-section>
            <img
              v-if="
                brindes &&
                brindes.length > 0 &&
                brindes[0].images &&
                brindes[0].images.length > 0
              "
              :src="getImageUrl(brindes[0].images[0])"
              style="
                object-fit: contain;
                overflow: hidden;
                vertical-align: middle;
                border: 1px solid black;
                border-radius: 3rem;
                max-width: 100%;
                max-height: 100%;
                height: auto;
              "
              alt="Imagem do Brinde"
              @error="handleImageError"
            />
            <div class="text-start" style="border-radius: 1rem">
              <q-btn
                @click="setCategoriaSelecionada('Brindes')"
                color="pink-4"
                icon="chevron_right"
                label="Ver Mais"
                flat
              />
            </div>
          </q-card-section>
        </q-card>

        <q-card
          bordered
          class="text-black col-xs-12 col-sm-3 col-md-3 col-lg-2 q-ma-md"
          style="background-color: transparent; border-radius: 1rem"
        >
          <q-card-section>
            <q-icon color="pink-4" size="3rem" name="style" />
            <div class="text-h5 text-bold">Cartões</div>
            <div class="text-subtitle1">
              Cartões de agradecimento e afetivos
            </div>
          </q-card-section>
          <q-card-section>
            <img
              v-if="
                cartoes &&
                cartoes.length > 0 &&
                cartoes[0].images &&
                cartoes[0].images.length > 0
              "
              :src="getImageUrl(cartoes[0].images[0])"
              style="
                object-fit: contain;
                overflow: hidden;
                vertical-align: middle;
                border: 1px solid black;
                border-radius: 3rem;
                max-width: 100%;
                max-height: 100%;
                height: auto;
              "
              alt="Imagem do Cartão"
              @error="handleImageError"
            />

            <div class="text-start" style="border-radius: 1rem">
              <q-btn
                @click="setCategoriaSelecionada('Cartões')"
                color="pink-4"
                icon="chevron_right"
                label="Ver Mais"
                flat
              />
            </div>
          </q-card-section>
        </q-card>

        <q-card
          bordered
          class="text-black col-xs-12 col-sm-3 col-md-3 col-lg-2 q-ma-md"
          style="background-color: transparent; border-radius: 1rem"
        >
          <q-card-section>
            <q-icon color="pink-4" size="3rem" name="home" />
            <div class="text-h5 text-bold">Decorações</div>
            <div class="text-subtitle1">Itens únicos para sua casa</div>
          </q-card-section>
          <q-card-section>
            <img
              v-if="
                decoracoes &&
                decoracoes.length > 0 &&
                decoracoes[0].images &&
                decoracoes[0].images.length > 0
              "
              :src="getImageUrl(decoracoes[0].images[0])"
              style="
                object-fit: contain;
                overflow: hidden;
                vertical-align: middle;
                border: 1px solid black;
                flex: 1 1 0%;
                border-radius: 3rem;
                max-width: 100%;
                max-height: 100%;
                height: auto;
              "
            />

            <div class="text-start" style="border-radius: 1rem">
              <q-btn
                @click="setCategoriaSelecionada('Decorações')"
                color="pink-4"
                icon="chevron_right"
                label="Ver Mais"
                flat
              />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="q-pa-md row justify-center">
        <!-- Adesivos -->
        <div
          v-if="categoriaSelecionada == 'Adesivos'"
          class="q-pa-md row justify-center"
        >
          <div>
            <q-card-section  @click="setCategoriaSelecionada('Adesivos')">
            <q-icon color="pink-4" size="2rem" name="label" />
            <div class="text-h6 text-bold">Adesivos</div>
            <div class="text-subtitle1">Personalize com seu estilo</div>
          </q-card-section>
          <q-card-section  @click="setCategoriaSelecionada('Brindes')">
            <q-icon color="pink-4" size="2rem" name="redeem" />
            <div class="text-h6 text-bold">Brindes e Mimos</div>
            <div class="text-subtitle1">Presentes para todas ocasiões</div>
          </q-card-section>
          <q-card-section  @click="setCategoriaSelecionada('Cartões')">
            <q-icon color="pink-4" size="2rem" name="style" />
            <div class="text-h6 text-bold">Cartões</div>
            <div class="text-subtitle1">
              Cartões de agradecimento e afetivos
            </div>
          </q-card-section>
          <q-card-section  @click="setCategoriaSelecionada('Decorações')">
            <q-icon color="pink-4" size="2rem" name="home" />
            <div class="text-h6 text-bold">Decorações</div>
            <div class="text-subtitle1">Itens únicos para sua casa</div>
          </q-card-section>
          </div>


          <q-card
            v-for="product in adesivos"
            :key="product.id"
            bordered
            class="text-black col-xs-12 col-sm-3 col-md-3 col-lg-2 q-ma-md"
            style="background-color: transparent; border-radius: 1rem"
          >
            <q-card-section>
              <q-icon color="pink-4" size="1rem" name="label" />
              <div class="text-h6 text-bold">{{ product.name }}</div>
              <div class="text-subtitle1 description">
                {{ product.description }}
              </div>
            </q-card-section>
            <q-card-section>
              <img
                v-if="product.images.length > 0"
                :src="getImageUrl(product.images[0])"
                style="
                  object-fit: contain;
                  overflow: hidden;
                  vertical-align: middle;
                  border: 1px solid black;
                  flex: 1 1 0%;
                  /* padding: 8px; */
                  border-radius: 3rem;
                  max-width: 100%;
                  max-height: 100%;
                  height: auto;
                "
              />
              <div class="text-start" style="border-radius: 1rem">
                <q-btn
                  color="pink-4"
                  icon="chevron_right"
                  label="Comprar"
                  flat
                />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div
          v-if="categoriaSelecionada == 'Brindes'"
          class="q-pa-md row justify-center"
        >
        <div>
            <q-card-section  @click="setCategoriaSelecionada('Adesivos')">
            <q-icon color="pink-4" size="2rem" name="label" />
            <div class="text-h6 text-bold">Adesivos</div>
            <div class="text-subtitle1">Personalize com seu estilo</div>
          </q-card-section>
          <q-card-section  @click="setCategoriaSelecionada('Brindes')">
            <q-icon color="pink-4" size="2rem" name="redeem" />
            <div class="text-h6 text-bold">Brindes e Mimos</div>
            <div class="text-subtitle1">Presentes para todas ocasiões</div>
          </q-card-section>
          <q-card-section  @click="setCategoriaSelecionada('Cartões')">
            <q-icon color="pink-4" size="2rem" name="style" />
            <div class="text-h6 text-bold">Cartões</div>
            <div class="text-subtitle1">
              Cartões de agradecimento e afetivos
            </div>
          </q-card-section>
          <q-card-section  @click="setCategoriaSelecionada('Decorações')">
            <q-icon color="pink-4" size="2rem" name="home" />
            <div class="text-h6 text-bold">Decorações</div>
            <div class="text-subtitle1">Itens únicos para sua casa</div>
          </q-card-section>
          </div>

          <q-card
            v-for="product in brindes"
            :key="product.id"
            bordered
            class="text-black col-xs-12 col-sm-3 col-md-3 col-lg-2 q-ma-md"
            style="background-color: transparent; border-radius: 1rem"
          >
            <q-card-section>
              <q-icon color="pink-4" size="1rem" name="redeem" />
              <div class="text-h6 text-bold">{{ product.name }}</div>
              <div class="text-subtitle1 description">
                {{ product.description }}
              </div>
            </q-card-section>
            <q-card-section>
              <img
                v-if="product.images.length > 0"
                :src="getImageUrl(product.images[0])"
                style="
                  object-fit: contain;
                  overflow: hidden;
                  vertical-align: middle;
                  border: 1px solid black;
                  flex: 1 1 0%;
                  /* padding: 8px; */
                  border-radius: 3rem;
                  max-width: 100%;
                  max-height: 100%;
                  height: auto;
                "
              />
              <div class="text-start" style="border-radius: 1rem">
                <q-btn
                  color="pink-4"
                  icon="chevron_right"
                  label="Ver Mais"
                  flat
                />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div
          v-if="categoriaSelecionada == 'Cartões'"
          class="q-pa-md row justify-center"
        > <div>
            <q-card-section  @click="setCategoriaSelecionada('Adesivos')">
            <q-icon color="pink-4" size="2rem" name="label" />
            <div class="text-h6 text-bold">Adesivos</div>
            <div class="text-subtitle1">Personalize com seu estilo</div>
          </q-card-section>
          <q-card-section  @click="setCategoriaSelecionada('Brindes')">
            <q-icon color="pink-4" size="2rem" name="redeem" />
            <div class="text-h6 text-bold">Brindes e Mimos</div>
            <div class="text-subtitle1">Presentes para todas ocasiões</div>
          </q-card-section>
          <q-card-section  @click="setCategoriaSelecionada('Cartões')">
            <q-icon color="pink-4" size="2rem" name="style" />
            <div class="text-h6 text-bold">Cartões</div>
            <div class="text-subtitle1">
              Cartões de agradecimento e afetivos
            </div>
          </q-card-section>
          <q-card-section  @click="setCategoriaSelecionada('Decorações')">
            <q-icon color="pink-4" size="2rem" name="home" />
            <div class="text-h6 text-bold">Decorações</div>
            <div class="text-subtitle1">Itens únicos para sua casa</div>
          </q-card-section>
          </div>
          <q-card
            v-for="product in cartoes"
            :key="product.id"
            bordered
            class="text-black col-xs-12 col-sm-3 col-md-3 col-lg-2 q-ma-md"
            style="background-color: transparent; border-radius: 1rem"
          >

            <q-card-section>
              <img
                v-if="product.images.length > 0"
                :src="getImageUrl(product.images[0])"
                style="
                  object-fit: contain;
                  overflow: hidden;
                  vertical-align: middle;
                  border: 1px solid black;
                  flex: 1 1 0%;
                  /* padding: 8px; */
                  border-radius: 3rem;
                  max-width: 100%;
                  max-height: 100%;
                  height: auto;
                "
              />
              <div class="text-start" style="border-radius: 1rem">
                <q-btn
                  color="pink-4"
                  icon="chevron_right"
                  label="Ver Mais"
                  flat
                />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div
          v-if="categoriaSelecionada == 'Decorações'"
          class="q-pa-md row justify-center"
        >
        <div>
            <q-card-section  @click="setCategoriaSelecionada('Adesivos')">
            <q-icon color="pink-4" size="2rem" name="label" />
            <div class="text-h6 text-bold">Adesivos</div>
            <div class="text-subtitle1">Personalize com seu estilo</div>
          </q-card-section>
          <q-card-section  @click="setCategoriaSelecionada('Brindes')">
            <q-icon color="pink-4" size="2rem" name="redeem" />
            <div class="text-h6 text-bold">Brindes e Mimos</div>
            <div class="text-subtitle1">Presentes para todas ocasiões</div>
          </q-card-section>
          <q-card-section  @click="setCategoriaSelecionada('Cartões')">
            <q-icon color="pink-4" size="2rem" name="style" />
            <div class="text-h6 text-bold">Cartões</div>
            <div class="text-subtitle1">
              Cartões de agradecimento e afetivos
            </div>
          </q-card-section>
          <q-card-section  @click="setCategoriaSelecionada('Decorações')">
            <q-icon color="pink-4" size="2rem" name="home" />
            <div class="text-h6 text-bold">Decorações</div>
            <div class="text-subtitle1">Itens únicos para sua casa</div>
          </q-card-section>
          </div>
          <q-card
            v-for="product in decoracoes"
            :key="product.id"
            bordered
            class="text-black col-xs-12 col-sm-3 col-md-3 col-lg-2 q-ma-md"
            style="background-color: transparent; border-radius: 1rem"
          >

            <q-card-section>
              <img
                v-if="product.images.length > 0"
                :src="getImageUrl(product.images[0])"
                style="
                  object-fit: contain;
                  overflow: hidden;
                  vertical-align: middle;
                  border: 1px solid black;
                  flex: 1 1 0%;
                  /* padding: 8px; */
                  border-radius: 3rem;
                  max-width: 100%;
                  max-height: 100%;
                  height: auto;
                "
              />
              <div class="text-start" style="border-radius: 1rem">
                <q-btn
                  color="pink-4"
                  icon="chevron_right"
                  label="Ver Mais"
                  flat
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Banner 1 -->
    <div
      v-if="!getUserComputed || getUserComputed.scope == 'cliente'"
      class="q-pt-xl q-pa-md q-gutter-sm"
    >
      <q-banner rounded>
        <div class="row bg-grey-1 q-card" style="border-radius: 1rem">
          <div
            class="col-xs-12 col-sm-6 bg-red-1 rounded-borders text-center"
            style="
              border-radius: 1rem;
              min-height: 100px;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
            "
          >
            <img
              src="~assets/tsakissa/IMG-20240801-WA0014.jpg"
              style="max-width: 100%; max-height: 500px"
            />
          </div>

          <div class="col-xs-12 col-sm-6">
            <q-card-section>
              <div
                style="cursor: pointer; font-size: 1rem; font-weight: 700"
                class="text-h6 text-underline text-pink"
              >
                Montar pacote
              </div>
            </q-card-section>

            <q-card-section>
              <div class="text-h5 text-bold">Ainda não se decidiu?</div>
              <div class="text-subtitle1 text-grey-8">
                Monte já uma oferta do seu jeito.
              </div>
            </q-card-section>

            <q-stepper
              v-model="step"
              vertical
              color="primary "
              style="box-shadow: none"
              class="bg-grey-1"
              animated
            >
              <!-- Ocultei esse por nao precisar -->
              <q-step
                :name="2"
                title="Informações de contacto"
                icon="settings"
                :done="step > 1"
                v-if="false"
              >
                <!-- Sender Information -->

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

                <!-- Receiver Information -->

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

                <q-stepper-navigation>
                  <q-btn
                    @click="step = 2"
                    style="background-color: #f27c38; color: white"
                    label="Continue"
                  />
                </q-stepper-navigation>
              </q-step>

              <q-step
                :name="1"
                title="Detalhes do Pacote"
                icon="create_new_folder"
                :done="step > 1"
                color="pink"
              >
                <q-dialog v-model="itemsDialog" full-width>
                  <q-card>
                    <q-card-section>
                      <div class="text-h6">Adicionar item</div>
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                      <q-input
                        filled
                        v-model="item.descricao"
                        label="Descrição"
                        required
                        type="textarea"
                        prepend-icon="description"
                        class="q-mb-md"
                      />
                      <q-input
                        filled
                        v-model="item.dimensoes"
                        label="Dimensões"
                        required
                        prepend-icon="zoom_out_map"
                        class="q-mb-md"
                      />
                      <q-input
                        filled
                        v-model="item.quantidade"
                        label="Quantidade"
                        type="number"
                        required
                        prepend-icon="format_list_numbered"
                        class="q-mb-md"
                      />

                      <div class="q-mb-md">
                        <label
                          for="upload-images"
                          class="upload-label full-width text-center"
                          >Adicionar Imagens</label
                        >
                        <input
                          type="file"
                          id="upload-images"
                          accept="image/*"
                          multiple
                          @change="onImageAdded(item, $event)"
                          class="upload-input"
                        />
                      </div>

                      <div v-if="item.images.length > 0">
                        <div
                          v-for="(image, imgIndex) in item.images"
                          :key="imgIndex"
                          class="q-mb-sm"
                        >
                          <img
                            :src="image.preview"
                            alt="Pré-visualização da imagem"
                            style="max-width: 100px; max-height: 100px"
                          />
                        </div>
                      </div>
                    </q-card-section>

                    <q-card-actions align="right">
                      <q-btn
                        @click="addItem"
                        color="amber"
                        class="text-black"
                        label="Adicionar item"
                        glossy
                        v-close-popup
                      />
                      <q-btn
                        flat
                        label="cancelar"
                        glossy
                        class="text-black"
                        v-close-popup
                      />
                    </q-card-actions>
                  </q-card>
                </q-dialog>

                <!-- Package Details -->

                <q-card-section>
                  <q-btn
                    label="Adicionar item"
                    @click="itemsDialog = true"
                    color="amber"
                    glossy
                    class="text-black q-mb-md full-width"
                  />
                  <q-card-section v-if="form.items.length > 0">
                    <div class="text-h6 text-bold">Items</div>
                  </q-card-section>

                  <div
                    v-for="(item, index) in form.items"
                    :key="index"
                    class="q-mb-md"
                  >
                    <q-item
                      clickable
                      v-ripple
                      class="rounded-borders"
                      :class="
                        $q.dark.isActive ? 'bg-grey-9 text-white' : 'bg-grey-2'
                      "
                    >
                      <q-item-section avatar>
                        <q-avatar rounded>
                          <div v-if="item.images.length > 0">
                            <img
                              :src="item.images[0]"
                              alt="Pré-visualização da imagem"
                              style="max-width: 100px; max-height: 100px"
                            />
                          </div>
                        </q-avatar>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>{{ item.descricao }}</q-item-label>
                      </q-item-section>

                      <q-item-section side class="row">
                        <span>Qtd: {{ item.quantidade }}</span>
                      </q-item-section>
                      <q-btn
                        style="color: #f27c38; right: -25px"
                        flat
                        icon="close"
                      />
                    </q-item>
                  </div>

                  <q-card-section>
                    <q-form @submit.prevent="submitForm">
                      <q-input
                        filled
                        v-model="form.nota"
                        label="Descreva aqui o que voce precisa"
                        type="textarea"
                        prepend-icon="edit"
                        class="q-mt-md"
                      />
                    </q-form>
                  </q-card-section>
                </q-card-section>

                <q-stepper-navigation>
                  <q-btn
                    @click="step = 3"
                    color="amber"
                    class="text-black"
                    glossy
                    label="Continuar"
                  />
                  <!-- <q-btn
                    flat
                    @click="step = 1"
                    style="color: #f27c38"
                    label="Back"
                    class="q-ml-sm"
                  /> -->
                </q-stepper-navigation>
              </q-step>

              <q-step
                :name="3"
                title="Informações de localização "
                icon="create_new_folder"
                :done="step > 3"
                color="pink"
              >
                <!-- Package Details -->

                <q-card-section>
                  <q-form @submit.prevent="submitForm">
                    <div v-if="false" class="row justify-between">
                      <q-input
                        filled
                        v-model="form.origem"
                        label="Origem"
                        required
                        prepend-icon="place"
                        class="q-mt-md col-10"
                      />

                      <q-btn
                        square
                        style="background-color: #f27c38; color: white"
                        icon="place"
                        class="q-mt-md col-2"
                      />
                    </div>

                    <div class="row justify-between">
                      <q-input
                        filled
                        v-model="form.destino"
                        label="Local de entrega"
                        required
                        prepend-icon="place"
                        class="q-mt-md col-12"
                      />

                      <q-btn
                        square
                        style="background-color: #f27c38; color: white"
                        icon="place"
                        class="q-mt-md col-2"
                        v-if="false"
                      />
                    </div>

                    <q-input
                      filled
                      v-model="form.horaDeLevantamento"
                      label="Hora de Levantamento"
                      type="time"
                      prepend-icon="schedule"
                      v-if="false"
                      class="q-mt-md"
                    />
                    <q-input
                      filled
                      v-model="form.horaDeEntrega"
                      label="Hora de Entrega"
                      type="time"
                      prepend-icon="schedule"
                      class="q-mt-md"
                      v-if="false"
                    />

                    <q-input
                      filled
                      v-model="form.valor"
                      label="Valor"
                      type="number"
                      required
                      prepend-icon="attach_money"
                      class="q-mt-md"
                      v-if="false"
                    />
                    <div v-if="false" class="text-subtitle">
                      Digite o Valor disposto a pagar pelo servico!
                    </div>
                  </q-form>
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

                <q-stepper-navigation>
                  <q-btn
                    style="background-color: #f27c38; color: white"
                    type="submit"
                    label="Continuar"
                    @click="step = 4"
                    color="amber"
                    class="text-black"
                    glossy
                  >
                  </q-btn>
                  <q-btn
                    flat
                    @click="step = 1"
                    glossy
                    label="Voltar"
                    class="q-ml-sm text-black"
                  />
                </q-stepper-navigation>
              </q-step>

              <q-step
                :name="4"
                title="Resumo"
                icon="create_new_folder"
                :done="step > 4"
                color="pink"
              >
                <q-item v-ripple v-if="false">
                  <q-item-section side>
                    <q-avatar icon="card_giftcard" rounded size="80px">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Hoje</q-item-label>
                    <q-item-label caption>agora</q-item-label>
                  </q-item-section>
                  <q-item-section side> {{ form.valor }} MT</q-item-section>
                </q-item>

                <q-timeline color="secondary">
                  <q-timeline-entry
                    title="Origem"
                    :subtitle="form.origem"
                    icon="my_location"
                    v-if="false"
                  >
                    <div class="text-subtitle text-bold">
                      {{ form.sender.name }}
                    </div>
                    <div>
                      Hora De Levantamento: {{ form.horaDeLevantamento }}
                    </div>
                  </q-timeline-entry>

                  <q-timeline-entry
                    :title="form.destino"
                    subtitle="Destino"
                    icon="place"
                  >
                    <div class="text-subtitle text-bold">
                      {{ form.receiver.name }}
                    </div>
                    <div v-if="false">
                      Hora de entrega: {{ form.horaDeEntrega }}
                    </div>
                  </q-timeline-entry>
                </q-timeline>

                <!-- Package Details -->

                <q-card-section>
                  <q-card-section>
                    <div class="text-h6 text-bold">Detalhes do Pacote</div>

                    <div
                      v-if="form.items.length > 0"
                      class="text-h61 text-bold"
                    >
                      Items
                    </div>
                  </q-card-section>

                  <div
                    v-for="(item, index) in form.items"
                    :key="index"
                    class="q-mb-md"
                  >
                    <q-item
                      clickable
                      v-ripple
                      class="rounded-borders"
                      :class="
                        $q.dark.isActive ? 'bg-grey-9 text-white' : 'bg-grey-2'
                      "
                    >
                      <q-item-section avatar>
                        <q-avatar rounded>
                          <div v-if="item.images.length > 0">
                            <img
                              :src="item.images[0].preview"
                              alt="Pré-visualização da imagem"
                              style="max-width: 100px; max-height: 100px"
                            />
                          </div>
                        </q-avatar>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>{{ item.descricao }}</q-item-label>
                      </q-item-section>

                      <q-item-section side class="row">
                        <span>Qtd: {{ item.quantidade }}</span>
                      </q-item-section>
                      <q-btn
                        style="color: #f27c38; right: -25px"
                        flat
                        icon="close"
                      />
                    </q-item>
                  </div>

                  <q-card-section>
                    <q-form @submit.prevent="submitForm">
                      <q-input
                        filled
                        v-model="form.nota"
                        label="Nota"
                        disable
                        type="textarea"
                        prepend-icon="edit"
                        class="q-mt-md"
                      />

                      <q-input
                        filled
                        v-model="form.valor"
                        label="Valor"
                        disable
                        prepend-icon="edit"
                        v-if="false"
                        class="q-mt-md"
                      />
                    </q-form>
                  </q-card-section>
                </q-card-section>

                <q-stepper-navigation>
                  <q-btn
                    :disable="registering"
                    color="amber"
                    class="text-black"
                    glossy
                    type="submit"
                    label="Solicitar Cotacao"
                    @click="submitForm"
                  >
                    <q-spinner-hourglass
                      v-if="registering"
                      color="white"
                      size="24px"
                    />
                  </q-btn>
                  <q-btn
                    flat
                    @click="step = 3"
                    color="black"
                    glossy
                    label="Voltar"
                    class="q-ml-sm"
                  />
                </q-stepper-navigation>
              </q-step>
            </q-stepper>
          </div>
        </div>
      </q-banner>
    </div>

    <!-- cards -->
    <div v-if="productSection" class="q-pt-xl q-pl-xl">
      <div class="text-black text-h3 text-bold">Artigos personalizados</div>
      <div class="text-black text-h6 text-bold q-pt-sm">
        Encontre os melhores itens para decorar e presentear com estilo e
        criatividade.
      </div>
      <!--  ProductsTabPanel -->
      <TsakissaProductsTabPanel
        v-if="getUserComputed && getUserComputed.scope == 'empresa'"
      />
      <div
        v-if="!getUserComputed || getUserComputed.scope == 'cliente'"
        class="q-pa-md row justify-center"
      >
        <q-card
          bordered
          class="text-black col-xs-12 col-sm-3 col-md-3 col-lg-2 q-ma-md bg-amber-2"
          style="border-radius: 1rem"
          v-for="product in products"
          :key="product.id"
        >
          <q-card-section>
            <div class="text-h5 text-bold">{{ product.name }}</div>
            <div class="text-subtitle1 description">
              {{ product.description }}
            </div>
          </q-card-section>

          <q-card-section>
            <div
              class="col-6 rounded-borders text-center"
              style="border-radius: 1rem"
            >
              <img
                v-if="product.images.length > 0"
                :src="getImageUrl(product.images[0])"
                style="max-width: 100%; max-height: 100%; height: auto"
              />
            </div>
          </q-card-section>

          <q-card-section>
            <div class="text-start" style="border-radius: 1rem">
              <q-btn icon="chevron_right" label="Ver Mais" flat />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <TsakissaListPackagePage v-if="orderSection" />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { ref } from "vue";
import store from "src/store/index.js";
import apiMethods from "src/router/api.js";
import TsakissaListPackagePage from "pages/TsakissaListPackagePage.vue";
import TsakissaProductsTabPanel from "components/AdminStore/TsakissaProductsTabPanel.vue";

export default defineComponent({
  components: {
    TsakissaListPackagePage,
    TsakissaProductsTabPanel,
  },
  data() {
    return {
      form: {
        sender: {
          name: "Tsakissa",
          apelido: "Tsakissa",
          telefone: "841184829",
        },
        receiver: {
          name: "",
          apelido: "",
          telefone: "",
        },
        origem: "Tsakissa",
        origemLat: 0,
        origemLong: 0,
        destino: "",
        destinoLat: 0,
        destinoLong: 0,
        service: "DELIVER_MAN",
        nota: "",
        // horaDeLevantamento: "",
        // horaDeEntrega: "",
        horaDeEntrega: "01:00",
        horaDeLevantamento: "01:00",
        valor: 0,
        items: [],
        // Example: array to hold item details
      },
      item: {
        descricao: "",
        dimensoes: "",
        quantidade: "",
        images: [],
      },
      serviceOptions: ["DELIVER_MAN", "TRACK"], // Example: service options
      showItemsSection: false, // Example: flag to show/hide item section based on logic
      registering: false,
      products: [],
      visibleProducts: [],
      cardMinWidth1: "250px",
      adesivos: [],
      brindes: [],
      cartoes: [],
      decoracoes: [],
      productSection: false,
      categoySection: false,
      orderSection: false,
      categoriaSelecionada: null,
    };
  },

  created() {
    this.inicio();
    this.fetchProducts();
    this.searchProducts();
  },
  mounted() {
    // this.initIntersectionObserver();
  },
  computed: {
    isAuthenticated() {
      return store.state.user ? true : false;
    },
    leftDrawerOpen() {
      return store.state.leftDrawerOpen;
    },
    cardMinWidth() {
      if (window.innerWidth > 550) {
        return "200px";
      } else if (window.innerWidth > 400) {
        return "170px";
      } else if (window.innerWidth > 300) {
        return "240px";
      } else {
        return "100px";
      }
    },
    innerWidth() {
      if (window.innerWidth > 2000) {
        return "62px";
      } else if (window.innerWidth > 700) {
        return "19px";
      } else {
        return "6";
      }
    },
    totalItemsInCart() {
      return store.getters.totalItemsInCart;
    },

    getUserComputed() {
      return store.state.user;
    },
  },
  methods: {
    inicio() {
      this.productSection = true;
      this.categoySection = true;
      this.orderSection = false;
    },
    setCategoriaSelecionada(categoriaSelecionada) {
      this.categoriaSelecionada = categoriaSelecionada;
    },
    verProdutos() {
      this.productSection = true;
      this.categoySection = false;
      this.orderSection = false;
    },
    verPedidos() {
      this.productSection = false;
      this.categoySection = false;
      this.orderSection = true;
    },
    verCategorias() {
      this.productSection = false;
      this.categoySection = true;
      this.orderSection = false;
    },
    toggleLeftDrawer() {
      store.commit("toggleLeftDrawer");
    },
    getImageUrl(imageName) {
      return apiMethods.baseURL()+`/storage/product_images/${imageName.name}`;
    },
    goToCart() {
      this.$router.push("/cart");
    },
    goToRegister() {
      this.$router.push("/register");
    },
    goToOrders() {
      this.$router.push("/c/show-packs");
    },
    goToLogin() {
      this.$router.push("/login");
    },
    goToProfile() {
      this.$router.push("/c/profile");
    },
    async fetchProducts() {
      try {
        const response = await apiMethods.getPublicProducts();
        this.products = response.data;
        // console.log(this.products);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    },
    async searchProducts() {
      try {
        let response = await apiMethods.searchProducts("Adesivos");
        this.adesivos = response.data;

        response = await apiMethods.searchProducts("Brindes");
        this.brindes = response.data;
        // console.log(response);

        response = await apiMethods.searchProducts("Cartões");
        this.cartoes = response.data;

        response = await apiMethods.searchProducts("Decorações");
        this.decoracoes = response.data;
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    },
    async logout() {
      try {
        this.$q.loading.show({
          message: "Terminando sua sessao",
        });
        // Chama a API para fazer login
        let response = await apiMethods.logout();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        this.$q.loading.hide();
        store.commit("clearUser");
        //  console.log(response.data.user)
        this.$router.push("/");
        store.commit("clearUser");
        this.$q.notify({
          color: "green",
          textColor: "white",
          icon: "cloud_done",
          message: "Volte sempre, obrigado.",
        });
      } catch (error) {
        console.error("Erro ao fazer logout:", error);localStorage.removeItem("token");
        localStorage.removeItem("user");
        this.$router.push("/login");
          store.commit("clearUser");
      } finally {
        this.$q.loading.hide();
      }
    },
    initIntersectionObserver() {
      const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.6,
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.visibleProducts.push(entry.target.id);
          } else {
            const index = this.visibleProducts.indexOf(entry.target.id);
            if (index > -1) {
              this.visibleProducts.splice(index, 1);
            }
          }
        });
      }, options);

      this.$refs.productCards.forEach((card) => {
        observer.observe(card);
      });
    },
    async submitForm() {
      try {
        this.registering = true; // Define registering como true durante o login

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
        // return
        // Call API method to store data
        const response = await apiMethods.personalizePedido(requestData);

        // Handle successful response
        console.log("Package stored successfully:", response);

        // Show success message to user
        this.$q.notify({
          color: "green",
          textColor: "white",
          icon: "cloud_done",
          message: "Pacote cadastrado com sucesso!",
        });
        this.registering = false;

        // Reset form after successful submission
        // this.resetForm();
      } catch (error) {
        // Handle error response from API
        console.error("Erro ao cadastrar pacote:", error);
        this.registering = false;
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
    addItem() {
      // Add new item object to items array
      this.form.items.push({
        descricao: this.item.descricao,
        dimensoes: this.item.dimensoes,
        quantidade: this.item.quantidade,
        images: [],
      });
      // console.log(this.form.items[this.form.items.length-1]);
      for (let i = 0; i < this.item.images.length; i++) {
        this.form.items[this.form.items.length - 1].images.push(
          this.item.images[i].preview
        );
      }
      console.log(this.form);
    },
    onImageAdded(item, event) {
      item.images = [];
      // Handle image upload for specific item
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          item.images.push({
            file: files[i],
            preview: e.target.result,
          });
        };
        reader.readAsDataURL(files[i]);
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

  setup() {
    // onMounted(() => {

    //   this.$router.push(`/editor`) // Redireciona para a página de login

    // });
    return {
      step: ref(1),
      itemsDialog: ref(false),
      slide: ref("style"),
    };
  },
});
</script>

<style>
.description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* Limita o texto a 2 linhas */
  overflow: hidden;
  text-overflow: ellipsis;
}
.scroll-container {
  display: flex;
  overflow-x: auto;
  gap: 16px; /* Espaçamento entre os cards */
  padding: 16px;
  background-color: #f9f9f9; /* Cor de fundo para o contêiner */
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 150px; /* Defina a largura dos cards */
  padding: 16px;
  text-align: center;
}

.card-highlight {
  outline: rgb(40, 190, 165) solid 0.1875rem;
}
.card-full {
  min-height: 35.9375rem;
}
.card {
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-box-pack: justify;
  border-radius: 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 1.0625rem 0.1875rem 0.1875rem;
  outline: rgb(226, 226, 226) solid 0.09375rem;
  padding: 1.5rem;
  transition: all 0.3s linear 0s;
}

.swiper-slide {
  animation: 0.8s ease-in-out 0s 1 normal forwards running fadeIn;
  height: auto;
}

.card__badge {
  background-color: rgb(40, 190, 165);
  border-radius: 1rem 1rem 0px;
  color: rgb(255, 255, 255);
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.3125rem 1rem;
  position: absolute;
  right: 0px;
  top: 0px;
  transition: all 0.3s ease-in-out 0s;
}
.offerTile__productsIcons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

/* Adicione a classe 'animated' e a classe da animação desejada */
.animated {
  animation-duration: 3s;
  animation-fill-mode: both;
}

.menu-item {
  cursor: pointer;
  transition: color 0.3s ease, transform 0.3s ease;
}

.menu-item:hover {
  color: pink; /* Cor de destaque ao passar o mouse */
  transform: scale(1.1); /* Leve aumento ao passar o mouse */
}

.menu-item:active {
  transform: scale(0.95); /* Leve redução ao clicar */
}
</style>
