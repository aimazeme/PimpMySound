<template>
    <b-card id="card" bg-variant="light" class="text-center"> 
      <div id="center-file-input-bar">
        <b-form-group label-for="file-small" label-size="sm">
        
          <b-form-file 
            class="mb-2"
            id="file-small" size="sm"
            accept=".wav, .mp3, .m4a"
            v-model="file"
            ref="file-input"
            :state="Boolean(file)"
            placeholder="Choose a file or drop it here..."
            drop-placeholder="Drop file here..." >
          </b-form-file> 
          
          <b-form inline>
            <b-button
              id="reset"
              size="sm"   
              @click="clearLeftFiles()" 
              class="mr-2">Reset
            </b-button>
            <p class="mt-3">Selected file: {{file ? file.name : ''}}</p>
          </b-form>

          <b-button-group id="btn-group" size="sm">
            <b-button
              v-for="(btn, idx) in buttons"
              :key="idx"
              :pressed.sync="btn.state"
              @click="execute(btn.caption)"
              variant="secondary">
              {{ btn.caption }}
            </b-button>
          </b-button-group>
          <p>Pressed States: <strong>{{ btnStates }}</strong></p>

        </b-form-group>
      </div> 
    </b-card>
</template>

<script>
import { EventBus } from '../main';
import { AudioCtx } from '../main';

/**
 * Audio States
 */
const EnumAudioStates = {
  //Match this the buttons order in data
  isBackwarding: 1  ,  
  isPaused: 2,
  isPlaying: 3,
  isStopped: 4,
  isForwarding: 5
};

export default {
    name: 'FileInput',

    data() {
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
        source: AudioBufferSourceNode,
        audioState: EnumAudioStates.isStopped,
      }
    }, 
      async mounted() {
    EventBus.$on("fileChosen", file => {
      this.loadFile(file);
    });
  }, 
  watch:{
    file: function(){
      this.log(this)
    }
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
        execute(state){
        if(state === 'Play'){
          window.console.log(this.file)
          //  this.loadAudio(this.file)
           this.playAudio();
        } else {
          alert(state)
        }
},
        /**
         * Loads the audio file into the buffer
         * @param {"path to the audio file"} url
         */
        loadAudio(url) {
          this.source = AudioCtx.createBufferSource(); 
          //Have to use arrow functions because "function" would change the context of "this"
          fetch(url).then(response => {
              response.arrayBuffer().then(audioData => {
                  AudioCtx.decodeAudioData(audioData).then(buffer => {
                      this.source.buffer = buffer;              
                  });
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
          this.audioState = newState;
        },

        /**
         * Starts playing the audio anew
         */
        playAudio() {
          if (this.file !== null && this.audioState === EnumAudioStates.isStopped) {
            this.loadAudio(this.file);
            this.source.start(0);
            this.changeCurrentStateTo(EnumAudioStates.isPlaying);
            //TODO!
            EventBus.$emit('to-nextComponent', this.source);
          }
        },
        loadAudioFile(){
            let fr = new FileReader();
            fr.readAsDataURL(this.file);
            fr.onload = e => {
              var audio = document.createElement('audio');
              audio.src = e.target.result;
              var context = new(window.AudioContext || window.webkitAudioContext)(),
                source = context.createMediaElementSource(audio);
              window.console.log(source);
            };
        },
    
        /**
         * Pauses the music or resumes it if it was paused 
         */
        pauseMusic() {
          if (this.audioState !== EnumAudioStates.isPaused) {
            //Pause audio
            AudioCtx.suspend();
            this.changeCurrentStateTo(EnumAudioStates.isPaused);
          } else {
            //Resume audio
            AudioCtx.resume();
            this.changeCurrentStateTo(EnumAudioStates.isPlaying);
          }         
        },

        /**
         * Completely stops the audio, needs to be played anew
         */
        stopAudio() {
          if (this.audioState !== EnumAudioStates.isStopped) {
            this.source.stop(); 
            if (this.audioState === EnumAudioStates.isPaused) AudioCtx.resume();
            this.changeCurrentStateTo(EnumAudioStates.isStopped)
          }
        },
        loadFile(file) {
      if (file.target.files.length == 0) return;
      this.file = file;
      window.console.log(file.target.files[0]);
    }
        
    }
}
</script>

<style scoped>
#card{
  width: 46%;
  height: 50%;
  float: left;
  margin-left: 2%;
  margin-right: 2%; 
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