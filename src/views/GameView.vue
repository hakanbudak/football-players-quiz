<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-[#00193f] text-white p-4">
    <h1 class="text-4xl font-bold mb-8 text-center">Football Player Quiz</h1>
    <div v-if="loading" class="flex items-center justify-center mb-8 animate-pulse">
      <svg class="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v2m0 10v2m8-10h-2m-2 6h-2m-6-6H4m2 6H4m6-6V4m0 2v2m0 10v2m-8-10h2m2 6h2m6-6h2m2-6h2m-2 6h2m2 0a9 9 0 11-9-9v0a9 9 0 0112 9z" />
      </svg>
    </div>
    <div v-else class="flex flex-col lg:flex-row mb-8 bg-white text-black p-4 rounded-lg shadow-lg w-full lg:w-auto">
      <!-- Player Info Section -->
      <div class="flex flex-col items-start mb-4 lg:mb-0 lg:mr-8">
        <div class="flex items-center mb-4">
          <img :src="playerProfile.imageURL" alt="Player Image" :class="{'blur-md': !showPlayerName, 'w-32 h-32 rounded-full mr-4': true}">
          <div>
            <h2 v-if="showPlayerName" class="text-3xl font-bold">{{ player.name }}</h2>
            <h2 v-else class="text-3xl font-bold">?</h2>
            <p>{{ player.nationality ? player.nationality.join(', ') : '?' }}</p>
            <p>{{ playerProfile.club ? playerProfile.club.name : '?' }}</p>
            <p>{{ playerProfile.marketValue ? playerProfile.marketValue : '?' }}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4 text-base">
          <div>
            <p><strong>D.Tarihi:</strong> {{ hintsShown >= 2 ? playerProfile.dateOfBirth : '?' }}</p>
            <p><strong>Boy:</strong> {{ hintsShown >= 3 ? playerProfile.height : '?' }}</p>
            <p><strong>Pozisyon:</strong> {{ player.position }}</p>
          </div>
          <div>
            <p><strong>D.Yeri:</strong> {{ hintsShown >= 1 ? (playerProfile.placeOfBirth ? playerProfile.placeOfBirth.city + ', ' + playerProfile.placeOfBirth.country : '?') : '?' }}</p>
            <p><strong>Ayak:</strong> {{ player.foot ? player.foot : '?' }}</p>
            <p><strong>Kontrat Sonu:</strong> {{ hintsShown >= 4 ? (playerProfile.club ? playerProfile.club.contractExpires : '?') : '?' }}</p>
          </div>
        </div>
      </div>
      <!-- Career Section -->
      <div class="flex flex-col items-start max-h-64 overflow-y-auto">
        <h3 class="text-xl font-bold mb-4 text-center">Kariyer</h3>
        <table class="min-w-full divide-y divide-gray-200 text-black rounded-lg shadow-lg">
          <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sezon</th>
            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kulüp</th>
            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transfer Ücreti</th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="transfer in playerTransfers" :key="transfer.id">
            <td class="px-4 py-2 whitespace-nowrap">{{ transfer.season }}</td>
            <td class="px-4 py-2 whitespace-nowrap">{{ transfer.from.clubName }} &rarr; {{ transfer.to.clubName }}</td>
            <td class="px-4 py-2 whitespace-nowrap">{{ transfer.fee }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="flex flex-col items-center">
      <div class="flex space-x-4 mb-4">
        <button @click="giveHint" class="btn bg-green-500">İpucu</button>
        <button @click="guessPlayer" class="btn bg-blue-500">Tahmin Et</button>
        <button v-if="passCount > 0" @click="passPlayer" :disabled="passDisabled" class="btn bg-red-500" :class="{'opacity-50 cursor-not-allowed': passDisabled}">Pass</button>
      </div>
      <button @click="endGame" class="btn bg-gray-500 mt-4">Oyunu Bitir</button>
    </div>
    <div v-if="showGuessInput" class="mt-4 flex flex-col items-center">
      <input v-model="playerGuess" type="text" placeholder="Futbolcu adını girin" class="text-black p-2 rounded mb-2 w-full lg:w-auto" />
      <button @click="submitGuess" class="btn bg-yellow-500">Tahmini Gönder</button>
    </div>
    <p class="mt-4">Score: {{ score }}</p>
    <p v-if="passCount > 0" class="mt-4">Pass Hakkı: {{ passCount }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'GameView',
  setup() {
    const player = ref<any>({});
    const playerProfile = ref<any>({});
    const playerTransfers = ref<any[]>([]);
    const playerGuess = ref<string>('');
    const score = ref<number>(0);
    const showGuessInput = ref<boolean>(false);
    const showPlayerName = ref<boolean>(false);
    const hintsShown = ref<number>(0);
    const loading = ref<boolean>(false);
    const passCount = ref<number>(3);
    const passDisabled = ref<boolean>(false);
    const store = useStore();
    const router = useRouter();
    const proxyUrl = 'https://football-player-quiz-fc475c985c9c.herokuapp.com/';

    onMounted(() => {
      player.value = store.getters.player;
      playerProfile.value = store.getters.playerProfile;
      playerTransfers.value = store.getters.playerTransfers;
    });

    const fetchPlayerData = async () => {
      loading.value = true;
      try {
        const league = store.getters.selectedLeague;
        const leagueIdMap: { [key: string]: string } = {
          'Super Lig': 'TR1',
          'Euro 2024': 'EM24',
          'Premier League': 'GB1',
          'La Liga': 'ES1',
          'Bundesliga': 'L1',
          'Serie A': 'IT1',
        };
        const leagueId = leagueIdMap[league];
        const apiUrl = `https://transfermarkt-api.fly.dev/competitions/${leagueId}/clubs?season_id=2024`;
        const url = proxyUrl + apiUrl;

        const response = await axios.get(url);
        const clubs = response.data.clubs;
        const randomClub = clubs[Math.floor(Math.random() * clubs.length)];

        const playersUrl = proxyUrl + `https://transfermarkt-api.fly.dev/clubs/${randomClub.id}/players?season_id=2024`;
        const playersResponse = await axios.get(playersUrl);
        const players = playersResponse.data.players;
        const randomPlayer = players[Math.floor(Math.random() * players.length)];

        player.value = randomPlayer;

        const transfersUrl = proxyUrl + `https://transfermarkt-api.fly.dev/players/${randomPlayer.id}/transfers`;
        const transfersResponse = await axios.get(transfersUrl);
        const transfers = transfersResponse.data.transfers.filter((transfer: { date: string | number | Date; }) => new Date(transfer.date).getFullYear() > 2011);
        playerTransfers.value = transfers;

        const profileUrl = proxyUrl + `https://transfermarkt-api.fly.dev/players/${randomPlayer.id}/profile`;
        const profileResponse = await axios.get(profileUrl);
        playerProfile.value = profileResponse.data;

        showPlayerName.value = false;
        hintsShown.value = 0;
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        loading.value = false;
      }
    };

    const giveHint = () => {
      if (hintsShown.value < 4) {
        hintsShown.value++;
        score.value -= 20;
      }
    };

    const guessPlayer = () => {
      showGuessInput.value = true;
    };

    const submitGuess = async () => {
      if (playerGuess.value.toLowerCase() === player.value.name.toLowerCase()) {
        alert('Doğru tahmin!');
        score.value += 100;
        showPlayerName.value = true;

        if (score.value % 300 === 0) {
          score.value += 50;
        }

        setTimeout(async () => {
          loading.value = true;
          await fetchPlayerData();
        }, 5000);
      } else {
        alert('Yanlış tahmin, tekrar deneyin.');
        score.value -= 10;
      }
      showGuessInput.value = false;
      playerGuess.value = '';
    };

    const passPlayer = async () => {
      if (passCount.value > 0) {
        passCount.value--;
        passDisabled.value = true;
        setTimeout(() => {
          passDisabled.value = false;
        }, 10000);
        await fetchPlayerData();
      }
    };

    const endGame = () => {
      router.push({ path: '/' });
    };

    return { player, playerProfile, playerTransfers, playerGuess, score, showGuessInput, showPlayerName, hintsShown, giveHint, guessPlayer, submitGuess, loading, passCount, passPlayer, passDisabled, endGame };
  },
});
</script>

<style scoped>
.btn {
  @apply text-white py-2 px-4 rounded;
}
</style>
