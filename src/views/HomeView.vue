<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-[#00193f]">
    <h1 class="text-4xl font-bold mb-8 text-white">Football Player Quiz?</h1>
    <div class="mb-8">
      <ModeSelector />
    </div>
    <LeagueSelector />
    <button :disabled="loading" @click="startGame" class="btn mt-8 flex items-center justify-center">
      <span v-if="loading" class="animate-spin mr-2">
       <svg aria-hidden="true" class="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
      </span>
      <span v-if="!loading">Start the Game</span>
      <span v-else>Loading...</span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import ModeSelector from '../components/ModeSelector.vue';
import LeagueSelector from '../components/LeagueSelector.vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default defineComponent({
  name: 'HomeView',
  components: {
    ModeSelector,
    LeagueSelector,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const loading = ref(false);

    const startGame = async () => {
      loading.value = true;
      const league = store.getters.selectedLeague;
      const mode = store.getters.mode;

      // Lig takımlarını getiren API isteği
      const leagueIdMap: { [key: string]: string } = {
        'Super Lig': 'TR1',
        'Euro 2024': 'EM24',
        'Premier League': 'GB1',
        'La Liga': 'ES1',
        'Bundesliga': 'L1',
        'Serie A': 'IT1',
      };
      const leagueId = leagueIdMap[league];
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const apiUrl = `https://transfermarkt-api.fly.dev/competitions/${leagueId}/clubs?season_id=2024`;
      const url = proxyUrl + apiUrl;

      try {
        const response = await axios.get(url);
        const clubs = response.data.clubs;
        const randomClub = clubs[Math.floor(Math.random() * clubs.length)];

        const playersUrl = proxyUrl + `https://transfermarkt-api.fly.dev/clubs/${randomClub.id}/players?season_id=2024`;
        const playersResponse = await axios.get(playersUrl);
        const players = playersResponse.data.players;
        const randomPlayer = players[Math.floor(Math.random() * players.length)];

        await store.dispatch('setPlayer', randomPlayer);

        const transfersUrl = proxyUrl + `https://transfermarkt-api.fly.dev/players/${randomPlayer.id}/transfers`;
        const transfersResponse = await axios.get(transfersUrl);
        const transfers = transfersResponse.data.transfers.filter((transfer: { date: string | number | Date; }) => new Date(transfer.date).getFullYear() > 2011);
        await store.dispatch('setPlayerTransfers', transfers);

        const profileUrl = proxyUrl + `https://transfermarkt-api.fly.dev/players/${randomPlayer.id}/profile`;
        const profileResponse = await axios.get(profileUrl);
        await store.dispatch('setPlayerProfile', profileResponse.data);

        console.log(`Starting game with league: ${league}, mode: ${mode}, team: ${randomClub.name}, player: ${randomPlayer.name}`);
        console.log(`Meraklı arkadasım oyunu kurallarına gore oyna :)`);

        await router.push('/game');
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        loading.value = false;
      }
    };

    return { startGame, loading };
  },
});
</script>

<style scoped>
.btn {
  @apply bg-blue-500 text-white py-2 px-4 rounded;
}
.btn:disabled {
  @apply bg-gray-500 cursor-not-allowed;
}
</style>
