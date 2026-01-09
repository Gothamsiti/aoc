export const state = () => ({
    labels : null,
});
export const mutations = {
    setLabels(state, data){
        state.labels = data;
    },
}
