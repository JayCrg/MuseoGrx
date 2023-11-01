import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const wait = (time = 1000) =>
  new Promise((resolve) => setTimeout(resolve, time));

export const useCounterStore = defineStore('counter', {
  state: () => ({
    options: {
      a: 0,
      b: 0,
      c: 0,
    },
  }),
  actions: {
    increment(option) {
      this.options[option]++;
    },
    async delayedIncrement(option, time = 1000) {
      await wait();
      this.options[option]++;
    },
  },
  getters: {
    totalClicks() {
      return Object.values(this.options).reduce((total, current) => {
        return total + current;
      }, 0);
    },
  },
});

