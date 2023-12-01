<template>
    <div class="container mx-auto">
        <header class="bg-gray-800 py-10">
            <div class="flex justify-center items-center flex-col">
                <h1 class="text-4xl font-bold text-white">Sports News Aggregator</h1>
                <div class="max-w-[400px] w-full mt-7">
                    <input type="text" :placeholder="route.params.id ? 'Search Player' : 'Search Team...'"
                        class="w-full px-5 py-2 rounded-md outline-none" @keyup="handleSearch">
                </div>
            </div>
        </header>
        <router-view />
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { searchStore } from '../../stores/search' // Imported pinia search key store 

const searchStorage = searchStore() // Define the search store from pinia
const route = useRoute()

// If user type/write anything in the search input this function will be called.
const handleSearch = (event) => {
    // Checking that the user is typing from which page. whether homepage or players page.
    if (route.params.id) {
        searchStorage.setSearchValue(event.target.value, 'player')  //set the search key and search key type in pinia store. so that can be used for other page/component.
    } else {
        searchStorage.setSearchValue(event.target.value, 'team') //set the search key and search key type in pinia store. so that can be used for other page/component.
    }
}


</script>