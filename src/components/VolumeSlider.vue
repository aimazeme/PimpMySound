<template>
    <div class="sliderContainer">
        
        <input type="range" min="0" max= {sliderMaxValue} v-model="sliderValue" class="slider" v-on:input="adjustVolume">

        <div>
            <label class="sliderLabel">Volume</label>
        </div>

    </div>
</template>

<script>
import {EventBus} from '../main.js';
import {AudioCtx} from '../main.js';

export default {
    name: 'VolumeSlider',
    props: {
      playerNr: Number
    },
    data() {
        
        return {
            sliderMaxValue: 100,
            sliderValue: 0,
            gainNode: GainNode
        }     
    },

    created() {
        this.gainNode = AudioCtx.createGain();
        this.gainNode.connect(AudioCtx.destination);
        EventBus.$on('to-volumeSlider', (data) => {          
            if (data.playerNr === this.playerNr) {
                window.console.log("Connected Source " + data.playerNr + " to: VolumeSlider");
                data.audioNode.connect(this.gainNode);
                this.adjustVolume();                
            }          
        });

        
    },

    methods: {
        adjustVolume() {
            window.console.log("adjusting volume");
            //Calculate new values with sliderValue (gain values are between 0..1)
            const PERCENTAGE = parseInt(this.sliderValue) / parseInt(this.sliderMaxValue);

            //Exponential curve
            this.gainNode.gain.value = PERCENTAGE * PERCENTAGE;
        },
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