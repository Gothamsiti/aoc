
export const state = () => ({
    top: 0,
    wH : 0,
    wW : 0,
    wheelX : 0,
    wheelY : 0
});
export const mutations = {
    setTop(state,positions){
        state.wH = positions.wH;
        state.wW = positions.wW;
        if(positions.wheelX) state.wheelX = positions.wheelX;
        if(positions.wheelY)  state.wheelY = positions.wheelY;
    },
    resetTop(state,top){
        state.top = top;
    },
    setOnlyTop(state,top){
        state.top = top;
    }
}