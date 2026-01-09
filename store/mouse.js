export const state = () => ({
    x: 0,
    y: 0,
    realx : 0,
    realy : 0,
    alreadymoved : 0
})

export const mutations = {
    set(state,mouse){
        state.x = mouse.x;
        state.y = mouse.y;
        state.realx = mouse.realx;
        state.realy = mouse.realy;
        state.alreadymoved ++;
    }
}