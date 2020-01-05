<template>
    <b-card id="card" bg-variant="light" class="text-center"> 
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
export default {
    name: 'FileInput',

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

<style scoped>

#card{
  width: 45%;
  height: 50%;
  float: left;
  margin-left: 4.5%; 
}

#file-input-bar {
  width: 20%;
  height: 50%;
  margin-left: 1rem;
  margin-top: 4rem;
  float:left;
}

#reset {
  float: left;
}

</style>