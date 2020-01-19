<template>
    <b-card id="card" bg-variant="light" class="text-center"> 
            <div class="sliderContainer">

                <label id="crossLabel" class="sliderLabel" for="crossfader"><strong>Crossfader</strong></label>
                <input id="crossfader" type="range" min="0" max= {sliderMaxValue} v-model="sliderValue" class="slider" v-on:input="adjustCrossfading()">

            </div>
    </b-card>
</template>

<script>
import {EventBus} from '../main.js';
import {AudioCtx} from '../main.js';

export default {
    name: 'Crossfader',
    data() {
        
        return {
            sliderMaxValue: 100,
            sliderValue: 0,
            gainNode1: GainNode,
            gainNode2: GainNode,
            oneIsConnected: false
        }     
    },

    created() {
        this.gainNode1 = AudioCtx.createGain();
        this.gainNode2 = AudioCtx.createGain();

        EventBus.$on('to-crossFader', (data) => {
            if (data.playerNr === 1) {
                data.audioNode.connect(this.gainNode1); 
                this.adjustCrossfading();
                window.console.log("Source 1 connected to crossfader");
            }          
            else {
                data.audioNode.connect(this.gainNode2);  
                this.adjustCrossfading();
                window.console.log("Source 2 connected to crossfader");
            }                       
        });

        
    },
    
    mounted() {
        this.gainNode1.connect(AudioCtx.destination);
        this.gainNode2.connect(AudioCtx.destination);
    },

    methods: {
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
    border-radius: 25px;
    width: 96%;
    height: 40%;

    opacity: 0.8;
    margin-top: 2%;
    margin-bottom: 2%;
  
    margin-left: 2%;
    margin-right: 2%; 

    padding: 1px;
}

#crossLabel {
    padding: 15px;
    margin: 10px
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
  width: 80%;                      
  height: 15px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 40px;
  border-radius: 5px;
  background: rgb(105, 175, 175);
  border-color: rgb(105, 175, 175);
  cursor: pointer;
}
</style>