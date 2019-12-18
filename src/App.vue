<template>
  <div id="app">
    
    <PimpMySound msg="Welcome to Pimp My Sound"/>
    
    <!-- Styled left file input bar-->
    <b-card id="card-left" bg-variant="light" class="text-center"> 
      <div id="center-file-input-bar">
        <b-form-group label-for="file-small" label-size="sm">
        
          <b-form-file 
            class="mb-2"
            id="file-small" size="sm"
            accept=".wav, .mp3"
            v-model="file"
            ref="file-input-l"
            :state="Boolean(file)"
            placeholder="Choose a file or drop it here..."
            drop-placeholder="Drop file here...">
          </b-form-file> 
          
          <b-form inline>
            <b-button
              id="reset1"
              size="sm"   
              @click="clearLeftFiles()" 
              class="mr-2">Reset
            </b-button>
            <p class="mt-3">Selected file: {{file ? file.name : ''}}</p>
          </b-form>

          <b-button-group id="btn-group-left" size="sm">
            <b-button
              v-for="(btn, idx) in buttons"
              :key="idx"
              :pressed.sync="btn.state"
              variant="secondary">
              {{ btn.caption }}
            </b-button>
          </b-button-group>
          <p>Pressed States: <strong>{{ btnStates }}</strong></p>

        </b-form-group>
      </div> 
    </b-card>
      
    
    <!-- Styled righ file input bar-->
    <b-card id="card-right" bg-variant="light" class="text-center">
    <div id="center-file-input-bar">
        <b-form-group label-for="file-small" label-size="sm">
        
          <b-form-file 
            class="mb-2"
            id="file-small" size="sm"
            accept=".wav, .mp3"
            v-model="file2"
            ref="file-input-r"
            :state="Boolean(file2)"
            placeholder="Choose a file or drop it here..."
            drop-placeholder="Drop file here...">
          </b-form-file> 
          
          <b-form inline>
            <b-button
              id="reset2"
              size="sm"   
              @click="clearRightFiles()" 
              class="mr-2">Reset
            </b-button>
            <p class="mt-3">Selected file: {{file2 ? file2.name : ''}}</p>
          </b-form>

           <b-button-group id="btn-group-right" size="sm">
            <b-button
              v-for="(btn2, idx2) in buttons2"
              :key="idx2"
              :pressed.sync="btn2.state2"
              variant="secondary">
              {{ btn2.caption2 }}
            </b-button>
          </b-button-group>

        </b-form-group>
      </div>
    </b-card>
  </div>
</template>

<script>
import PimpMySound from './components/PimpMySound.vue'

export default {
  name: 'app',
  components: {
    PimpMySound,
  },

  data() {
    return {
      file: null,
      file2: null,
      myToggle: false,
      buttons: [
        { caption: 'backward', state: false },
        { caption: 'Pause', state: false },
        { caption: 'Play', state: false },
        { caption: 'Stop', state: false },
        { caption: 'forward', state: false }
      ],
      buttons2: [
        { caption2: 'backward', state2: false },
        { caption2: 'Pause', state2: false },
        { caption2: 'Play', state2: false },
        { caption2: 'Stop', state2: false },
        { caption2: 'forward', state2: false }
      ]
    }
  },  
  
  computed: {
    btnStates() {
      return this.buttons.map(btn => btn.state)
    }
  },
   
  methods: {
    clearLeftFiles() {
      this.$refs['file-input-l'].reset()
    },
    clearRightFiles() {
      this.$refs['file-input-r'].reset()
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 40px;
  margin-bottom: 40px;
}

#card-left {
  width: 45%;
  height: 50%;
  float: left;
  margin-left: 4.5%; 
}

#card-right {
  width: 45%;
  height:50%;
  float: right;
  margin-right: 4.5%;
}

#left-file-input-bar {
  width: 20%;
  height: 50%;
  margin-left: 1rem;
  margin-top: 4rem;
  float:left;
}

#right-file-input-bar {
  width: 20%;
  height: 50%;
  margin-right: 1rem;
  margin-top: 4rem;
  float: right;
}

#reset1 {
  float: left;
}

#reset2 {
  float: left;
}

</style>
