const state={
    filename:''
};
const mutations = {
    SET_FILENAME(state,filename){
        state.filename = filename;
    }
};
const actions = {
    setFileName({commit},filename){
        return commit('SET_FILENAME',filename);
    }
};
const getters = {
    filename(state){
        return state.filename;
    }
};

export default {
    state,
    mutations,
    actions,
    getters,
}