<template>
  <q-layout>
    <HeaderC />
    <!-- Produto -->
    <div
      v-if="product"
      class="full-width row justify-center"
      :class="$q.screen.lt.md ? '' : 'q-gutter-lg'"
      style="background-color: #f5f5f5; padding: 20px; border-radius: 10px"
    >
      <!-- Imagem -->
      <div class="col-xs-11 col-sm-5 col-md-3 col-lg-3 col-xl-3">
        <!-- Imagem principal -->
        <q-img
          v-if="product.images.length > 0"
          :src="getImageUrl(selectedImage || product.images[0])"
          :alt="product.name"
          spinner-color="white"
          style="
            object-fit: contain;
            border-radius: 15px;
            border: 1px solid #d0d0d0;
            padding: 10px;
            background-color: #fff;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          "
          :class="$q.screen.lt.md ? 'q-mt-md' : ''"
        />

        <!-- Placeholder para quando não houver imagem -->
        <div
          v-else
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            border-radius: 15px;
            border: 1px solid #d0d0d0;
            padding: 10px;
            background-color: #fff;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          "
        >
          <span style="color: #d0d0d0">No image available</span>
        </div>

        <!-- Galeria de imagens horizontais com scroll -->
        <div
          v-if="product.images.length > 1"
          style="
            display: flex;
            overflow-x: auto;
            gap: 16px;
            margin-top: 15px;
            padding: 0 16px;
            scrollbar-width: thin;
            scroll-behavior: smooth;
            justify-content: start;
            -webkit-overflow-scrolling: touch;
            cursor: pointer;
          "
        >
          <q-img
            v-for="(image, index) in product.images"
            :key="index"
            :src="getImageUrl(image)"
            spinner-color="white"
            style="
              width: 60px;
              height: 60px;
              object-fit: cover;
              border-radius: 10px;
              border: 2px solid #d0d0d0;
              cursor: pointer;
              flex-shrink: 0;
            "
            :style="{
              borderColor: selectedImage === image ? '#007BFF' : '#d0d0d0',
            }"
            @click="selectedImage = image"
          />
        </div>
      </div>

      <!-- Descrição -->
      <div
        :class="$q.screen.lt.md ? 'q-ml-md' : ''"
        class="col-xs-11 col-sm-5 col-md-3 col-lg-3 col-xl-3"
      >
        <q-card-section
          class="q-card q bg-white"
          :class="$q.screen.lt.md ? 'q-mt-md ' : ''"
          style="border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1)"
        >
          <q-card-section class="row justify-between text-left text-black">
            <q-item-label
              style="font-weight: bold; font-size: 24px; color: black"
            >
              {{ product.name }}
            </q-item-label>
            <q-item-label
              v-if="product.price_discount != 0"
              style="font-size: 20px; color: black"
            >
              <span style="text-decoration: line-through; color: #b5475f">
                {{ product.price }} MT
              </span>
              <span style="color: green; font-weight: bold"
                >{{ product.price_discount }} MT</span
              >
            </q-item-label>
            <q-item-label
              v-else
              style="font-weight: bold; font-size: 20px; color: black"
            >
              {{ product.price }} MT
            </q-item-label>
          </q-card-section>

          <!-- Descrição -->
          <q-card-section class="row justify-between text-black">
            <div>{{ product.description }}</div>
          </q-card-section>
        </q-card-section>

        <!-- Detalhes - Versão Combo/Seleção -->
        <q-card-section
          class="q-card q-mt-md bg-white row text-start"
          style="border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1)"
        >
          <div class="col-12 q-col-gutter-md">
            <!-- Material -->
            <div
              class="row items-center q-mb-md"
              v-if="product?.material?.label"
            >
              <div class="col-4 text-subtitle1">Material:</div>
              <div class="col-8">
                <q-select
                  v-model="selectedMaterial"
                  :options="materialOptions"
                  label="Selecione o material"
                  dense
                  outlined
                  class="q-mb-sm"
                />
              </div>
            </div>

            <!-- Tamanho -->
            <div class="row items-center q-mb-md" v-if="showSizeSelector">
              <div class="col-4 text-subtitle1">Tamanho:</div>
              <div class="col-8">
                <div class="row q-gutter-sm">
                  <q-btn
                    v-for="size in sizeOptions"
                    :key="size"
                    :label="size"
                    :outline="selectedSize !== size"
                    :color="selectedSize === size ? 'primary' : 'grey-7'"
                    @click="selectSize(size)"
                    dense
                    class="size-btn"
                  />
                </div>
              </div>
            </div>

            <!-- Cores -->
            <div
              class="row items-center q-mb-md"
              v-if="colorOptions.length > 0"
            >
              <div class="col-4 text-subtitle1">Cor:</div>
              <div class="col-8">
                <div class="row q-gutter-sm items-center">
                  <div
                    v-for="(color, index) in colorOptions"
                    :key="index"
                    class="color-option cursor-pointer"
                    :class="{ 'color-selected': selectedColor === color }"
                    :style="{
                      backgroundColor: getColorCode(product?.colors[index]),
                      border:
                        selectedColor === color
                          ? '3px solid #1976d2'
                          : '2px solid #ddd',
                    }"
                    @click="selectColor(color)"
                    :title="color"
                  >
                    <q-tooltip>
                      {{ color }}
                    </q-tooltip>
                  </div>
                  <span v-if="selectedColor" class="text-caption q-ml-sm">
                    {{ selectedColor }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Ocasiões -->
            <div
              class="row items-center q-mb-md"
              v-if="occasionOptions.length > 0"
            >
              <div class="col-4 text-subtitle1">Ocasião:</div>
              <div class="col-8">
                <q-select
                  v-model="selectedOccasion"
                  :options="occasionOptions"
                  label="Selecione a ocasião"
                  dense
                  outlined
                  multiple
                  class="q-mb-sm"
                />
              </div>
            </div>

            <!-- Público -->
            <div
              class="row items-center q-mb-md"
              v-if="publicOptions.length > 0"
            >
              <div class="col-4 text-subtitle1">Público:</div>
              <div class="col-8">
                <q-option-group
                  v-model="selectedPublic"
                  :options="publicRadioOptions"
                  color="primary"
                  inline
                />
              </div>
            </div>

            <!-- Resumo da Seleção -->
            <div class="row q-mt-md" v-if="hasSelection">
              <div class="col-12">
                <q-card flat bordered class="bg-blue-1">
                  <q-card-section>
                    <div class="text-h6">Sua Seleção:</div>
                    <div v-if="selectedMaterial" class="text-caption">
                      <strong>Material:</strong> {{ selectedMaterial }}
                    </div>
                    <div v-if="selectedSize" class="text-caption">
                      <strong>Tamanho:</strong> {{ selectedSize }}
                    </div>
                    <div v-if="selectedColor" class="text-caption">
                      <strong>Cor:</strong> {{ selectedColor }}
                    </div>
                    <div
                      v-if="selectedOccasion.length > 0"
                      class="text-caption"
                    >
                      <strong>Ocasiões:</strong>
                      {{ selectedOccasion.join(", ") }}
                    </div>
                    <div v-if="selectedPublic" class="text-caption">
                      <strong>Público:</strong> {{ selectedPublic }}
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>

          <q-item-label
            class="q-mt-md"
            click="#comments"
            style="font-size: 16px; font-weight: bold"
          >
            <q-icon name="message" />
            Comentários ({{ comments.length }})
          </q-item-label>
        </q-card-section>

        <div
          class="q-card q-mt-md q-pa-md hover-card cursor-pointer"
          style="border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1)"
          @click="$router.push('/' + product.empresa.username)"
        >
          <div class="row items-center">
            <q-icon name="store" size="28px" color="black" class="q-mr-sm" />
            <div class="text-h5 text-bold text-subtitle1">
              Vendido por:
              <span style="font-weight: bold; font-size: 20px; color: black">
                {{ product.empresa.nome }}
              </span>
            </div>
          </div>
        </div>

        <!-- Botão de Chat -->
        <div class="q-mt-md">
          <q-chip
            color="white"
            text-color="black"
            class="q-pa-sm flex items-center cursor-pointer q-mb-xs shadow-hover hover-card cursor-pointer"
            style="
              border-radius: 25px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
              transition: all 0.3s;
            "
            @mouseover="hover = true"
            @mouseleave="hover = false"
            @click="openChat"
          >
            <q-icon name="chat" size="20px" class="q-mr-sm" />
            Falar com Vendedor
          </q-chip>
        </div>
      </div>

      <!-- Delivery e pagamentos -->
      <div class="col-xs-11 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <q-card-section
          class="q-card bg-white row text-start"
          :class="$q.screen.lt.md ? 'q-mt-md' : ''"
          style="border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1)"
        >
          <div style="font-weight: bold; font-size: 16px; color: black">
            Levante grátis em uma agência KLC Market
          </div>
          <div
            @click="verMapa = true"
            style="font-size: 15px; color: #4caf50"
            class="hover-card cursor-pointer"
          >
            Ver no mapa
          </div>
        </q-card-section>

        <!-- Políticas de devolução -->
        <q-card-section
          class="q-card q-mt-md bg-white row text-start"
          style="border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1)"
        >
          <span style="font-weight: bold; font-size: 16px; color: black"
            >Devolução grátis:
          </span>
          <span> Você tem 1 dia a partir da data de recebimento.</span>

          <br />

          <span style="font-weight: bold; font-size: 16px; color: black"
            >Compra Garantida:
          </span>
          <span> Receba o produto esperado ou devolvemos seu dinheiro.</span>
        </q-card-section>

        <!-- Métodos de pagamento -->
        <q-card-section
          class="q-card q-mt-md bg-white text-start"
          style="border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1)"
        >
          <div style="font-weight: bold; font-size: 16px; color: black">
            Métodos de pagamento
          </div>
          <div style="font-size: 15px">Pagamento na entrega.</div>
        </q-card-section>

        <!-- Botões de compra -->
        <div
          style="
            width: 100%;
            display: flex;
            justify-content: center;
            margin-top: 20px;
          "
        >
          <div style="display: flex; justify-content: center; gap: 10px">
            <!-- Botão Concluir Compra -->
            <q-btn
              v-if="getProductCartById(product.id) > 0"
              rounded
              dense
              label="Concluir Compra"
              color="green"
              class="glow-button"
              @click="goToCart"
            />

            <!-- Botão Comprar Agora -->
            <q-btn
              v-if="getProductCartById(product.id) < 1"
              rounded
              dense
              label="Comprar Agora"
              color="black"
              class="glow-button"
              @click="goToCart"
            />

            <!-- Grupo de Botões para Ajuste de Quantidade -->
            <q-btn-group
              v-if="getProductCartById(product.id) > 0"
              class="q-mb-md"
            >
              <q-btn
                style="background-color: #b5475f; color: white"
                icon="remove"
                @click="decrementProductQuantity(product.id)"
                class="glow-button"
              />
              <input
                :value="getProductCartById(product.id)"
                style="
                  width: 50px;
                  text-align: center;
                  border: 1px solid #d0d0d0;
                  border-radius: 5px;
                  padding: 5px;
                  font-size: 16px;
                  color: black;
                "
                readonly
              />
              <q-btn
                style="background-color: #b5475f; color: white"
                icon="add"
                @click="incrementProductQuantity(product.id)"
                class="glow-button"
              />
            </q-btn-group>

            <!-- Botão Adicionar ao Carrinho -->
            <q-btn
              v-if="getProductCartById(product.id) < 1"
              style="padding: 10px; border-radius: 5rem"
              dense
              class="bg-red-2 glowing-shadow-cancel glow-button"
              icon="add_shopping_cart"
              label="Adicionar ao Carrinho"
              @click="addProductToCart"
            />
          </div>
        </div>
      </div>

      <!-- Comentários -->
      <q-card-section
        class="col-xs-11 col-sm-12 col-md-3 col-lg-3 col-xl-3"
        id="comments"
      >
        <q-item-label style="font-weight: bold; font-size: 18px"
          >Comentários</q-item-label
        >

        <div v-for="comment in comments" :key="comment.id" class="q-mb-md">
          <q-item v-ripple>
            <q-item-section avatar>
              <q-avatar v-if="comment.photo" size="50px">
                <img :src="comment.photo" alt="User photo" />
              </q-avatar>
              <q-avatar v-else size="50px" color="grey-4">
                <q-icon name="person" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label v-if="comment.user" class="text-bold"
                >{{ comment.user.name }}
              </q-item-label>
              <q-item-label caption>{{ comment.content }}</q-item-label>
            </q-item-section>
            <q-item-section
              avatar
              v-if="user && user.id == comment.user_id"
              @click="openModal(comment)"
            >
              <q-avatar size="25px" color="grey-4">
                <q-icon name="delete" />
              </q-avatar>
            </q-item-section>
          </q-item>

          <!-- Exibe as imagens de form.images -->
          <div
            v-for="(image, index) in comment.images"
            :key="'form-' + index"
            class="image-container"
          >
            <img :src="getImageccUrl(image.url)" class="preview-image" />
          </div>
          <q-separator inset />
        </div>

        <!-- Campo para Novo Comentário -->
        <q-input
          v-model="newCommentText"
          placeholder="Escreva seu comentário..."
          filled
          dense
          class="q-mb-md hover-card cursor-pointer"
          type="textarea"
          @keyup.enter="addComment"
        />

        <div class="q-mb-md" v-if="user">
          <div class="image-preview">
            <label
              for="upload-images"
              class="upload-label text-center hover-card cursor-pointer"
            >
              <q-icon name="add_photo_alternate" size="48px" />
              <span>Adicionar Foto</span>
            </label>

            <!-- Exibe as imagens de imagePreview -->
            <div
              v-for="(image, index) in imagePreview"
              :key="'preview-' + index"
              class="image-container"
            >
              <img :src="image" class="preview-image" />
              <button class="remove-btn" @click="removeImage(index, 'preview')">
                ✖
              </button>
            </div>
          </div>

          <input
            type="file"
            id="upload-images"
            accept="image/*"
            multiple
            @change="previewImage"
            class="upload-input"
          />
        </div>

        <q-btn
          label="Comentar"
          class="full-width hover-card cursor-pointer"
          color="primary"
          @click="addComment"
          :disable="!newCommentText.trim() && registering"
          rounded
        >
          <q-spinner-hourglass v-if="registering" color="white" size="24px" />
        </q-btn>
      </q-card-section>

      <q-dialog v-model="isModalOpen" persistent>
        <q-card class="q-pa-none">
          <q-header class="q-mb-md text-start bg-white text-black">
            <q-toolbar>
              <q-toolbar-title>
                <q-card-section>
                  <div class="text-h6 text-bold q-mb-sm"></div>
                </q-card-section>
              </q-toolbar-title>

              <q-btn
                icon="close"
                @click="isModalOpen = false"
                flat
                color="black"
              />
            </q-toolbar>
          </q-header>
          <!-- Cabeçalho com ícone de fechar -->
          <q-card-section class="q-pa-md q-mt-xl text-dark relative">
            <div class="text-h6 text-bold q-mb-sm">
              <span class="text-dark"
                >Atenção! Antes de finalizar o seu pedido, consulte o vendedor!
                📞</span
              >
            </div>
            <div class="text-body2 text-dark q-mb-md">
              Para garantir que o produto está disponível e pronto para envio,
              recomendamos que você entre em contato com o vendedor antes de
              fazer o pedido. Isso evita contratempos e garante uma experiência
              de compra mais tranquila.
              <br />
              Verifique a disponibilidade e faça seu pedido com confiança! 💬
            </div>
          </q-card-section>

          <!-- Corpo do Modal com Botões -->
          <q-card-section class="q-pa-md">
            <!-- Botões de compra -->
            <div style="width: 100%; display: flex; justify-content: center">
              <div style="display: flex; justify-content: center; gap: 10px">
                <!-- Botão Concluir Compra -->
                <q-btn
                  v-if="getProductCartById(product.id) > 0"
                  rounded
                  dense
                  label="Concluir Compra"
                  color="green"
                  class="glow-button"
                  @click="goToCart"
                />

                <!-- Botão Comprar Agora -->
                <q-btn
                  v-if="getProductCartById(product.id) < 1"
                  rounded
                  dense
                  label="Comprar Agora"
                  color="black"
                  class="glow-button"
                  @click="goToCart"
                />

                <!-- Grupo de Botões para Ajuste de Quantidade -->
                <q-btn-group
                  v-if="getProductCartById(product.id) > 0"
                  class="q-mb-md"
                >
                  <q-btn
                    style="background-color: #b5475f; color: white"
                    icon="remove"
                    @click="decrementProductQuantity(product.id)"
                    class="glow-button"
                  />
                  <input
                    :value="getProductCartById(product.id)"
                    style="
                      width: 50px;
                      text-align: center;
                      border: 1px solid #d0d0d0;
                      border-radius: 5px;
                      padding: 5px;
                      font-size: 16px;
                      color: black;
                    "
                    readonly
                  />
                  <q-btn
                    style="background-color: #b5475f; color: white"
                    icon="add"
                    @click="incrementProductQuantity(product.id)"
                    class="glow-button"
                  />
                </q-btn-group>

                <!-- Botão Adicionar ao Carrinho -->
                <q-btn
                  v-if="getProductCartById(product.id) < 1"
                  style="padding: 10px; border-radius: 5rem"
                  dense
                  class="bg-red-2 glowing-shadow-cancel glow-button"
                  icon="add_shopping_cart"
                  label="Adicionar ao Carrinho"
                  @click="addProductToCart"
                />
              </div>
            </div>
            <q-btn
              label="Falar com Vendedor"
              icon="chat"
              color="accent"
              @click="openChat"
              class="q-mt-md q-shadow-2"
              style="border-radius: 20px"
            />
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog
        transition-show="slide-up"
        transition-hide="slide-down"
        v-model="verMapa"
      >
        <div class="q-mb-md text-start bg-white text-black col-12">
          <div class="row space-between" style="width: 100%">
            <div class="col-9">
              <q-card-section style="padding-bottom: 0px; padding-top: 0px">
                <h2 class="text-h6">Endereço:</h2>
              </q-card-section>
            </div>

            <q-btn
              class="col-3"
              @click="verMapa = false"
              rounded
              dense
              flat
              size="md"
              icon="close"
            ></q-btn>
          </div>

          <!-- Endereço com quebra de linha -->
          <div class="q-pa-md text-bold mb-3">
            <p>Av. Julius Nyerere, Campus Universitário Principal da UEM,</p>
            <p>
              Incubadora de Negócios da UEM, 3453, <br />
              Maputo – Moçambique
            </p>
          </div>
          <LMap
            class="full-width"
            ref="mapPage"
            :markers="markers"
            :mapHeight="'100vh'"
          />
        </div>
      </q-dialog>

      <!--outros -->
      <div class="col-12 q-pt-md">
        <!--  categorias e tags -->
        <div class="q-mb-md" v-if="product.categories.length > 0">
          <q-card-section>
            <div class="text-subtitle1">Categorias</div>
            <q-chip
              v-for="category in product.categories"
              :key="category.id"
              color="primary"
              text-color="white"
              icon="category"
              class="q-mr-sm q-mb-sm"
            >
              {{ category.name }}
            </q-chip>
          </q-card-section>
        </div>

        <!--  categorias e tags -->
        <div v-if="product.tags.length > 0">
          <q-card-section>
            <div class="text-subtitle1">Tags</div>

            <q-chip
              v-for="tag in product.tags"
              :key="tag.id"
              color="secondary"
              text-color="white"
              icon="label"
              class="q-mr-sm q-mb-sm"
            >
              {{ tag.name }}
            </q-chip>
          </q-card-section>
        </div>

        <!-- Perfil do vendedor -->
        <ProfileOfDealler :empresa="product.empresa" :product="product" />

        <!-- Perguntas Frequentes -->
        <q-card-section v-if="false">
          <q-item-label style="font-weight: bold; font-size: 18px"
            >Perguntas Frequentes</q-item-label
          >

          <div v-for="faq in filteredFaqs" :key="faq.id" class="q-pa-sm">
            <q-expansion-item
              expand-separator
              :label="faq.question"
              icon="question_answer"
              dense
            >
              <div>{{ faq.answer }}</div>
            </q-expansion-item>
          </div>

          <!-- Campo para Nova Pergunta -->
          <q-input
            v-model="newQuestion"
            placeholder="Digite sua pergunta..."
            dense
            filled
            @input="searchQuestion"
            @keyup.enter="addQuestion"
            class="q-my-md"
          />

          <q-btn
            label="Perguntar"
            class="full-width"
            @click="addQuestion"
            color="primary"
            dense
            :disable="!newQuestion.trim()"
          />
        </q-card-section>
      </div>

      <!-- botoes de compra e carrinho -->
      <div
        v-if="$q.screen.lt.md && false"
        style="
          position: fixed;
          bottom: 15px;
          width: 100%;
          display: flex;
          justify-content: center;
          z-index: 99999;
        "
      >
        <q-toolbar style="width: 80%; display: flex; justify-content: center">
          <q-btn
            v-if="getProductCartById(product.id) > 0"
            style="height: 70px; padding: 9px"
            rounded
            dense
            label="Concluir compra"
            color="grey-9"
            @click="goToCart"
          >
          </q-btn
          ><q-btn
            v-if="getProductCartById(product.id) < 1"
            style="height: 70px; padding: 9px"
            rounded
            dense
            label="Comprar agora"
            color="black"
            @click="goToCart"
          ></q-btn>
          <q-toolbar-title>
            <q-card-section style="padding-bottom: 0px; padding-top: 0px">
            </q-card-section>
          </q-toolbar-title>

          <div class="q-mb-md">
            <q-btn-group
              v-if="getProductCartById(product.id) > 0"
              class="q-mb-md"
              style="box-shadow: none"
            >
              <q-btn
                style="width: 10px; background-color: #b5475f; color: white"
                icon="remove"
                @click="decrementProductQuantity(product.id)"
              />
              <input
                :value="getProductCartById(product.id)"
                style="
                  width: 50px;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  text-align: center;
                "
                filled
              />
              <q-btn
                style="width: 10px; background-color: #b5475f; color: white"
                icon="add"
                @click="incrementProductQuantity(product.id)"
              />
            </q-btn-group>
          </div>

          <q-btn
            v-if="getProductCartById(product.id) < 1"
            style="
              height: 70px;
              width: 100px;
              padding: 9px;
              border-radius: 5rem;
            "
            dense
            class="bg-red-2 glowing-shadow-cancel"
            icon="add_shopping_cart"
            @click="addProductToCart"
          />
        </q-toolbar>
      </div>
    </div>

    <!-- Skeleton -->
    <div
      v-else
      class="full-width row justify-center"
      :class="$q.screen.lt.md ? '' : 'q-gutter-lg'"
      style="
        margin-bottom: 102px;
        background-color: #f5f5f5;
        padding: 20px;
        border-radius: 10px;
      "
    >
      <!-- Imagem -->
      <div class="col-11 col-md-3">
        <q-skeleton height="200px" square />
      </div>

      <!-- Descrição -->
      <div class="col-11 col-md-3">
        <q-card-section
          class="q-card q bg-white"
          :class="$q.screen.lt.md ? 'q-mt-md' : ''"
          style="border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1)"
        >
          <q-card-section class="row justify-between text-center text-black">
            <q-item-label
              style="font-weight: bold; font-size: 24px; color: black"
            >
              <q-skeleton height="40px" type="text" width="150px" />
            </q-item-label>

            <q-item-label
              style="font-weight: bold; font-size: 20px; color: black"
            >
              <q-skeleton height="40px" type="text" width="50px" />
            </q-item-label>
          </q-card-section>

          <!-- Estado e número de vendidos -->
          <q-card-section class="row justify-between text-center">
            <q-skeleton height="10px" type="text" width="50px" />||
            <q-item-label style="color: green; font-weight: bold"
              ><q-skeleton height="10px" type="text" width="50px"
            /></q-item-label>
            ||
            <q-item-label style="color: grey"
              ><q-skeleton height="10px" type="text" width="50px"
            /></q-item-label>
          </q-card-section>

          <!-- Descrição -->
          <q-card-section class="row justify-between text-black">
            <q-skeleton height="10px" type="text" width="100%" />
            <q-skeleton height="10px" type="text" width="100%" />
            <q-skeleton height="10px" type="text" width="100%" />
            <q-skeleton height="10px" type="text" width="100%" />
            <q-skeleton height="10px" type="text" width="90%" />
            <q-skeleton height="10px" type="text" width="70%" />
            <q-skeleton height="10px" type="text" width="50%" />
          </q-card-section>
        </q-card-section>
        <!-- Detalhes -->
        <q-card-section
          class="q-card q-mt-md bg-white row text-start"
          style="border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1)"
        >
          <q-item-label class="col-6" style="font-size: 15px"
            ><q-skeleton height="10px" type="text" width="50%"
          /></q-item-label>
          <q-item-label class="col-6" style="font-size: 16px; font-weight: bold"
            ><q-skeleton height="10px" type="text" width="50%"
          /></q-item-label>
          <q-item-label class="col-6" style="font-size: 15px"
            ><q-skeleton height="10px" type="text" width="50%"
          /></q-item-label>
          <q-item-label class="col-6" style="font-size: 16px; font-weight: bold"
            ><q-skeleton height="10px" type="text" width="50%"
          /></q-item-label>
        </q-card-section>
      </div>

      <!-- Delivery e pagamentos -->
      <div class="col-11 col-md-3">
        <q-card-section
          class="q-card bg-white text-start"
          :class="$q.screen.lt.md ? 'q-mt-md' : ''"
          style="border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1)"
        >
          <div>
            <q-skeleton height="20px" type="text" width="100%" />

            <q-skeleton height="10px" type="text" width="100%" />
          </div>
        </q-card-section>

        <!-- Políticas de devolução -->
        <q-card-section
          class="q-card q-mt-md bg-white text-start"
          style="border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1)"
        >
          <q-skeleton height="20px" type="text" width="100%" />

          <q-skeleton height="10px" type="text" width="80%" />
          <q-skeleton height="20px" type="text" width="50%" />

          <q-skeleton height="10px" type="text" width="100%" />
        </q-card-section>

        <!-- Métodos de pagamento -->
        <q-card-section
          class="q-card q-mt-md bg-white text-start"
          style="border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1)"
        >
          <div style="font-weight: bold; font-size: 16px; color: black">
            <q-skeleton height="10px" square />
          </div>
          <div style="font-size: 15px"><q-skeleton height="10px" square /></div>
          <div style="font-size: 15px"><q-skeleton height="10px" square /></div>
        </q-card-section>

        <!-- Botões de compra -->

        <div class="row justify-around q-mt-md">
          <!-- Botão Concluir Compra -->
          <q-skeleton height="40px" square width="40%" />
          <!-- Botão Comprar Agora -->
          <q-skeleton height="40px" square width="40%" />
        </div>
      </div>
    </div>

    <!-- Modal para remover comentario -->
    <q-dialog
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
      v-model="delete_comment_modal"
    >
      <q-card class="q-pa-md col-12">
        <div>
          <q-card-section style="padding-bottom: 0px; padding-top: 0px">
            <h2 class="text-h6">
              Tem certeza que quer remover esse comentario?
            </h2>
          </q-card-section>
          <q-btn
            rounded
            dense
            class="bg-red-2 q-mr-md"
            @click="deleteComment(selectedProduct.id)"
            :disable="registering"
            label="Remover"
          >
            <q-spinner-hourglass v-if="registering" color="white" size="24px" />
          </q-btn>

          <q-btn
            rounded
            dense
            class="bg-yellow-2"
            @click="delete_comment_modal = false"
            :disable="registering"
            label="Fechar"
          >
          </q-btn>
        </div>
      </q-card>
    </q-dialog>

    <!-- Modal para visualizar e editar produto -->
    <q-dialog
      transition-show="slide-up"
      transition-hide="slide-down"
      v-model="authModal"
    >
      <q-card class="q-pa-md col-12">
        <q-btn
          rounded
          dense
          class="bg-red-2 q-ma-md"
          @click="authModal = false"
          label="Fechar"
        >
        </q-btn>
        <div>
          <q-card-section style="padding-bottom: 0px; padding-top: 0px">
            <h2 class="text-h6">
              Para deixar um comentário, faça login na sua conta. Caso ainda não
              tenha uma, você pode se cadastrar utilizando o formulário abaixo.
            </h2>
          </q-card-section>
        </div>
        <AuthBanner />
      </q-card>
    </q-dialog>
    <FooterC
  /></q-layout>
</template>

<script>
import store from "src/store/index.js";
import apiMethods from "src/router/api.js";
import ProfileOfDealler from "components/store/ProfileOfDealler.vue";
import HeaderC from "components/store/HeaderC.vue";
import FooterC from "components/store/FooterC.vue";
import AuthBanner from "src/components/banners/AuthBanner1.vue";
import LMap from "../../components/LMap.vue";
import { useHead } from "@vueuse/head";

export default {
  name: "ProductsPage",
  components: {
    ProfileOfDealler,
    HeaderC,
    FooterC,
    AuthBanner,
    LMap,
  },
  data() {
    return {
      product: null,
      selectedProduct: null,
      selectedImage: null,
      showProductModal: false,
      loading: false,
      isModalOpen: false,
      error: null,
      faqs: [
        {
          id: 1,
          question: "Qual é o prazo de entrega?",
          answer: "O prazo de entrega é de 3 a 5 dias úteis.",
        },
        {
          id: 2,
          question: "Posso devolver o produto?",
          answer: "Sim, você tem até 7 dias para devolução.",
        },
        {
          id: 3,
          question: "Como posso pagar?",
          answer: "Aceitamos pagamentos por M-Pesa, MoMo, e cartões.",
        },
      ],
      registering: false,
      newQuestion: "",
      filteredFaqs: [],
      comments: [],
      newCommentText: "",
      imagePreview: [],
      delete_comment_modal: false,
      authModal: false,
      verMapa: false,
      hover: false,

      // Selection properties
      selectedMaterial: null,
      selectedSize: null,
      selectedColor: null,
      selectedOccasion: [],
      selectedPublic: null,
    };
  },
  created() {
    this.fetchProductById();
    this.getComments();
  },
  mounted() {
    this.filteredFaqs = this.faqs;
  },
  watch: {
    "$route.params.id"(newId, oldId) {
      if (newId !== oldId) {
        this.product = null;
        this.fetchProductById();
      }
    },
    product: {
      handler(newProduct) {
        if (!newProduct) return;
        document.title = `${newProduct.name} | KLC Market`;
        useHead({
          title: `${newProduct.name} | KLC Market`,
          meta: [
            { name: "description", content: newProduct.description },
            { property: "og:title", content: newProduct.name },
            { property: "og:description", content: newProduct.description },
            {
              property: "og:image",
              content:
                apiMethods.baseURL() +
                `/storage/product_images/${newProduct.images?.[0]?.name}`,
            },
          ],
        });
      },
      immediate: true,
    },
  },
  computed: {
    totalItemsInCart() {
      return store.getters.totalItemsInCart;
    },
    user() {
      return store.state.user;
    },

    // Selection computed properties
    materialOptions() {
      if (this.product?.material?.label) {
        return [this.product.material.label];
      }
      return [];
    },

    sizeOptions() {
      if (!this.product?.dimensions) return [];

      if (
        typeof this.product.dimensions === "string" &&
        this.product.dimensions !== "06/01/2025"
      ) {
        return [this.product.dimensions];
      } else if (Array.isArray(this.product.dimensions)) {
        return this.product.dimensions;
      }
      return [];
    },

    showSizeSelector() {
      return (
        this.sizeOptions.length > 0 &&
        !(this.sizeOptions.length === 1 && this.sizeOptions[0] === "Único")
      );
    },

    colorOptions() {
      if (!this.product?.colors) return [];
      return this.translateColors(this.product.colors, "pt");
    },

    occasionOptions() {
      if (!this.product?.occasion) return [];
      return Array.isArray(this.product.occasion)
        ? this.product.occasion
        : [this.product.occasion];
    },

    publicOptions() {
      if (!this.product?.public) return [];
      return Array.isArray(this.product.public)
        ? this.product.public
        : [this.product.public];
    },

    publicRadioOptions() {
      return this.publicOptions.map((pub) => ({
        label: this.capitalizeFirstLetter(pub),
        value: pub,
      }));
    },

    hasSelection() {
      return (
        this.selectedMaterial ||
        this.selectedSize ||
        this.selectedColor ||
        this.selectedOccasion.length > 0 ||
        this.selectedPublic
      );
    },
  },
  methods: {
    openChat() {
      const id = this.$route.params.id;
      this.$router.push("/chat/" + this.product.empresa.user_id + "/" + id);
    },

    // Selection methods
    selectSize(size) {
      this.selectedSize = this.selectedSize === size ? null : size;
    },

    selectColor(color) {
      this.selectedColor = this.selectedColor === color ? null : color;
    },

    getColorCode(colorName) {
      const colorMap = {
        red: "#ff0000",
        blue: "#0000ff",
        green: "#008000",
        yellow: "#ffff00",
        black: "#000000",
        white: "#ffffff",
        gray: "#808080",
        orange: "#ffa500",
        purple: "#800080",
        pink: "#ffc0cb",
        brown: "#a52a2a",
        vermelho: "#ff0000",
        azul: "#0000ff",
        verde: "#008000",
        amarelo: "#ffff00",
        preto: "#000000",
        branco: "#ffffff",
        cinza: "#808080",
        laranja: "#ffa500",
        roxo: "#800080",
        rosa: "#ffc0cb",
        marrom: "#a52a2a",
      };
      return colorMap[colorName.toLowerCase()] || "#cccccc";
    },

    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },

    translateColors(colors, language = "en") {
      if (!colors) return [];
      if (typeof colors === "string") {
        colors = [colors];
      }

      const colorMap = {
        red: "Vermelho",
        blue: "Azul",
        green: "Verde",
        yellow: "Amarelo",
        black: "Preto",
        white: "Branco",
        gray: "Cinza",
        orange: "Laranja",
        purple: "Roxo",
        pink: "Rosa",
        brown: "Marrom",
        Vermelho: "red",
        Azul: "blue",
        Verde: "green",
        Amarelo: "yellow",
        Preto: "black",
        Branco: "white",
        Cinza: "gray",
        Laranja: "orange",
        Roxo: "purple",
        Rosa: "pink",
        Marrom: "brown",
      };

      if (language === "pt") {
        return colors.map((color) => colorMap[color.toLowerCase()] || color);
      } else if (language === "en") {
        return colors.map((color) => colorMap[color] || color);
      }
      return colors;
    },

    async addComment() {
      if (!this.user) {
        this.authModal = true;
        return;
      }
      this.registering = true;
      if (!this.newCommentText.trim()) return;
      const id = this.$route.params.id;
      const newComment = {
        content: this.newCommentText,
      };
      newComment.images = [...this.imagePreview];

      try {
        const response = await apiMethods.createComment(id, newComment);
        this.comments = response.data.comments;
        this.newCommentText = "";
        this.registering = false;
      } catch (error) {
        this.registering = false;
        console.error("Erro ao buscar produtos:", error);
      }
    },

    removeImage(index, listType) {
      if (listType === "form") {
        this.form.images.splice(index, 1);
      } else if (listType === "preview") {
        this.imagePreview.splice(index, 1);
      }
    },

    async getComments() {
      const id = this.$route.params.id;
      try {
        const response = await apiMethods.getComments(id);
        this.comments = response.data.comments;
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    },

    async deleteComment(id) {
      this.registering = true;
      try {
        const response = await apiMethods.deleteComment(id);
        this.comments = response.data.comments;
        this.delete_comment_modal = false;
        this.selectedProduct = null;
        this.registering = false;
      } catch (error) {
        this.registering = false;
        console.error("Erro ao buscar produtos:", error);
      }
    },

    openModal(p) {
      this.selectedProduct = p;
      this.delete_comment_modal = true;
    },

    previewImage(event) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) {
          continue;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    },

    searchQuestion() {
      this.filteredFaqs = this.faqs.filter((faq) =>
        faq.question.toLowerCase().includes(this.newQuestion.toLowerCase())
      );
    },

    addQuestion() {
      if (!this.newQuestion.trim()) return;

      const existingFaq = this.faqs.find(
        (faq) => faq.question.toLowerCase() === this.newQuestion.toLowerCase()
      );

      if (existingFaq) {
        alert("Esta pergunta já está nas perguntas frequentes!");
        return;
      }

      alert(`Pergunta enviada: "${this.newQuestion}"`);
      this.newQuestion = "";
      this.searchQuestion();
    },

    voltar() {
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push("/");
      }
    },

    getProductCartById(id) {
      let product = store.getters.getProductCartById(id);
      if (product) {
        return product.quantity;
      }
      return 0;
    },

    increment() {
      store.commit("increment");
    },

    showCart() {
      store.commit("showCart");
    },

    incrementProductQuantity(id) {
      store.getters.incrementProductQuantity(id);
    },

    decrementProductQuantity(id) {
      store.getters.decrementProductQuantity(id, true);
    },

    decrementProductQuantity2(id) {
      store.getters.decrementProductQuantity(id);
    },

    async fetchProductById() {
      try {
        const id = this.$route.params.id;

        this.loading = true;
        this.error = null;
        const response = await apiMethods.getPublicProductById(id);
        const product = response.data.product;
        this.product = response.data.product;

        const descriptionPart = product.description
          .replace(/(\{.*\})/, "")
          .trim();
        const jsonString = product.description.match(/\{.*\}/);
        const jsonData = jsonString ? JSON.parse(jsonString[0]) : {};

        this.product.description = descriptionPart;
        this.product.parsedData = jsonData;
        Object.assign(this.product, jsonData);
        this.product.size = jsonData.dimensions;
        this.product.material = jsonData.material;

        fbq("track", "ViewContent", {
          content_name: this.product.name,
          content_category: this.product?.category || "",
          content_ids: [id],
          content_type: "product",
          value: this.product.price,
          currency: "MZN",
        });

        useHead({
          title: `${this.product.name} | KLC Market`,
          meta: [
            { name: "description", content: this.product.description },
            { property: "og:title", content: this.product.name },
            { property: "og:description", content: this.product.description },
            {
              property: "og:image",
              content:
                apiMethods.baseURL() +
                `/storage/product_images/${this.product.images[0].name}`,
            },
          ],
        });
      } catch (error) {
        this.error = "Error fetching item details";
        console.error("Erro ao buscar produtos:", error);
      }
    },

    getImageUrl(imageName) {
      return apiMethods.baseURL() + `/storage/product_images/${imageName.name}`;
    },

    getImageccUrl(url) {
      return apiMethods.baseURL() + `/storage/${url}`;
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

    addProductToCart() {
      if (this.product != null) {
        const productWithSelections = {
          ...this.product,
          selectedOptions: {
            material: this.selectedMaterial,
            size: this.selectedSize,
            color: this.selectedColor,
            occasion: this.selectedOccasion,
            public: this.selectedPublic,
          },
        };

        store.commit("addToCart", productWithSelections);

        fbq("track", "AddToCart", {
          content_name: this.product.name,
          content_category: this.product?.category || "",
          content_ids: [this.product.id],
          content_type: "product",
          value: this.product.price,
          currency: "MZN",
        });
      }
    },

    goToCart1() {
      this.$router.push("/cart");
    },

    goToCart() {
      if (this.getProductCartById(this.product.id) < 1) {
        const productWithSelections = {
          ...this.product,
          selectedOptions: {
            material: this.selectedMaterial,
            size: this.selectedSize,
            color: this.selectedColor,
            occasion: this.selectedOccasion,
            public: this.selectedPublic,
          },
        };

        store.commit("addToCart", productWithSelections);

        fbq("track", "AddToCart", {
          content_name: this.product.name,
          content_category: this.product?.category || "",
          content_ids: [this.product.id],
          content_type: "product",
          value: this.product.price,
          currency: "MZN",
        });
      }
      this.$router.push("/cart");
    },
  },
};
</script>

<style scoped>
.product-card {
  transition: transform 0.3s, filter 0.3s;
}

.product-card.highlighted-product {
  transform: scale(1.1);
  filter: blur(0);
}

.product-card.even-product {
  background-color: #87ceeb;
}

.product-card.odd-product {
  background-color: #d3d3d3;
}

.glowing-shadow-add {
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.6), 0 0 20px rgba(255, 0, 0, 0.4),
    0 0 30px rgba(255, 0, 0, 0.2);
  transition: box-shadow 0.3s ease-in-out;
}

.glow-button {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s, transform 0.2s;
}

.glow-button:hover {
  transform: scale(1.05);
}

.image-preview {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  gap: 10px;
}

.product-img {
  object-fit: contain;
  overflow: hidden;
  vertical-align: middle;
  border-radius: 22px;
  border: 1px solid black;
  flex: 1 1 0%;
  padding: 8px;
}

.image-container {
  position: relative;
  display: inline-block;
  margin: 10px;
}

.preview-image {
  flex: 0 0 90%;
  height: 100px;
  max-height: 100px;
  max-width: 100px;
  object-fit: cover;
}

.upload-label {
  flex: 0 0 90%;
  display: flex;
  flex-direction: column;
  padding: 6px 12px;
  cursor: pointer;
  background-color: #97928e;
  color: white;
  border-radius: 4px;
  font-size: 14px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  height: 100px;
  max-height: 100px;
  max-width: 100px;
  align-items: center;
  text-align: center;
  justify-content: center;
}

.remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(255, 0, 0, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: rgba(255, 0, 0, 1);
}

.upload-input {
  display: none;
}

.hover-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

/* Selection styles */
.size-btn {
  min-width: 40px;
  min-height: 32px;
}

.color-option {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.color-selected {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.color-option:hover {
  transform: scale(1.05);
}

/* Estilo para seleção múltipla de ocasiões */
.q-select--multiple .q-chip {
  background: #1976d2;
  color: white;
}
</style>
