<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-[#00193f]">
    <h1 class="text-4xl font-bold mb-8 text-white">Football Player Quiz?</h1>
    <div class="mb-8">
      <ModeSelector />
    </div>
    <LeagueSelector />
    <button :disabled="loading" @click="startGame" class="btn mt-8 flex items-center justify-center">
      <span v-if="loading" class="animate-spin mr-2">
        <svg class="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v2m0 10v2m8-10h-2m-2 6h-2m-6-6H4m2 6H4m6-6V4m0 2v2m0 10v2m-8-10h2m2 6h2m6-6h2m2-6h2m-2 6h2m2 0a9 9 0 11-9-9v0a9 9 0 0112 9z" />
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

        // Seçilen takımın oyuncularını getiren API isteği
        const playersUrl = proxyUrl + `https://transfermarkt-api.fly.dev/clubs/${randomClub.id}/players?season_id=2024`;
        const playersResponse = await axios.get(playersUrl);
        const players = playersResponse.data.players;
        const randomPlayer = players[Math.floor(Math.random() * players.length)];

        // Oyuncu bilgilerini store'a kaydet
        await store.dispatch('setPlayer', randomPlayer);

        // Oyuncunun kariyer bilgilerini getiren API isteği
        const transfersUrl = proxyUrl + `https://transfermarkt-api.fly.dev/players/${randomPlayer.id}/transfers`;
        const transfersResponse = await axios.get(transfersUrl);
        const transfers = transfersResponse.data.transfers.filter((transfer: { date: string | number | Date; }) => new Date(transfer.date).getFullYear() > 2011);
        await store.dispatch('setPlayerTransfers', transfers);

        // Oyuncunun detaylı profilini getiren API isteği
        const profileUrl = proxyUrl + `https://transfermarkt-api.fly.dev/players/${randomPlayer.id}/profile`;
        const profileResponse = await axios.get(profileUrl);
        await store.dispatch('setPlayerProfile', profileResponse.data);

        console.log(`Starting game with league: ${league}, mode: ${mode}, team: ${randomClub.name}, player: ${randomPlayer.name}`);

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
