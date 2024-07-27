<template>
  <div class="flex justify-center space-x-4">
    <button
        @click="selectMode('easy')"
        :class="['flex items-center justify-center border rounded-full text-center uppercase font-bold text-sm py-2 px-6', mode === 'easy' ? 'border-[#4cda64] text-[#4cda64] bg-transparent' : 'border-white text-white']"
    >
      EASY
    </button>
    <button
        @click="selectMode('hard')"
        :class="['flex items-center justify-center border rounded-full text-center uppercase font-bold text-sm py-2 px-6', mode === 'hard' ? 'border-[#ff2038] text-[#ff2038] bg-transparent' : 'border-white text-white']"
    >
      HARD
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const mode = ref<string>('easy');

    const selectMode = (selectedMode: string) => {
      mode.value = selectedMode;
      console.log(`Selected mode: ${selectedMode}`);
    };

    return { mode, selectMode };
  },
});
</script>
