<template>
    <b-card id="card" bg-variant="default" class="text-center"> 
      <div id="center-file-input-bar">

        <b-form-group label-for="file-small" label-size="sm">
        
          <p class="mt-3"><strong>{{file ? file.name : 'No track given'}}</strong> </p>
          <hr>

          <Soundtrack v-bind:playerNr="playerNr"/>

          <VolumeSlider v-bind:playerNr="playerNr"/>

          <b-button-group id="btn-group" size="sm">
            <b-button
              v-for="(btn, idx) in buttons"
              :key="idx"
              :pressed.sync="btn.state"
              @click="execute(btn.caption)"
              variant="outline-dark">
              <!-- <b-icon icon="arrow-up"/> -->
              <!--img :src="'../assets/' + btn.img" alt="asdf"/-->
              {{ btn.caption }}
            </b-button>
          </b-button-group>

        </b-form-group>
        
      </div> 
      <AudioFilter id="afilter" filterType="lowshelf" nextComponent="filter-peaking" v-bind:playerNr="playerNr" 
        v-bind:minFreq="350" v-bind:maxFreq="1500" v-bind:minGain="-30" v-bind:maxGain="30" v-bind:minQ="0.0001" v-bind:maxQ="100"/>
      <AudioFilter id="afilter" filterType="peaking" nextComponent="filter-highshelf" v-bind:playerNr="playerNr" 
        v-bind:minFreq="1500" v-bind:maxFreq="3000" v-bind:minGain="-30" v-bind:maxGain="30" v-bind:minQ="0.0001" v-bind:maxQ="100"/>
      <AudioFilter id="afilter" filterType="highshelf" nextComponent="crossFader" v-bind:playerNr="playerNr" 
        v-bind:minFreq="3000" v-bind:maxFreq="8000" v-bind:minGain="-30" v-bind:maxGain="30" v-bind:minQ="0.0001" v-bind:maxQ="100"/>
    </b-card>
</template>

<script>
import { EventBus } from '../main';
import { AudioCtx } from '../main';
import { AudioCtx2} from '../main';
import AudioFilter from './AudioFilter.vue';
import VolumeSlider from './VolumeSlider.vue';
import Soundtrack from './Soundtrack';

/**
 * Audio States
 */
const EnumAudioStates = {
  //Match the number with the button array indices
  isSlowedDown: 0,  
  isPaused: 1,
  isPlaying: 2,
  isStopped: 3,
  isPacedUp: 4
};

export default {
  name: 'FileInput',
  
  props: {
    playerNr: Number,
  },

  components: {
    AudioFilter, VolumeSlider, Soundtrack
  },

  data: function() {
      return {
      file: null,
      myToggle: false,
      nextComponent: "filter-lowshelf",
      buttons: [
        { caption: 'x0.5', state: false, id: '1', img: 'flag' },
        { caption: 'Pause', state: false, id: '2', img:  '../assets/backwards.svg' },
        { caption: 'Play', state: false, id: '3', img:  '../assets/backwards.svg'},
        { caption: 'Stop', state: false, id: '4', img:  '../assets/backwards.svg'},
        { caption: 'x1.5', state: false, id: '5', img:  '../assets/backwards.svg'}
      ],
      audioContext: AudioContext,
      source: AudioBufferSourceNode,
      audioState: EnumAudioStates.isStopped,
      startTime: Number,
      currentTime: Number,
      songs: [],
    }
  }, 
  
  async mounted() {
    EventBus.$on("fileChosen", file => {
      this.loadFile(file);
    });

    EventBus.$on('midi-speedLeft', midiData => {
      if (this.playerNr == 1 && this.file != null) {
        this.changePlaybackRate(midiData.btnValue)
      }
    });

    EventBus.$on('midi-speedRight', midiData => {
      if (this.playerNr == 2 && this.file != null) {
        this.changePlaybackRate(midiData.btnValue)
      }
    });

    EventBus.$on('midi-playLeft', midiData => {
      if (this.playerNr == 1 && this.file != null && midiData.cmd === 8) {
        if(this.audioState === EnumAudioStates.isPlaying){
          this.pauseAudio()
        } else if(this.audioState === EnumAudioStates.isPaused){
          this.pauseAudio()
        } else if(this.audioState === EnumAudioStates.isStopped) {
        this.playAudio();
        }
      }
    });
          
    EventBus.$on('midi-playRight', midiData => {
      if (this.playerNr == 2 && this.file != null && midiData.cmd === 8) {
        this.playAudio();
      }
    });

    EventBus.$on('midi-stopLeft', midiData => {
        if (this.playerNr == 1 && this.file != null && midiData.cmd === 8) {
          this.stopAudio();
        }
      });
  
    EventBus.$on('midi-stopRight', midiData => {
      if (this.playerNr == 2 && this.file != null && midiData.cmd === 8) {
        this.stopAudio();
      }
    });

      EventBus.$on('loadLeft', data => {
        if (this.playerNr == 1) {
          this.file = data.source;
            this.drawAudio(this.file);
          }
      });
       
      EventBus.$on('loadRight', data => {
        if (this.playerNr == 2) {
          this.file = data.source;
          this.drawAudio(this.file);
        }
      });
    },

  created() {
    if (this.playerNr == 1) this.audioContext = AudioCtx;
    else this.audioContext = AudioCtx2;
  },

    watch:{
      file: function(){       
        // Lädt den Buffer ins Audio
        if(this.file !== null){
          if (this.audioState === EnumAudioStates.isPaused) {
            this.audioContext.resume();      
            this.source.stop();   
          }
          if (this.audioState === EnumAudioStates.isPlaying) this.source.stop();
            this.buttons[this.audioState].state = false;
            this.audioState = EnumAudioStates.isStopped;
        }  
      }
    },

  computed: {
    btnStates() {
        return this.buttons.map(btn => btn.state)
    }
  },

  methods: {
    /**
     * Map functions to buttons
     */
    execute(state) {
      switch (state) {
        case 'Play':
          this.playAudio();
          break;
        case 'Pause':
          this.pauseAudio();
          break;
        case 'Stop':
          this.stopAudio()
          break;
        case 'x1.5':
          this.increasePlaybackRate();
            break;
        case 'x0.5':
          this.decreasePlaybackRate();
          break;
      } 
    },
    
    /**
     * Change the playbackRate to the given midi value in percentage
     */
    changePlaybackRate(value){
        this.source.playbackRate.value = value / 127 * 2
    },

    /**
     * Increase the playbackRate to 1.5 if enabled else to 1
     */
    increasePlaybackRate(){
      if(this.buttons[EnumAudioStates.isPacedUp].state === true){
      this.source.playbackRate.value = 1.5;
      this.buttons[EnumAudioStates.isSlowedDown].state  = false;
      } else {
        this.source.playbackRate.value = 1;
        this.buttons[EnumAudioStates.isPacedUp].state  = false;
      }       
    }, 

    /**
     * Increase the playbackRate to 1.5 if enabled else to 1
     */
    decreasePlaybackRate(){
      if(this.buttons[EnumAudioStates.isSlowedDown].state === true){
      this.source.playbackRate.value = 0.5;
      this.buttons[EnumAudioStates.isPacedUp].state  = false;
      } else {
        this.source.playbackRate.value = 1;
        this.buttons[EnumAudioStates.isSlowedDown].state  = false;
      }       
    }, 

    /**
     * Loads the audio file into the buffer
     * @param {"path to the audio file"} url
     */
    loadAudio(response) {
      this.source = this.audioContext.createBufferSource(); 
      response.arrayBuffer().then(audioData => {
          this.audioContext.decodeAudioData(audioData).then(buffer => {
            this.source.buffer = buffer; 
          });
      }).catch(window.console.log());
    },

    drawAudio(response){
      response.arrayBuffer().then(audioData => {
        this.audioContext.decodeAudioData(audioData).then(buffer => {
          EventBus.$emit("SongData", {buffer: buffer, playerNr: this.playerNr});         
          });
      }).catch(window.console.log());
    },

    /**
     * Change the internal audioState to the new one
     * and set the previous enabled button false 
     * @since only one button can be true at a time
     */
    changeCurrentStateTo(newState) {
      this.buttons[this.audioState].state = false;
      this.buttons[newState].state = true;
      this.audioState = newState;
    },
    
    /**
     * Starts playing the audio at given offset
     */
    playAudio() {
      if (this.file !== null) {       
        if (this.audioState === EnumAudioStates.isPlaying) this.stopAudio();
        else if(this.audioState === EnumAudioStates.isPaused) {
          this.pauseAudio();
        }
        else {            
          this.loadAudio(this.file);        
          this.source.start(0);
          if(this.buttons[EnumAudioStates.isPacedUp].state){
            this.increasePlaybackRate();
          }
          if(this.buttons[EnumAudioStates.isSlowedDown].state){
            this.decreasePlaybackRate();
          }
          // if (offset === 0) { 
          //   this.startTime = performance.now(); 
          // } 
          this.changeCurrentStateTo(EnumAudioStates.isPlaying);
          EventBus.$emit('to-filter-lowshelf', {audioNode: this.source, playerNr: this.playerNr});
        }         
      } else this.buttons[EnumAudioStates.isPlaying].state = false;
    },

    pauseAudio() {
      if (this.file === null || this.audioState === EnumAudioStates.isStopped) this.buttons[EnumAudioStates.isPaused].state = false;
      else if (this.audioState === EnumAudioStates.isPlaying) {
        this.audioContext.suspend();
        this.changeCurrentStateTo(EnumAudioStates.isPaused);
      } else if (this.audioState === EnumAudioStates.isPaused) {
        this.audioContext.resume();
        this.changeCurrentStateTo(EnumAudioStates.isPlaying);
      }         
    },

    /**
     * Completely stops the audio, needs to be played anew
     */
    stopAudio() {
      if (this.file === null) this.buttons[EnumAudioStates.isStopped].state = false;
      else if (this.audioState !== EnumAudioStates.isStopped) {
        // if(this.audioState === EnumAudioStates.isPaused){
        //   this.audioContext.resume();
        // }
        this.source.stop();                      
        this.audioContext.resume();
        this.changeCurrentStateTo(EnumAudioStates.isStopped)        
      } else this.playAudio(0);        
    },
      
    /**
     * Load a given file into this.property file
     */
    loadFile(file) {
      if (file.target.files.length == 0) return;
      this.file = file;
      window.console.log(file.target.files[0]);       
    },      
  }
}
</script>

<style scoped>

#card {
  opacity: 0.8;
  border-radius: 25px;
  width: 46%;
  height: 50%;
  float: left;
  margin: 2% 2% 1%
}

#file-input-bar {
  width: 20%;
  height: 50%;
  margin-left: 1rem;
  margin-right: 1rem;
  margin-top: 4rem;
  float:left;
}

#reset {
  float: left;
}
</style>