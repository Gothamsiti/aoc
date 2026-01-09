export const state = () => ({
    currentLanguage : null,
    availableLanguages : null,
    defaultLanguage: null,
});
export const mutations = {
    setCurrentLanguage(state, data){
        state.currentLanguage = data;
    },
    setAvailableLanguages(state, data){
        state.availableLanguages = data;
    },
    setDefaultLanguage(state,val){
        state.defaultLanguage = val;
    }
}
