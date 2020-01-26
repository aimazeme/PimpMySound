<template>
    <div class="sliderContainer">
    <div>
        <b-button  id="FilterCollapse" v-b-toggle="filterType + playerNr" variant="outline-info btn-block">{{this.filterType.charAt(0).toUpperCase() + this.filterType.slice(1)}} </b-button>
        <b-collapse v-bind:id="filterType + playerNr" class="mt-2">
            <b-card>
                <b-form inline>
                   
                    <div id="toggle">
                        <label class="switch">
                        <input type="checkbox" v-model="enabled">
                        <span class="slider round"></span>
                        </label>
                    </div>

                    <div id="freq" >
                        <circle-slider v-model="frequency" :side="50" v-bind:min="minFreq" v-bind:max="maxFreq" :step-size="1"></circle-slider>
                        <p for="freq">Frequency: {{ frequency }}</p>
                    </div>

                    <div id="qual">
                        <div v-if="qualityEnabled"> 
                            <circle-slider v-model="Qval" :side="50" v-bind:min="minQ" v-bind:max="maxQ" :step-size="1" ></circle-slider>
                            <p for="qual">Quality: {{ Qval }}</p>
                        </div>
                        
                    </div>

                    <div id="gain" >
                        <div v-if="gainEnabled">
                            <circle-slider v-model="gain" :side="50" v-bind:min="minGain" v-bind:max="maxGain" :step-size="1"  ></circle-slider>
                            <p for="gain">Gain: {{ gain }}</p>
                        </div>
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
import {AudioCtx2} from '../main';

export default {
    name: 'AudioFilter',
    props: {
        id: String,
        filterType: String,
        playerNr: Number,
        nextComponent: String,
        minFreq: Number,
        maxFreq: Number,
        minGain: Number,
        maxGain: Number,
        minQ: Number,
        maxQ: Number
    },

    data() {
        return {
            filterNode: AudioNode,
            frequency: 1,
            gain: 1,
            Qval: 1,
            enabled: true,
            prevAudioNode: null,
            gainEnabled: true,
            qualityEnabled: true
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
        },  
        
        enabled: function() {
            if (this.prevAudioNode !== null) {
                if (this.enabled) window.console.log("Enabling Filter: " + this.filterType);
                else window.console.log("Disabling Filter: " + this.filterType);
                this.connect();
            }       
        }
    },

    created() {
        //Create component fitting for the given filterType        
        if (this.playerNr == 1) this.filterNode = AudioCtx.createBiquadFilter();
        else this.filterNode = AudioCtx2.createBiquadFilter();
        
        switch (this.filterType) {
            case 'lowpass':
            case 'highpass':
            case 'bandpass': 
            case 'notch': 
            case 'allpass':
                this.gainEnabled = false;
                break;
            case 'lowshelf':
            case 'highshelf':
                this.qualityEnabled = false;
                break;
            default:
                this.qualityEnabled = true;
                this.gainEnabled = true;
        }

        this.filterNode.type = this.filterType;
        EventBus.$on('to-filter-' + this.filterType, (data) => {  
            if (data.playerNr === this.playerNr) {
                this.prevAudioNode = data.audioNode;
                this.connect();
            }
        });

        EventBus.$on('midi-to-filter-' + this.filterType + "-Freq-2", (data) => { 
            if (this.playerNr == 2) {
                this.frequency = this.minFreq + ((data.btnValue / 127) * (this.maxFreq - this.minFreq));
            }       
        });

        EventBus.$on('midi-to-filter-' + this.filterType+ "-Gain-2", (data) => {  
            if (this.playerNr == 2) {
                if (this.gainEnabled) {
                    this.gain = this.minGain + ((data.btnValue / 127) * (this.maxGain - this.minGain));
                }
            }            
        });

        EventBus.$on('midi-to-filter-' + this.filterType + "-Qual-2", (data) => {  
            if (this.playerNr == 2) {
                if (this.qualityEnabled) {
                    this.Qval = this.minQ + ((data.btnValue / 127) * (this.maxQ - this.minQ));
                }
            }         
        });

        EventBus.$on('midi-to-filter-' + this.filterType + "-Freq-1", (data) => {  
            if (this.playerNr == 1) {
                this.frequency = this.minFreq + ((data.btnValue / 127) * (this.maxFreq - this.minFreq));
            }
            
        });

        EventBus.$on('midi-to-filter-' + this.filterType+ "-Gain-1", (data) => {  
            if (this.playerNr == 1) {
                if (this.gainEnabled) {
                    this.gain = this.minGain + ((data.btnValue / 127) * (this.maxGain - this.minGain));
                }
            }          
        });

        EventBus.$on('midi-to-filter-' + this.filterType + "-Qual-1", (data) => {  
            if (this.playerNr == 1) {
                if (this.qualityEnabled) {
                    this.Qval = this.minQ + ((data.btnValue / 127) * (this.maxQ - this.minQ));
                }
            }            
        });
    },

    methods: {
        /**
         * Connect the previous audioNode to this or the next audionode
         * (Depends rather this filter is enabled)
         */
        connect() {
            if (this.enabled) {
                this.prevAudioNode.disconnect();
                this.prevAudioNode.connect(this.filterNode);
                window.console.log("Connected Source " + this.playerNr + " to: Filter " + this.filterType);            
                EventBus.$emit('to-' + this.nextComponent, {audioNode: this.filterNode, playerNr: this.playerNr});
            } else {
                this.prevAudioNode.disconnect();
                window.console.log("Connecting Source " + this.playerNr + " to: " + this.nextComponent);
                EventBus.$emit('to-' + this.nextComponent, {audioNode: this.prevAudioNode, playerNr: this.playerNr});
            }
        },
    }
}
</script>

<style scoped>

#FilterCollapse {
    border-radius: 10px;
    margin: 4px
}

#freq {
    margin-left: 15%
}

#qual {
    margin-left: 15%;
}

#gain {
    margin-left: 15%;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 1px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: rgb(116, 194, 197);
}

input:focus + .slider {
  box-shadow: 0 0 1px rgb(91, 194, 194);
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 15px;
}

.slider.round:before {
  border-radius: 40%;
}
</style>

