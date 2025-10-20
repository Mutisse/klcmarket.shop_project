<template>
  <div class="container mt-4 bg-white">
 <!-- Mapa responsivo -->
    <div class="map-container">
      <div
        :id="mapId"
        :style="{ height: mapHeight, width: '100%' }"
        class="border rounded shadow-sm"
        aria-label="Mapa da localização da UEM"
      ></div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, onBeforeMount, ref } from "vue";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default defineComponent({
  name: "LMap",
  props: {
    markers: {
      type: Array,
      required: false,
      default: () => [],
    },
    mapHeight: {
      type: String,
      default: "400px", // Altura padrão caso não seja fornecida uma prop
    },
  },
  data() {
    return {
      mapId: "mapContainer", // ID do elemento do mapa
    };
  },
  setup(props, { emit }) {
    let map = null;
    let markerLayer = null;
    let userLocationMarker = null;

    onMounted(() => {
      createMapLayer();
      getUserLocation();
    });

    onBeforeMount(() => {
      if (map) {
        map.remove();
      }
    });

    const createMapLayer = () => {
      // Criando o mapa
      map = L.map("mapContainer").setView([-25.948409, 32.601288], 20);

      // Adicionando a camada do mapa base
      L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Criando um layer group para armazenar os marcadores
      markerLayer = L.layerGroup().addTo(map);

      // Criando um marcador no local desejado
      const marker = L.marker([-25.948409, 32.601288])
        .addTo(markerLayer)
        .bindPopup("Local de exemplo"); // Substitua pelo `marker.description` se for dinâmico

      // Se houver marcadores adicionais na propriedade `props.markers`, adicioná-los ao mapa
      if (props.markers.length) {
        setMarkers();
      }
    };

    const setMarkers = () => {
      props.markers.forEach((marker) => {
        L.marker(["-25.9476803", "32.5969498"])
          .addTo(markerLayer)
          .bindPopup(marker.description);
      });
    };

    const addMarker = (latitude, longitude, description) => {
      const newMarker = L.marker([latitude, longitude])
        .addTo(markerLayer)
        .bindPopup(description);

      const newMarkers = [
        ...props.markers,
        {
          latitude: "-25.9476803",
          longitude: "32.5969498",
          description: description,
        },
      ];

      emit("update:markers", newMarkers);

      return newMarker;
    };

    const removeMarker = (index) => {
      if (index >= 0 && index < props.markers.length) {
        markerLayer.removeLayer(props.markers[index]);
        const newMarkers = [...props.markers];
        newMarkers.splice(index, 1);
        emit("update:markers", newMarkers);
      }
    };

    const getUserLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          userLocationMarker = L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup("Sua localização atual")
            .openPopup();
          map.setView([latitude, longitude], 15);
        });
      } else {
        console.log("Geolocalização não é suportada pelo seu navegador.");
      }
    };

    return {
      addMarker,
      removeMarker,
    };
  },
});
</script>

<style scoped>
#mapContainer {
  /* width: 100vw; */
  height: calc(100vh - 50px);
}
.map-container {
  /* Impede rolagem e overflow no mapa */
  overflow: hidden;
  /* Adiciona um leve sombreamento ao redor do mapa */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  /* Faz o mapa se ajustar bem em dispositivos móveis */
  border-radius: 8px;
}

/* Adicionando um estilo mais limpo e organizado para o endereço */
.text-muted p {
  line-height: 1.6;
  margin-bottom: 8px; /* Espaço entre as linhas */
  color: #6c757d; /* Cor de texto mais suave */
}

/* Melhorando o tamanho do mapa em dispositivos menores */
#mapContainer {
  height: 400px; /* Altura padrão do mapa */
}

/* Ajuste de responsividade */
@media (max-width: 768px) {
  #mapContainer {
    height: 300px; /* Mapa menor em telas pequenas */
  }
}
</style>
