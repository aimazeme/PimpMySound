<template>
   <div>
       <svg width="200" height="200">
    <polygon :points="points"></polygon>
    <circle cx="100" cy="100" r="90"></circle>
  </svg>

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
svg { display: block; }
polygon { fill: #41B883; }
circle {
  fill: transparent;
  stroke: #35495E;
}
input[type="range"] {
  display: block;
  width: 100%;
  margin-bottom: 15px;
}

</style>