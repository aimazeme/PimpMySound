<template>
  <div id="app">
    
    <PimpMySound msg="Welcome to Pimp My Sound"/>
    
    <!-- Styled left file input bar-->
    <div id="left-file-input-bar">
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
        <b-col lg="4" class="pb-2">
          <b-button
            size="sm"   
            @click="clearLeftFiles()" 
            class="mr-2">Reset
          </b-button>
        </b-col> 
        
        <p class="mt-3">Selected file: {{file ? file.name : ''}}</p>
        
        </b-form>
       
      
      </b-form-group>
    </div>

    <!-- Styled left file input bar-->
    <div id="right-file-input-bar">
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
          <b-col lg="4" class="pb-2">
          <b-button
            size="sm"   
            @click="clearRightFiles()" 
            class="mr-2">Reset
          </b-button>
        </b-col>
        
        <p class="mt-3">Selected file: {{file2 ? file2.name : ''}}</p>
        </b-form>
        
      
      </b-form-group>
    </div>
    

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
      file2: null
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
  margin-top: 60px;
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

</style>
