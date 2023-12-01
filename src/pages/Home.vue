<template>
    <div class="px-5 py-10 mt-8">
        <h2 class="font-semibold text-2xl mb-4 bg-white px-2 py-3 rounded-md">Teams</h2>
        <div class="grid grid-cols-5 gap-3">
            <!-- Loop all the teams here -->
            <template v-for="team in teams" :key="team.id">
                <div class="bg-white p-3 relative" v-if="team.name">
                    <router-link :to="{ name: 'teamDetails', params: { id: team.id } }">
                        <div class=" absolute bg-red-500 text-white left-0 top-2 py-1 px-3 rounded-r-md flex gap-2"
                            v-if="team.city">
                            <FaIcon :icon="['fas', 'map-location']" />
                            <h2 class="text-sm font-semibold">{{ team.city }}</h2>
                        </div>
                        <div class="h-32 flex justify-center mt-10">
                            <img :src="team.logo ?? teamDefaultImage" :alt="team.name" class="h-full">
                        </div>
                        <div class="mt-3 text-center">
                            <h2 class="font-bold">{{ team.name }}</h2>
                        </div>
                    </router-link>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import http from "../request/http"; //Imported axios instance from "../request/http";
import teamDefaultImage from '../assets/images/team.jpg' //Imported default image so that can be used if there will not be any image link for teams;
import { searchStore } from '../stores/search' // Imported pinia search key store 

const teams = ref([]); // set ref for all teams
const backupTeams = ref([]); // set ref for all teams for backup so that can be used for search term
const searchStorage = searchStore() // Define the search store from pinia

// When component will be successfully rendered/mounted the onMounted function will be called and getting all team data
onMounted(async () => {
    try {
        const { data } = await http.get('https://v2.nba.api-sports.io/teams'); // getting team data from api using axios request instance
        teams.value = data.response // set value for teams ref that is already created
        backupTeams.value = data.response // set value for backupTeams ref that is already created
    } catch (error) {
        console.log(error);
    }
})

// when user will type/write anything in the search input that is created in layouts/DefaultLayout.vue. we already stored the search value in pinia store in layouts/DefaultLayout.vue. Now watch method is checking that the search input value whether change or not. watch method will be called everytime if search input value will be changed
watch(() => searchStorage.key, (value) => {
    // checking the search field whether team or not. bcz we also need the same input form for searching the players. if its for team then it will be filtered all the teams based on user search keyword 
    if (searchStorage.field === 'team') {
        teams.value = backupTeams.value.filter(({ name }) => name.toLowerCase().includes(value.toLowerCase()))
    }
})

</script>