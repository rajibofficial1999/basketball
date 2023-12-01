import { defineStore } from "pinia";

export const searchStore = defineStore("search", {
  state: () => ({
    searchKey: null,
    searchField: "team", //Set default team. because by defalut the page will be homepage and there search input will work for team only. that can change for anohter page like players
  }),

  getters: {
    key: (state) => state.searchKey,
    field: (state) => state.searchField,
  },

  actions: {
    setSearchValue(key, field = "team") {
      this.searchKey = key;
      this.searchField = field; //set input type
    },
  },
});
