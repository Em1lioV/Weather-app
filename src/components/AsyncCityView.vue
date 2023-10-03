<template>
    <div class="flex flex-col flex-1 items-center">
        <div v-if="route.query.preview" class="text-slate-900 dark:text-white bg-weather-secondary w-full text-center">
        </div>
        <!-- weather overview -->
        <div class="flex flex-col items-center text-slate-900 dark:text-white py-12">
            <h1 class="text-4xl mb-2">{{ route.params.city }}</h1>
            <p class="text-sm mb-12">
                {{ new Date(weatherData.currentTime).toLocaleDateString("es-ES", {weekday: "short",day: "2-digit",month: "long"}) }}
                {{ new Date(weatherData.currentTime).toLocaleTimeString("es-ES", { timeStyle: "short" }) }}
            </p>
            <p class="text-8xl mb-8">
                {{ Math.round(weatherData.current.temp) }}&deg;
            </p>
            <p>Sensación Térmica: {{ Math.round(weatherData.current.feels_like) }}&deg;</p>
            <p class="capitalize">
                {{ weatherData.current.weather[0].description }}
            </p>
            <img class="drop-shadow-5xl w-[150px] h-auto" :src="`http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@4x.png`">
        </div>

        <hr class="border-white border-opacity-10 border w-full">

        <div class="max-w-screen-md w-full py-12">
            <div class="mx-8 text-slate-800 dark:text-white">
                <h2 class="mb-4">pronóstico por hora</h2>
                <div class="flex gap-10 overflow-x-scroll">
                    <div class="flex flex-col gap-4 items-center" v-for="hourData in weatherData.hourly" :key="hourData.dt">
                        <p class="whitespace-nowrap text-md">
                            {{ new Date(hourData.currentTime).toLocaleTimeString("es",{ hour: "2-digit", minute: "2-digit" }) }}
                        </p>
                        <img class="drop-shadow-xl w-auto h-[50px] object-cover"
                        :src="`http://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`">
                        <p class="text-xl">{{ Math.round(hourData.temp) }}&deg;</p>
                    </div>
                </div>
            </div>
        </div>

        <hr class="border-white border-opacity-10 border w-full">

        <div class="max-w-screen-md w-full py-12">
            <div class="mx-8 text-slate-800 dark:text-white">
                <h2 class="mb-4">pronóstico a 7 días</h2>
                <div class="flex items-center" v-for="day in weatherData.daily" :key="day.dt">
                <p class="flex-1">
                    {{  new Date(day.dt*1000).toLocaleDateString("es",
                            {weekday: "long"}
                        ) 
                    }}
                </p>
                <img class="w-[50px] h-[50px] object-cover drop-shadow-xl" :src="`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`">
                    <div class="flex gap-2 flex-1 justify-end max-w-xs">
                        <p>Max: {{ Math.round(day.temp.max) }}&deg;</p>
                        <p>Min: {{ Math.round(day.temp.min) }}&deg;</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex items-center gap-2 py-12 text-slate-800 dark:text-white cursor-pointer duration-150 hover:text-red-500" @click="removeCity">
            <i class="fa-solid fa-trash"></i>
            <p>Eliminar Ciudad</p>
        </div>

    </div>
</template>

<script setup>
import axios from 'axios';
import Swal from 'sweetalert2'

import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const getWeatherData = async () =>{
    try {
        const weatherData = await axios.get(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${route.query.lat}&lon=${route.query.lng}&exclude={part}&appid=87e5493c1443617abe503f14a27718d7&units=metric&lang=es`
        )
          // cal current date & time
        const localOffset = new Date().getTimezoneOffset() * 60000
        const utc = weatherData.data.current.dt * 1000 + localOffset
        weatherData.data.currentTime = utc + 1000 * weatherData.data.timezone_offset

        // cal hourly weather offset
        weatherData.data.hourly.forEach((hour) => {
        const utc = hour.dt * 1000 + localOffset
        hour.currentTime =
            utc + 1000 * weatherData.data.timezone_offset;
        })

        return weatherData.data
    } catch (err) {
        console.log(err);
    }
}

const weatherData = await getWeatherData();

const removeCity = () => {
    const cities = JSON.parse(localStorage.getItem("savedCities"))
    const updatedCities = cities.filter((city)=> city.id !== route.query.id )
    localStorage.setItem('savedCities',JSON.stringify(updatedCities))

    router.push({
        name: "home"
    })
    Swal.fire({
        icon: 'success',
        title: 'Ciudad eliminada de la lista',
        showConfirmButton: false,
        timer: 1650
    })

}

</script>
