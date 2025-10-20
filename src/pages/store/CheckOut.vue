<template>
  <div>
    <q-toolbar
      style="
        position: fixed;
        top: 0px;
        width: 100%;
        display: flex;
        justify-content: center;
        z-index: 99999;
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
      ></q-btn>
      <div style="flex: 1; text-align: center">
        <q-toolbar-title> Carrinho </q-toolbar-title>
      </div>
      <div style="width: 56px"></div>
      <!-- Placeholder to balance the space -->
    </q-toolbar>
  </div>

  <div class="q-pa-md" style="margin-top: 102px; margin-bottom: 102px">
    <q-list bordered padding class="cart-list">
      <q-item v-for="item in cartItems" :key="item.id" class="q-mb-md">
        <q-item-section avatar>
          <q-img
            :src="item.image"
            :alt="item.name"
            class="cart-item-image"
          ></q-img>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ item.name }}</q-item-label>
          <q-item-label caption
            >{{ item.price * item.quantity }} MZN</q-item-label
          >
        </q-item-section>
        <q-item-section side>
          <q-btn
            dense
            flat
            @click="removeItem(item.id)"
            icon="close"
            class="text-red"
          ></q-btn>
          <div class="quantity-controls">
            <q-btn
              dense
              flat
              @click="decreaseQuantity(item.id)"
              icon="remove"
              class="text-primary"
            ></q-btn>
            <span>{{ item.quantity }}</span>
            <q-btn
              dense
              flat
              @click="increaseQuantity(item.id)"
              icon="add"
              class="text-primary"
            ></q-btn>
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <div
      style="
        position: fixed;
        bottom: 0px;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        z-index: 99999;
      "
    >
      <q-toolbar
        class="row justify-between q-pa-md bg-white"
        style="width: 100%; border-top: 1px solid rgba(0, 0, 0, 0.1)"
      >
        <div class="summary-item row" style="margin-bottom: 0">
          <div class="col-12">Total:</div>
          <div class="total-price col-12">{{ totalPrice }} MZN</div>
        </div>

        <q-btn
          style="
            height: 70px;
            padding: 9px;
            border-radius: 1rem;
            text-transform: none;
          "
          @click="checkout"
          dense
          class="bg-green-6 text-white glowing-shadow-cancel"
          label="Finalizar compra"
        />
      </q-toolbar>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartItems: [
        {
          id: 1,
          name: "Produto 1",
          price: 100,
          quantity: 1,
          image: "https://via.placeholder.com/150",
        },
        {
          id: 2,
          name: "Produto 2",
          price: 200,
          quantity: 1,
          image: "https://via.placeholder.com/150",
        },
        {
          id: 3,
          name: "Produto 3",
          price: 300,
          quantity: 1,
          image: "https://via.placeholder.com/150",
        },
        {
          id: 4,
          name: "Produto 1",
          price: 100,
          quantity: 1,
          image: "https://via.placeholder.com/150",
        },
        {
          id: 5,
          name: "Produto 2",
          price: 200,
          quantity: 1,
          image: "https://via.placeholder.com/150",
        },
        {
          id: 6,
          name: "Produto 3",
          price: 300,
          quantity: 1,
          image: "https://via.placeholder.com/150",
        },
        {
          id: 7,
          name: "Produto 1",
          price: 100,
          quantity: 1,
          image: "https://via.placeholder.com/150",
        },
        {
          id: 8,
          name: "Produto 2",
          price: 200,
          quantity: 1,
          image: "https://via.placeholder.com/150",
        },
        {
          id: 9,
          name: "Produto 3",
          price: 300,
          quantity: 1,
          image: "https://via.placeholder.com/150",
        },
        {
          id: 10,
          name: "Produto 1",
          price: 100,
          quantity: 1,
          image: "https://via.placeholder.com/150",
        },
        {
          id: 11,
          name: "Produto 2",
          price: 200,
          quantity: 1,
          image: "https://via.placeholder.com/150",
        },
        {
          id: 12,
          name: "Produto 3",
          price: 300,
          quantity: 1,
          image: "https://via.placeholder.com/150",
        },
        {
          id: 13,
          name: "Produto 1",
          price: 100,
          quantity: 1,
          image: "https://via.placeholder.com/150",
        },
        {
          id: 14,
          name: "Produto 2",
          price: 200,
          quantity: 1,
          image: "https://via.placeholder.com/150",
        },
        {
          id: 15,
          name: "Produto 3",
          price: 300,
          quantity: 1,
          image: "https://via.placeholder.com/150",
        },
      ],
    };
  },
  computed: {
    totalPrice() {
      return this.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    removeItem(id) {
      this.cartItems = this.cartItems.filter((item) => item.id !== id);
    },
    increaseQuantity(id) {
      const item = this.cartItems.find((item) => item.id === id);
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity(id) {
      const item = this.cartItems.find((item) => item.id === id);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    checkout() {
      // Lógica de checkout
    },
  },
};
</script>

<style>
.cart-page {
  background-color: #f9f9f9;
}

.cart-list {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cart-item-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
}

.summary {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  margin-bottom: 16px;
}

.total-price {
  font-weight: bold;
}

.full-width {
  width: 100%;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
