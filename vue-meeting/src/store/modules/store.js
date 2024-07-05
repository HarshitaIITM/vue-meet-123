
const state = {
    allParticipant: []
  };
  
  const mutations = {
    updateValue(state, newValue) {
      state.allParticipant = newValue;
    }
  };
  
  export default {
    namespaced: true,
    state,
    mutations
  };
  