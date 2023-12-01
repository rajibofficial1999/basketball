<template>
    <div>
        <div class="flex justify-start items-center gap-4 bg-white mt-5 p-5">
            <div class="w-full max-w-[100px]">
                <img :src="team?.logo" :alt="team?.name" class="w-full h-full">
            </div>
            <div class="flex flex-col gap-2">
                <h1 class="font-semibold text-2xl">{{ team?.name }}</h1>
                <div class="flex gap-1 items-center">
                    <FaIcon :icon="['fas', 'location-dot']" />
                    <p class="text-sm">{{ team?.city }}</p>
                </div>
            </div>
        </div>

        <div class="bg-white mt-5 p-5">
            <h2 class="font-bold text-sm">Leagues</h2>
            <div class="grid grid-cols-4 gap-7 mt-2">
                <div v-for="league in team?.leagues" :key="league.property">
                    <h1 class="font-bold border-b border-slate-300 pb-1 mb-2 capitalize">{{ league.property }}</h1>
                    <div class="flex justify-between items-center mt-2">
                        <div class="font-semibold">Conference</div>
                        <div class=" italic">{{ league.conference ?? 'N/A' }}</div>
                    </div>
                    <div class="flex justify-between items-center mt-2">
                        <div class="font-semibold">Division:</div>
                        <div class=" italic">{{ league.division ?? 'N/A' }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-5 py-5 mb-20">
            <h2 class="font-bold text-2xl">Players</h2>
            <div class="grid grid-cols-4 gap-7 mt-2">

                <div class="max-w-xs h-[450px] overflow-hidden" v-for="player in players" :key="player.id">
                    <div class="bg-white h-full shadow-xl rounded-lg py-3">
                        <div class="p-2">
                            <h3 class="text-center text-xl text-gray-900 font-bold leading-8">{{ player?.firstname + ' ' +
                                player?.lastname }}</h3>
                            <div class="w-24 h-24 rounded-full m-auto mt-3">
                                <img :src="playerImage" alt="" class="rounded-full w-full">
                            </div>
                            <table class="text-xs my-3">
                                <tbody>
                                    <tr>
                                        <td class="px-2 py-2 text-gray-900 font-bold">Country</td>
                                        <td class="px-2 py-2">{{ player?.birth?.country ?? 'N/A' }}</td>
                                    </tr>
                                    <tr>
                                        <td class="px-2 py-2 text-gray-900 font-bold">Birthday</td>
                                        <td class="px-2 py-2">{{ player?.birth?.date ?? 'N/A' }}</td>
                                    </tr>
                                    <tr>
                                        <td class="px-2 py-2 text-gray-900 font-bold">Height</td>
                                        <td class="px-2 py-2">{{ player?.height?.meters ? player?.height?.meters + ' M' :
                                            'N/A' }}</td>
                                    </tr>
                                    <tr>
                                        <td class="px-2 py-2 text-gray-900 font-bold">Weight</td>
                                        <td class="px-2 py-2">{{ player?.weight?.pounds ? player?.weight?.pounds + ' pounds'
                                            :
                                            'N/A' }}</td>
                                    </tr>
                                    <tr>
                                        <td class="px-2 py-2 text-gray-900 font-bold">NBA</td>
                                        <td class="px-2 py-2">Start {{ player?.nba?.start }}, Pro {{ player?.nba?.pro }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div class="grid grid-cols-2 gap-8">
                                <div v-for="league in player?.leagues" :key="league.property">
                                    <h1 class="font-bold border-b border-slate-300 pb-1 mb-2 capitalize text-sm">{{
                                        league.property
                                    }}</h1>
                                    <div class="flex justify-between items-center mt-2">
                                        <div class="font-semibold text-sm">Jersey</div>
                                        <div class=" italic text-sm">{{ league.jersey ?? 'N/A' }}</div>
                                    </div>
                                    <div class="flex justify-between items-center mt-2">
                                        <div class="font-semibold text-sm">Pos:</div>
                                        <div class=" italic text-sm">{{ league.pos ?? 'N/A' }}</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>


    </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import http from "../request/http"; //Imported axios instance from "../request/http";
import { searchStore } from '../stores/search' // Imported pinia search key store 
import playerImage from '../assets/images/player.jpg' //Imported default image so that can be used if there will not be any image link for players;

const route = useRoute()
const team = ref(null) // set ref for the team which need to be shown
const players = ref([]) // set ref for all players
const bekupPlayers = ref([]) // set ref for all players for backup so that can be used for search term
const searchStorage = searchStore() // Define the search store from pinia

// Get all playars based on team id
const getTeamPlayer = async (teamId) => {
    try {
        const date = new Date()

        // getting the team data from api using axios request instance
        const { data } = await http.get(`https://v2.nba.api-sports.io/players`, {
            params: {
                team: teamId,
                season: date.getFullYear()
            }
        })

        // maping the Players for filtering their leagues
        let allPlayers = data.response.map(playerData => {
            let filterLeagues = Object.values(playerData.leagues)?.map((item, i) => {
                item.property = Object.keys(playerData.leagues)[i]
                return item;
            })


            playerData.leagues = filterLeagues;

            return playerData;
        })

        players.value = allPlayers // set value for players ref that is already created
        bekupPlayers.value = allPlayers // set value for bekupPlayers ref that is already created

    } catch (error) {
        console.log(error);
    }
}

// When component will be successfully rendered/mounted the onMounted function will be called and getting all players data and also the team data
onMounted(async () => {
    try {

        const { data } = await http.get(`https://v2.nba.api-sports.io/teams`, {
            params: { id: route.params?.id }
        });
        let teamData = data.response[0]

        await getTeamPlayer(teamData?.id)

        let filterLeagues = Object.values(teamData.leagues)?.map((item, i) => {
            item.property = Object.keys(teamData.leagues)[i]
            return item;
        })


        teamData.leagues = filterLeagues;

        team.value = teamData; // set value for team ref that is already created

    } catch (error) {
        console.log(error);
    }
})


// when user will type/write anything in the search input that is created in layouts/DefaultLayout.vue. we already stored the search value in pinia store in layouts/DefaultLayout.vue. Now watch method is checking that the search input value whether change or not. watch method will be called everytime if search input value will be changed
watch(() => searchStorage.key, (value) => {
    // checking the search field whether player or not. bcz we also need the same input form for searching the teams. if its for players then it will be filtered all the players based on user search keyword 
    if (searchStorage.field === 'player') {
        players.value = bekupPlayers.value.filter(({ firstname, lastname }) => {
            if (firstname.toLowerCase().includes(value.toLowerCase())) {
                return firstname.toLowerCase().includes(value.toLowerCase());
            } else {
                return lastname.toLowerCase().includes(value.toLowerCase());
            }
        })
    }
})

</script>
