<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input @input="getSearchResult" v-model="searchQuery" type="text" placeholder="Busca por una ciudad" class="mt-3 py-2 px-1 w-full bg-transparent text-slate-900 dark:text-white border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0#004E71]">
      <ul v-if="queryResults" class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]">
        <p v-if="searchError" >Lamentablemente, algo salió mal. Por favor, reintenta en unos minutos.</p>
        <p v-if="!searchError && queryResults.length === 0">
          Sin resultados para la consulta de ciudades. Intenta con otro nombre.
        </p>
        <template v-else>
          <li @click="previewCity(queryResult)" v-for="queryResult in queryResults" :key="queryResult.id" class="py-2 cursor-pointer">
            {{ queryResult.place_name }}
          </li>
        </template>
        
      </ul>
    </div>

    <section class="flex flex-col gap-4">
      <Suspense>
        <CitiList/>
        <template #fallback>
          <CityCardSkeleton/>
        </template>
      </Suspense>
    </section>
  </main>
</template>
<script setup>
import { ref } from "vue"
import axios from "axios"
import { useRouter } from "vue-router"
import CitiList from "../components/CitiList.vue";
import CityCardSkeleton from "../components/CityCardSkeleton.vue";



const mapboxAPIKey = "pk.eyJ1IjoiZW0xbGlvIiwiYSI6ImNsbWxjMzUyaTA4a2oya3BxdTNhZWh5bjgifQ.pk3s_dFWosExeQmso_L5LA"
const searchQuery = ref("")
const queryTimeout = ref(null)
const queryResults = ref(null)
const searchError = ref(null)
const router = useRouter()

const getSearchResult = () => {
  clearTimeout(queryTimeout.value)
  queryTimeout.value = setTimeout( async ()=>{
    if ( searchQuery.value !== ""){
      try {
        const result = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?access_token=${mapboxAPIKey}&types=place&language=es`)
        queryResults.value = result.data.features
        return
      } catch {
        searchError.value = true
      }
    }
    queryResults.value = null
  }, 300)
}

const previewCity = (queryResult) => {
  const [city,state] = queryResult.place_name.split(",")
  router.push({
    name:"cityView",
    params: {state:state,city:city},
    query: {
      lat: queryResult.geometry.coordinates[1],
      lng: queryResult.geometry.coordinates[0],
      preview:true
    }
  })
}

</script>
