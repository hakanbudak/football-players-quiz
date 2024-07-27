<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-[#00193f] text-white p-4">
    <h1 class="text-4xl font-bold mb-8">Football Player Quiz</h1>
    <div class="flex flex-row mb-8">
      <div class="flex flex-col items-center mr-8">
        <!-- Player Info Section -->
        <div class="bg-white text-black p-4 rounded-lg shadow-lg">
          <div class="flex items-center mb-4">
            <img :src="player.imageURL" alt="Player Image" class="w-24 h-24 rounded-full mr-4 blur-md">
            <div>
              <h2 v-if="showPlayerName" class="text-2xl font-bold">{{ player.name }}</h2>
              <h2 v-else class="text-2xl font-bold">?</h2>
              <p>{{ player.nationality[0] }}</p>
              <p>{{ player.club }}</p>
              <p>{{ player.value }}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Doğum Tarihi:</strong> {{ hintsShown >= 2 ? player.dateOfBirth : '?' }}</p>

              <p><strong>Boy:</strong> {{ hintsShown >= 3 ? player.height : '?' }}</p>
              <p><strong>Pozisyon:</strong> {{ player.position }}</p>

            </div>
            <div>
              <p><strong>Doğum Yeri:</strong> {{ hintsShown >= 1 ? player.nationality[0] : '?' }}</p>

              <p><strong>Ayak:</strong> {{ player.foot }}</p>
              <p><strong>Değeri:</strong> {{ hintsShown >= 4 ? player.marketValue : '?' }}</p>

            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 class="text-xl font-bold mb-4 text-center">Kariyer</h3>
        <table class="min-w-full divide-y divide-gray-200 bg-white text-black rounded-lg shadow-lg">
          <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sezon</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kulüp</th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="team in player.career" :key="team.season">
            <td class="px-6 py-4 whitespace-nowrap">{{ team.season }}</td>
            <td class="px-6 py-4 whitespace-nowrap flex items-center">
              <img :src="team.logo" alt="Team Logo" class="w-6 h-6 mr-2">
              {{ team.club }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="flex flex-col items-center">
      <p class="mb-4">Futbolcunun en hatırlanır özelliği veya olayları yada golü</p>
      <div class="flex space-x-4 mb-4">
        <button @click="giveHint" class="btn bg-green-500">İpucu</button>
        <button @click="guessPlayer" class="btn bg-blue-500">Tahmin Et</button>
      </div>
      <button @click="retry" class="btn bg-red-500">Tekrar dene</button>
    </div>
    <div v-if="showGuessInput" class="mt-4">
      <input v-model="playerGuess" type="text" placeholder="Futbolcu adını girin" class="text-black p-2 rounded" />
      <button @click="submitGuess" class="btn bg-yellow-500 mt-2">Tahmini Gönder</button>
    </div>
    <p class="mt-4">Score: {{ score }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'GameView',
  setup() {
    const player = ref<any>({
      name: '',
      description: '',
      imageURL: '',
      story: '',
      league: '',
      dateOfBirth: '',
      height: '',
      position: '',
      nationality: [],
      foot: '',
      marketValue: '',
      career: []
    });
    const playerGuess = ref<string>('');
    const score = ref<number>(0);
    const showGuessInput = ref<boolean>(false);
    const showPlayerName = ref<boolean>(false);
    const hintsShown = ref<number>(0);
    const store = useStore();
    const selectedLeague = ref<string>(store.getters.selectedLeague);
    const fetchedPlayer = store.getters.player;

    onMounted(() => {
      if (fetchedPlayer) {
        player.value = fetchedPlayer;
      }
    });

    const giveHint = () => {
      if (hintsShown.value < 4) {
        hintsShown.value++;
      }
    };

    const guessPlayer = () => {
      showGuessInput.value = true;
    };

    const submitGuess = () => {
      if (playerGuess.value.toLowerCase() === player.value.name.toLowerCase()) {
        alert('Doğru tahmin!');
        score.value += 100;
        showPlayerName.value = true;
      } else {
        alert('Yanlış tahmin, tekrar deneyin.');
      }
      showGuessInput.value = false;
      playerGuess.value = '';
    };

    const retry = () => {
      hintsShown.value = 0;
      showPlayerName.value = false;
      // Yeni oyuncu seçimi
      const newPlayer = store.getters.player;
      player.value = newPlayer;
    };

    return { player, playerGuess, score, showGuessInput, showPlayerName, hintsShown, giveHint, guessPlayer, submitGuess, retry, selectedLeague };
  },
});
</script>

<style scoped>
.btn {
  @apply text-white py-2 px-4 rounded;
}
</style>
