<template>
    <div class="sliderContainer">
        <input type="range" min="0" max= "50000" v-model="filterNode.frequency" class="slider">

        <div>
            <label class="sliderLabel">Frequency</label>
        </div>

        <input type="range" min="0" max= "50000" v-model="filterNode.Q" class="slider">

        <div>
            <label class="sliderLabel">Quality</label>
        </div>

        <input type="range" min="0" max= "50000" v-model="filterNode.gain" class="slider">

        <div>
            <label class="sliderLabel">Gain</label>
        </div>
    </div>
</template>

<script>
import {EventBus} from '../main.js';
import {AudioCtx} from '../main.js';

export default {
    name: 'Filter',
    props: {
      filterType: String,
      playerNr: Number,
    },
    data() {
        return {
            filterNode: AudioNode
        }     
    },

    created() {
        this.filterNode = AudioCtx.createBiquadFilter();
        this.filterNode.type = this.filterType;

        EventBus.$on('to-filter', (data) => {  
            if (data.playerNr === this.playerNr) {
                data.audioNode.connect(this.filterNode);
                EventBus.$emit('to-nextComponent', {audioNode: this.filterNode, playerNr: this.playerNr});
            }
        });
    },

    methods: {

    }
}
</script>

<style scoped>
.sliderContainer {
   width: 46%;
   height: 50%;
   float: left;
   margin-left: 2%;
   margin-right: 2%; 
}

.sliderLabel {
    text-align: center;
}

.slider:hover {
    opacity: 1;
}

.slider {
    -webkit-appearance: none;
    margin-top: .5em;
    width: 100%;
    height: 15px;
    border-radius: 5px;  
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%; 
    background: rgb(143, 15, 58);
    cursor: pointer;
}
</style>

