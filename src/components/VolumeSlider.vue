-<template>
    <div class="sliderContainer">
        
        <label for="volSlider" id="VolSlider" class="sliderLabel">Volume</label>
        <input id="volSlider" type="range" min="0" max= {sliderMaxValue} v-model="sliderValue" class="slider" v-on:input="adjustVolume">
        
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
#VolSlider {
    padding: 10px;
    margin: 5px;
}

.sliderContainer {
    width: 100%;
}

.sliderLabel {
    text-align: center;
}

.slider:hover {
    opacity: 1;
}

.slider {
    -webkit-appearance: none;
  width: 50%;                      
  height: 15px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
}

.slider::-moz-range-thumb {
  width: 15px;
  height: 25px;
  border-radius: 5px;
  background: rgb(105, 175, 175);
  border-color: rgb(105, 175, 175);
  cursor: pointer;
}
</style>