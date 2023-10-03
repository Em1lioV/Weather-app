<template>
    <div>
        <Suspense>
            <AsyncCityView class="max-w-[900px] mx-auto"/>

            <template #fallback>
                <CityViewSkeleton class="max-w-[900px] mx-auto"/>
            </template>
        </Suspense>
    </div>
</template>

<script setup>
import AsyncCityView from '../components/AsyncCityView.vue';
import CityViewSkeleton from '../components/CityViewSkeleton.vue';

</script>
