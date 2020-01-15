<template>
    <div class="sliderContainer">
        
        <input type="range" min="0" max= {sliderMaxValue} v-model="sliderValue" class="slider" v-on:input="adjustCrossfading()">

        <div>
            <label class="sliderLabel">CrossFader</label>
        </div>

    </div>
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
    margin-top: .5em;
    width: 80%;
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