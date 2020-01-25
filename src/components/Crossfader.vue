<template>
    <b-card id="card" bg-variant="light" class="text-center"> 
            <div class="sliderContainer">

                <input id="crossfader" type="range" min="0" max= {sliderMaxValue} v-model="sliderValue" class="slider" v-on:input="adjustCrossfading()">

            </div>
    </b-card>
</template>

<script>
import {EventBus} from '../main.js';
import {AudioCtx} from '../main.js';
import {AudioCtx2} from '../main';

export default {
    name: 'Crossfader',
    data() {
        
        return {
            sliderMaxValue: 100,
            sliderValue: 50,
            gainNode1: GainNode,
            gainNode2: GainNode,
            oneIsConnected: false
        }     
    },

    created() {
        this.gainNode1 = AudioCtx.createGain();
        this.gainNode2 = AudioCtx2.createGain();

        EventBus.$on('to-crossFader', (data) => {
            if (data.playerNr === 1) {
                data.audioNode.connect(this.gainNode1); 
                this.adjustCrossfading();
                window.console.log("Connected Source 1 to Crossfader");
                EventBus.$emit('to-volumeSlider', {audioNode: this.gainNode1, playerNr: 1})
                
            }          
            else {
                data.audioNode.connect(this.gainNode2);  
                this.adjustCrossfading();
                window.console.log("Connected Source 2 to crossfader");
                EventBus.$emit('to-volumeSlider', {audioNode: this.gainNode2, playerNr: 2})                
            }                       
        });
        
        EventBus.$on('midi-crossfader', (data) => {
            window.console.log('midi')
            window.console.log(data)
            this.sliderValue =  data.btnValue / 127 * this.sliderMaxValue
            this.adjustCrossfading()
        })
        
    },

    methods: {
        /**
         * Adjust the gainNodes gain values depending on the slider value
         */
        adjustCrossfading() {
            //Calculate new values with sliderValue (gain values are between 0..1)
            const PERCENTAGE = parseInt(this.sliderValue) / parseInt(this.sliderMaxValue);

            //Linear (with Cosinus) Curve
            // this.gainNode1.gain.value = Math.cos(PERCENTAGE * Math.PI / 2);
            // this.gainNode2.gain.value = Math.cos((1-PERCENTAGE) * Math.PI / 2);

            //Linear curve
            // this.gainNode1.gain.value = 1 - Math.pow(PERCENTAGE, 2);
            // this.gainNode2.gain.value = 1 - Math.pow( (PERCENTAGE - 1), 2);

            //Exponential curve
            this.gainNode1.gain.value = Math.pow(2, -PERCENTAGE + 1) - 1;
            this.gainNode2.gain.value = Math.pow(2, PERCENTAGE) - 1;

            //Squareroot curve
            // this.gainNode1.gain.value = Math.sqrt(1-x);
            // this.gainNode2.gain.value = Math.sqrt(x);
        },
    }
}
</script>

<style scoped>
#card {
    border-radius: 15px;
    width: 96%;
    height: 40%;

    opacity: 0.8;
    margin-top: 1%;
    margin-bottom: 1%;
  
    margin-left: 2%;
    margin-right: 2%; 

    padding: 1px;
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
  width: 95%;                      
  height: 10px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
}

.slider::-moz-range-thumb {
  width: 15px;
  height: 30px;
  border-radius: 5px;
  background: rgb(105, 175, 175);
  border-color: rgb(105, 175, 175);
  cursor: pointer;
}
</style>