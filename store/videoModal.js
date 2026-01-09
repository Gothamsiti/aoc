export const state = () => ({
    asset: null,
    modalVideoOpen: null,
});
export const mutations = {
    setAsset(state,val){
        state.asset = val;
    },
    setModalVideoOpen(state, val){
        state.modalVideoOpen = val;
    }
}