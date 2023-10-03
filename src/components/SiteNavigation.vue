<template>
    <header class="sticky top-0 bg-white dark:bg-weather-primary shadow-lg z-10">
        <nav class="container flex flex-col sm:flex-row items-center gap-4 text-slate-800 dark:text-white py-6">
            <RouterLink :to="{ name: 'home' }">
                <div class="flex items-center gap-3 ">
                    
                    <p class="text-2xl">Weather app</p>
                </div>
            </RouterLink>
            <div class="flex gap-3 flex-1 justify-end items-center">
                <i @click="toggleModal" class="fa-solid fa-circle-info text-xl hover:text-weather-secondary cursor-pointer"></i>
                <i @click="addCity" v-if="route.query.preview" class="fa-solid fa-plus text-xl hover:text-weather-secondary cursor-pointer"></i>
                
                <i v-if="isDark" @click="toggleDark()" class="fa-solid fa-sun text-2xl hover:text-weather-secondary cursor-pointer"></i>
                <i v-else @click="toggleDark()" class="fa-solid fa-moon text-2xl hover:text-weather-secondary cursor-pointer"></i>

            </div>
            <BaseModal :modalActive="modalActive" @close-modal="toggleModal">
                <div class="text-black">
                    <h1 class="text-2xl mb-1">Acerca de:</h1>
                    <p class="mb-4">
                    La Aplicación del Tiempo Local te permite seguir el clima actual y futuro de las ciudades que elijas.
                    </p>
                    <h2 class="text-2xl">Cómo funciona:</h2>
                    <ol class="list-decimal list-inside mb-4">
                    <li>
                        Busca tu ciudad escribiendo su nombre en la barra de búsqueda.
                    </li>
                    <li>
                        Selecciona una ciudad de los resultados, esto te llevará al clima actual de tu elección.
                    </li>
                    <li>
                        Haz un seguimiento de la ciudad haciendo clic en el icono "+" en la esquina superior derecha. Esto guardará la ciudad para verla más tarde en la página de inicio.
                    </li>
                    </ol>

                    <h2 class="text-2xl">Eliminar una ciudad</h2>
                    <p>
                    Si ya no deseas hacer un seguimiento de una ciudad, simplemente selecciona la ciudad en la página de inicio. En la parte inferior de la página, habrá una opción para eliminar la ciudad.
                    </p>
                </div>
            </BaseModal>
        </nav>
    </header>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import BaseModal from './BaseModal.vue';
import { uid } from 'uid'
import { useDark, useToggle } from '@vueuse/core';
import Swal from 'sweetalert2'


const modalActive = ref(null)
const savedCities = ref([])
const route = useRoute()
const router = useRouter()

const isDark = useDark()
const toggleDark = useToggle(isDark)

const toggleModal = () =>{
    modalActive.value = !modalActive.value
}

const addCity = () => {
    if(localStorage.getItem('savedCities')){
        savedCities.value = JSON.parse(
            localStorage.getItem('savedCities')
        )
    }
    const localObj = {
        id: uid(),
        state: route.params.state,
        city: route.params.city,
        coords:{
            lat: route.query.lat,
            lng : route.query.lng
        }
    }

    savedCities.value.push(localObj)
    localStorage.setItem('savedCities',JSON.stringify(savedCities.value))
    let query = Object.assign({}, route.query)
    delete query.preview
    query.id = localObj.id

    router.replace({query})
    Swal.fire({
        icon: 'success',
        title: '¡La ciudad ahora está en tu lista!',
        showConfirmButton: false,
        timer: 1650
    })

}




</script>