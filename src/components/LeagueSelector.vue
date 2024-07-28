<template>
  <div class="flex justify-center flex-wrap space-x-4">
    <div
        v-for="league in leagues"
        :key="league"
        @click="selectLeague(league)"
        :class="[
        'relative flex items-center justify-center border rounded-[10px] border-solid text-white text-[12px] leading-[20px] text-center cursor-pointer transition-all duration-300',
        selectedLeague === league ? 'border-[#00aded] mb-[10px] scale-105' : 'border-white m-[5px]'
      ]"
        style="width: 80px; height: 80px;"
    >
      <div class="p-[4px] w-full h-full flex items-center justify-center">
        <component :is="getLeagueIcon(league)" class="w-full h-full object-contain" />
      </div>
      <span class="absolute inset-0 flex items-center justify-center text-white text-[12px] leading-[20px] opacity-0 hover:opacity-100">
        {{ league }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import IconSuperLig from '@/components/icons/IconSuperLig.vue';
import IconEuro2024 from '@/components/icons/IconEuro2024.vue';
import IconPremierLeague from "@/components/icons/IconPremierLeague.vue";
import IconLaLiga from "@/components/icons/IconLaLiga.vue";
import IconBundesliga from "@/components/icons/IconBundesliga.vue";
import IconSerieA from "@/components/icons/IconSerieA.vue";

export default defineComponent({
  components: {
    IconSuperLig,
    IconEuro2024,
    IconPremierLeague,
    IconLaLiga,
    IconBundesliga,
    IconSerieA,
  },
  setup() {
    const store = useStore();

    const leagues = ref<string[]>([
      'Super Lig',
      'Euro 2024',
      'Premier League',
      'La Liga',
      'Bundesliga',
      'Serie A'
    ]);

    const selectedLeague = ref<string | null>(store.state.selectedLeague || 'Super Lig');

    const selectLeague = (league: string) => {
      selectedLeague.value = league;
      store.dispatch('selectLeague', league);
      console.log(`Selected league: ${league}`);
    };

    onMounted(() => {
      if (!store.state.selectedLeague) {
        selectLeague('Super Lig');
      }
    });

    const getLeagueIcon = (league: string) => {
      switch (league) {
        case 'Super Lig':
          return 'IconSuperLig';
        case 'Euro 2024':
          return 'IconEuro2024';
        case 'Premier League':
          return 'IconPremierLeague';
        case 'La Liga':
          return 'IconLaLiga';
        case 'Bundesliga':
          return 'IconBundesliga';
        case 'Serie A':
          return 'IconSerieA';
        default:
          return null;
      }
    };

    return { leagues, selectLeague, getLeagueIcon, selectedLeague };
  },
});
</script>
