export default async (context,inject) => {
    var supp = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0;
    context.store.commit('layout/setIsWebpSupported', supp);
}