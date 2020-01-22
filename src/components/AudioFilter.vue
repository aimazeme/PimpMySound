<template>
    <div class="sliderContainer">
    <div>
        <b-button  id="FilterCollapse" v-b-toggle.collapse-1 variant="outline-info btn-block">Filter Away</b-button>
        <b-collapse id="collapse-1" class="mt-2">
            <b-card>
                <p> {{this.filterType}} Filter </p>
                <b-form inline>
                    <div id="freq" >
                        <circle-slider v-model="frequency" :side="50" :min="1" :max="100" :step-size="1"></circle-slider>
                        <p for="freq">Frequency: {{ frequency }}</p>
                    </div>

                    <div id="qual">
                        <circle-slider v-model="Qval" :side="50" :min="1" :max="100" :step-size="1" ></circle-slider>
                        <p for="qual">Quality: {{ Qval }}</p>
                    </div>

                    <div id="gain">
                        <circle-slider v-model="gain" :side="50" :min="1" :max="100" :step-size="1"  ></circle-slider>
                        <p for="gain">Gain: {{ gain }}</p>
                    </div>
                </b-form>
            </b-card>
        </b-collapse>
    </div>
    </div>
</template>

<script>
import {EventBus} from '../main.js';
import {AudioCtx} from '../main.js';

export default {
    name: 'AudioFilter',
    props: {
        id: String,
        filterType: String,
        playerNr: Number,
        nextComponent: String,
    },
    data() {
        return {
            filterNode: AudioNode,
            frequency: 1,
            gain: 1,
            Qval: 1,
        }     
    },
    watch: {
        Qval: function(){
            this.filterNode.Q.value = this.Qval
        },
        frequency: function(){
            this.filterNode.frequency.value = this.frequency
        },
        gain: function(){
            this.filterNode.gain.value = this.gain
        }         
    },

    created() {
        this.filterNode = AudioCtx.createBiquadFilter();
        this.filterNode.type = this.filterType;
        EventBus.$on('to-filter-' + this.filterType, (data) => {  
            if (data.playerNr === this.playerNr) {
                window.console.log("Connected Source " + data.playerNr + " to: Filter " + this.filterType);
                data.audioNode.connect(this.filterNode);
                EventBus.$emit('to-' + this.nextComponent, {audioNode: this.filterNode, playerNr: this.playerNr});
            }
        });
    },

    methods: {

    }
}
</script>

<style scoped>

#freq {
    margin-left: 10%
}

#qual {
    margin-left: 10%;
    margin-right: 10%
}

#gain {
    margin-right: 10%
}

.sliderContainer {
   width: 100%;
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

