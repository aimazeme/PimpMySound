<template>
    <b-card id="card" bg-variant="default" class="text-center"> 
      <div id="center-file-input-bar">
        <b-form-group label-for="file-small" label-size="sm">
        
          <!-- <b-form-file 
            class="mb-2"
            id="file-small" size="sm"
            accept=".wav, .mp3, .m4a"
            v-model="file"
            ref="file-input"
            :state="Boolean(file)"
            placeholder="Choose a file or drop it here..."
            drop-placeholder="Drop file here..." >
          </b-form-file>  -->
          
          <!-- <b-form inline> -->
            <!-- <b-button
              variant="danger"
              id="reset"
              size="sm"   
              @click="clearLeftFiles()" 
              class="mr-2">Reset
            </b-button> -->
            <p class="mt-3"> {{file ? file.name : 'No track given'}}</p>
          <!-- </b-form> -->

          <VolumeSlider v-bind:playerNr="playerNr"/>

          <b-button-group id="btn-group" size="sm">
            <b-button
              v-for="(btn, idx) in buttons"
              :key="idx"
              :pressed.sync="btn.state"
              @click="execute(btn.caption)"
              variant="outline-dark">
              {{ btn.caption }}
            </b-button>
          </b-button-group>

        </b-form-group>
        
      </div> 
      <AudioFilter id="afilter" filterType="lowshelf" nextComponent="crossFader" v-bind:playerNr="playerNr"/>
    </b-card>
</template>

<script>
import { EventBus } from '../main';
import { AudioCtx } from '../main';
import { AudioCtx2} from '../main';
import AudioFilter from './AudioFilter.vue';
import VolumeSlider from './VolumeSlider.vue';
/**
 * Audio States
 */
const EnumAudioStates = {
  //Match the number with the button array indices
  isBackwarding: 0,  
  isPaused: 1,
  isPlaying: 2,
  isStopped: 3,
  isForwarding: 4
};

export default {
    name: 'FileInput',
    props: {
      playerNr: Number,
    },

    components: {
      AudioFilter, VolumeSlider
    },

    data: function() {
        return {
        file: null,
        myToggle: false,
        buttons: [
          { caption: 'Backward', state: false },
          { caption: 'Pause', state: false },
          { caption: 'Play', state: false },
          { caption: 'Stop', state: false },
          { caption: 'Forward', state: false }
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
        if (this.playerNr == 1 && this.file != null && midiData.btnValue === 0) {
          this.playAudio(0);
        }
      });
           EventBus.$on('midi-playRight', midiData => {
        if (this.playerNr == 2 && this.file != null && midiData.btnValue === 0) {
          this.playAudio(0);
        }
      });

    EventBus.$on('midi-stopLeft', midiData => {
      window.console.log("stop left")
        if (this.playerNr == 1 && this.file != null && midiData.btnValue === 0) {
          this.stopAudio();
        }
      });
           EventBus.$on('midi-stopRight', midiData => {
        if (this.playerNr == 2 && this.file != null && midiData.btnValue === 0) {
          this.stopAudio();
        }
      });

        EventBus.$on('loadLeft', data => {
          // window.console.log(data.source)
        if (this.playerNr == 1) {
          this.file = data.source;
        }
      });
       EventBus.$on('loadRight', data => {
          // window.console.log(data.source)
        if (this.playerNr == 2) {
          this.file = data.source;
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
        if (this.audioContext.state === 'suspended') {
          this.source.stop();
          this.audioContext.resume();         
        }
        if (this.audioState === EnumAudioStates.isPlaying) this.source.stop();
        this.buttons[this.audioState].state = false;
        this.audioState = EnumAudioStates.isStopped;
        this.loadAudio(this.file);       
      }}
    },

    computed: {
      btnStates() {
          return this.buttons.map(btn => btn.state)
      }
    },

    methods: {
      clearLeftFiles() {
        this.$refs['file-input'].reset()
      },

      execute(state) {
        switch (state) {
          case 'Play':
            this.playAudio(0);
            break;
          case 'Pause':
            this.pauseAudio();
            break;
          case 'Stop':
            this.stopAudio()
            break;
          case 'Forward':
            this.increasePlaybackRate();
              break;
          case 'Backward':
            this.decreasePlaybackRate();
            break;
        } 
      },
      
      changePlaybackRate(value){
          this.source.playbackRate.value = value / 127 * 2
      },
  
      increasePlaybackRate(){
        if(this.buttons[EnumAudioStates.isForwarding].state === true){
        this.source.playbackRate.value = 1.5;
        this.buttons[EnumAudioStates.isBackwarding].state  = false;
        } else {
          this.source.playbackRate.value = 1;
          this.buttons[EnumAudioStates.isForwarding].state  = false;
        }       
      }, 

      decreasePlaybackRate(){
        if(this.buttons[EnumAudioStates.isBackwarding].state === true){
        this.source.playbackRate.value = 0.5;
        this.buttons[EnumAudioStates.isForwarding].state = false;
        } else {
          this.source.playbackRate.value = 1;
          this.buttons[EnumAudioStates.isBackwarding].state  = false;
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
        });
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
      playAudio(offset) {
        if (this.file !== null) {       
          if (this.audioState === EnumAudioStates.isPlaying) this.stopAudio();
          else {            
            this.loadAudio(this.file);        
            window.console.log("playing audio at: " + offset);
            this.source.start(0, offset);
            if(this.buttons[EnumAudioStates.isForwarding].state){
              this.increasePlaybackRate();
            }
            if(this.buttons[EnumAudioStates.isBackwarding].state){
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

      /**
       * Pauses the music or resumes it if it was paused 
       */
      pauseAudio() {
        if (this.file === null || this.audioState === EnumAudioStates.isStopped) this.buttons[EnumAudioStates.isPaused].state = false;
        else if (this.audioState === EnumAudioStates.isPlaying) {
          //Pause audio
          // this.source.stop();
          // this.currentTime = performance.now();
          // this.changeCurrentStateTo(EnumAudioStates.isPaused);
          this.audioContext.suspend();
          this.changeCurrentStateTo(EnumAudioStates.isPaused);
        } else if (this.audioState === EnumAudioStates.isPaused) {
          //Resume audio
          // let pausedAt = (this.currentTime-this.startTime)/1000;
          // this.playAudio(pausedAt);
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
          this.source.stop(); 
          this.changeCurrentStateTo(EnumAudioStates.isStopped)        
        } else this.playAudio(0);        
      },
      
      loadFile(file) {
        if (file.target.files.length == 0) return;
        this.file = file;
        window.console.log(file.target.files[0]);
      },      
    }
}
</script>

<style scoped>

#afilter {
  margin-left: 1px
}

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