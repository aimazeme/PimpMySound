<template>
   <div>
       <canvas id="" width='500' height="500"></canvas>
   </div>
</template>

<script>
import {AudioCtx} from '../main.js';

export default {
    data() {
        return {
            stageSize: {
                width: 300,
                height: 300,
                text: 'bla'
            }
        }
    },
    created(){
        this.analyzerNode = AudioCtx.createAnalyser();
        
    },
    mounted() {
      
    }
}

</script>

<style scoped>
#visualCanvas {
    border: 1px solid;
    color: rgb(31, 71, 248);
}

</style>