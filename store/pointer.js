export const state = () => ({
    x: 0,
    y: 0,
})
export const mutations = {
    set(state,pointer){
        state.x = pointer.x;
        state.y = pointer.y;
    }
}