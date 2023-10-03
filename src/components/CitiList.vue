<template>
  <div v-for="city in savedCities" :key="city.id">
    <CityCard :city="city" @click="gotToCityView(city)"/>
  </div>
  <p class="text-slate-700 dark:text-white" v-if="savedCities.length === 0">
    Sin ubicación añadida. Para comenzar a rastrear una ubicación, busque en el campo de arriba.
  </p>
  </template>
  
  <script setup>
  import axios from "axios";
  import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
  import CityCard from './CityCard.vue';
  
  const savedCities = ref([]);
  const router = useRouter()
  
  const getCities = async () => {
    try {
      if (localStorage.getItem("savedCities")) {
        savedCities.value = JSON.parse(localStorage.getItem("savedCities"));
  
        const requests = savedCities.value.map((city) => {
          return axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lng}&appid=87e5493c1443617abe503f14a27718d7&units=metric&lang=es`
          );
        });
  
        const weatherData = await Promise.all(requests);
  
        weatherData.forEach((value, index) => {
          savedCities.value[index].weather = value.data;
        });
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };
  
  
await getCities();

const gotToCityView = (city) => {
  router.push({
    name:'cityView',
    params:{
      state: city.state, city: city.city
    },
    query: { id:city.id, lat:city.coords.lat, lng:city.coords.lng }
  })
}
</script>
  