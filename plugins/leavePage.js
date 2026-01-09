export default ({ app }, inject) => {
    inject('leavePage', (to,from,next,page) =>{
      app.store.commit("layout/setMenu",false);
      app.store.commit("layout/setLeavePage",true);
      setTimeout(() => {
        next();
        app.store.commit("scroll/setOnlyTop",0);
      }, 800);
    });
}