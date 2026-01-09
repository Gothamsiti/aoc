export const state = () => ({
    menuItems : null,
    isHP : false,
    menu: false,
    touch : false,
    loaded : false,
    progress : 0,
    changingSituation: false,
    preloaderHasToPlay: 1,
    situations_OLD : [
        {
            a: 0x777777,
            b: 0x888888,
        },
        {
            a: 0xFFD700,
            b: 0xE9690E,
            audio: '/audio/like-we-do-it.mp3',
            title: 'Like we do it'
        },
        {
            a: 0x73C9B1,
            b: 0x359DEA,
            audio: '/audio/liberate.mp3',
            title: 'Liberate'
        },
        {
            a: 0x9867d3,
            b: 0x6498ea,
            audio: '/audio/la-donna-e-mobile.mp3',
            title: 'La donna è mobile'
        },
        {
            a: 0xff0000,
            b: 0x4f1313,
            audio: '/audio/uuuuuaaaaaaaahhhhh.mp3',
            title: 'uuuuuaaaaaaaahhhhh',
            isMetal: true,
            minDecibels: -55, // default -100
            maxDecibels: -20, // default -30,
            smoothingTimeConstant: .7 // default .8
        }
    ],
    situations : null,
    activeSituation : 0,
    preloaderGone : false,
    leavePage : false,
    isPlaying : false,
    isWebpSupported: false,
    preloading: true,
    isMetal: false,
    defaultMinDecibels: -100,
    defaultMaxDecibels: -30,
    defaultSmoothingTimeConstant: .8,
    mute: false,
    isPaused: false,
});
export const mutations = {
    setMenu(state,value){
        state.menu = value;
    },
    setMenuItems(state,value){
        state.menuItems = value;
    },
    setTouch(state,value){
        state.touch = value;
    },
    setLoaded(state,value){
        state.loaded = value;
    },
    setProgress(state,value){
        state.progress = value;
    },
    setActiveSituation(state,value){
        state.activeSituation = value;
    },
    storeSituations(state,value){
        state.situations = value;
    },
    setSituations(state,value){
        state.situations = value;
    },
    setPreloaderGone(state,value){
        state.preloading = false;
        state.preloaderGone = value;
    },
    setHP(state,value){
        state.isHP = value;
    },
    setLeavePage(state,value){
        state.leavePage = value;
    },
    setIsPlaying(state,value){
        state.isPlaying = value;
    },
    setIsWebpSupported(state,val){
        state.isWebpSupported = val;
    },
    goMetal(state,val){
        state.isMetal = val;
    },
    setchangingSituation(state,val){
        state.changingSituation = val;
    },
    setPreloaderHasToPlay(state,val){
        state.preloaderHasToPlay = val;
    },
    setMute(state,val){
        state.mute = val;
    },
    setIsPaused(state,val){
        state.isPaused = val;
    }
}