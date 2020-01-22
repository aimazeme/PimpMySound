<template>
 <div>
 </div>
</template>

<script>
import {EventBus} from '../main.js';
var midiMap = new Map();
const midiStates = [
  //Match the number with the button array indices
  { id: 48, property: 'volumeLeft' },  
  { id: 51, property: 'volumeRight' },  
  { id: 64, property: 'crossfader' }
];
midiStates.forEach(entry => midiMap.set(entry.id,entry.property))

 window.console.log(midiMap.get(48));

export default {
    name: 'InputManager',
    props: {
     
    },
    data() {
        return {
        }     
    },
    watch: {
             btnID: function(){
                     }
    },

    created() {

  navigator.requestMIDIAccess().then(this.onMidiDevice.bind(this));
        window.addEventListener('keyup', this.onKeyboardEvent.bind(this));
    
        this.midiMapping = new Map();
        this.keyboardMapping = new Map();
    },

    methods: {
onMidiDevice(access) {
        const inputs = access.inputs.values();
        // const outputs = access.outputs.values();

        for (const input of inputs) {
            window.console.log(input);
            input.onmidimessage = this.onMidiEvent.bind(this);
        }
    },
     onMidiEvent(event) {
        let cmd = event.data[0] >> 4;
        // let channel = event.data[0] & 0xf;
        let btnID = event.data[1];
        let btnValue = event.data[2];

//  window.console.log(`cmd: ${cmd}, channel: ${channel}, btnID: ${btnID}, value: ${btnValue}`);
      window.console.log('midi-' + midiMap.get(btnID))
      EventBus.$emit('midi-' + midiMap.get(btnID), {cmd: cmd, btnID: btnID, btnValue: btnValue});
       
    },
    mapMidi(btnID, callbackFn) {
        this.midiMapping.set(btnID, callbackFn);
    },
    mapKeyboard(btnName, callbackFn) {
        this.keyboardMapping.set(btnName, callbackFn);
    }
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

