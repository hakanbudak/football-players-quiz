<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-[#00193f]">
    <h1 class="text-4xl font-bold mb-8 text-white">Football Player Quiz?</h1>
    <div class="mb-8">
      <ModeSelector />
    </div>
    <LeagueSelector />
    <button @click="startGame" class="btn mt-8">Start the Game</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
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

    const startGame = async () => {
      const league = store.getters.selectedLeague;
      const mode = store.getters.mode;

      // Lig takımlarını getiren API isteği
      const leagueIdMap = {
        'Süper Lig': 'TR1',
        'Euro 2024': 'EURO',
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
        const playersApiUrl = `https://transfermarkt-api.fly.dev/clubs/${randomClub.id}/players?season_id=2024`;
        const playersUrl = proxyUrl + playersApiUrl;
        const playersResponse = await axios.get(playersUrl);
        const players = playersResponse.data.players;
        const randomPlayer = players[Math.floor(Math.random() * players.length)];

        // Oyuncu bilgilerini store'a kaydet
        await store.dispatch('setPlayer', randomPlayer);

        console.log(`Starting game with league: ${league}, mode: ${mode}, team: ${randomClub.name}, player: ${randomPlayer.name}`);

        await router.push('/game');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    return { startGame };

  },
});
</script>

<style scoped>
.btn {
  @apply bg-blue-500 text-white py-2 px-4 rounded;
}
</style>
