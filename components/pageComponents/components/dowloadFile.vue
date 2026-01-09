<template lang="pug">
    a.file(:href="file.filename" download target="_blank") 
        svg( version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="14px" height="14px" viewBox="0 0 14 14" style="overflow:visible;enable-background:new 0 0 14 14;" xml:space="preserve")
            polygon(points="14,7.2 12.5,5.5 8.1,9.9 8.1,0 5.9,0 5.9,9.9 1.5,5.5 0,7.2 7,14 ")
        span.bigFont {{ file.name }}
</template>
<script>
export default {
    props:['file'],
}
</script>