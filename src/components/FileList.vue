<template>
    <b-card id="card" bg-variant="default" header="MUSIC LIBRARY" class="text-center display-5" style="opacity: 0.8">
     
        <div class="container" id="musicLib">
            <b-form-group>
                            
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

                <b-button variant="secondary" id="addTrack" size="sm" @click="addTrack()">Add Track</b-button>
                <b-form inline>
                    <b-form inline>
                        <b-button
                            variant="danger"
                            id="reset"
                            size="sm"   
                            @click="clearSelectedFile()" 
                            class="mr-2">Reset
                        </b-button>
                        <p id="selected" class="mt-2">Selected file: {{file ? file.name : ''}}</p>
                    </b-form>
                </b-form>
            </b-form-group>
        </div>
        
        <b-button variant="outline-danger" id="putLeft" @click="sendLeft()" size="sm">Left Track</b-button>
        <b-button variant="outline-info" id="putRight" @click="sendRight()" size="sm">Right Track</b-button>            

        
        <b-list-group id="songlist" size="sm" >
            <b-list-group-item 
                id="song.title" 
                v-bind:key="song.title" 
                v-for="song in songs" 
                variant="outline-dark"
                v-on:click="chooseFile(song)" 
                button>
                <b-badge v-if="selectedFile && selectedFile.title === song.title" 
                pill>
                 {{ song.title }} </b-badge>
                <div v-else=""> {{song.title}}  </div>
            </b-list-group-item>
        </b-list-group>
    </b-card>
</template>

<script>
import {EventBus} from '../main.js';

export default {

    name: 'filelist',
    data () {
        return {
            isHovering: false,
            file: null,
            selectedFile: null,
            index: -1,
            songs: [
            ],
        }
    },

    created() {
        EventBus.$on('midi-filechooser', (data) => {
            if(data.btnValue === 65){
                //increase
                if(this.songs.length > 0) {
                if(this.index < this.songs.length - 1){
                this.index += 1;
                } else {
                    this.index = 0;
                }
                 window.console.log(this.songs[this.index].title)
                }
            } else if (data.btnValue === 63) {
                //decrease
                if (this.songs.length > 0) {
                   if(this.index > 0){
                       this.index -= 1;
                    } else if (this.index === 0){
                       this.index = this.songs.length - 1
                    }
                } 
            }
            if(this.songs.length > 0) {
                this.chooseFile(this.songs[this.index])
            }
        })

        EventBus.$on('midi-sendLeft', (data) => {
            if(data.btnValue === 0){
                this.sendLeft();
            }
        });

        EventBus.$on('midi-sendRight', (data) => {
            if(data.btnValue === 0){
                this.sendRight();
            }
        });
    },
    methods: {
        /**
         * Selects a file from list as the current selected file
         */
        chooseFile(selectedFile){
            this.selectedFile = selectedFile
            var counter = 0;

            for(const song in this.songs){
                
                if(song.title === selectedFile.title){
                    this.index = counter;
                    break
                }
                counter++
            }
        },

        /**
         * Clear the selected file
         */
        clearSelectedFile() {
            this.$refs['file-input'].reset()
        },

        /**
         * Send file to the left player
         */
        sendLeft() {
            if(this.selectedFile){
            EventBus.$emit('loadLeft', this.selectedFile)
            window.console.log('Send to left');
            }
        },

        /**
         * Send file to the right player
         */
        sendRight() {
            if(this.selectedFile){
                EventBus.$emit('loadRight', this.selectedFile )
            window.console.log('Send to right');
        }},

        /**
         * Add a track to the list
         */
        addTrack() {
            if (this.file) {
                    var newSong = {
                    title: this.file.name,
                    source: this.file
                }
                    this.songs.push(newSong);
                
                this.$refs['file-input'].reset()
            }
        }
    }
}
</script>

<style scoped>

#reset {
    margin-top: 0%;
}

#addTrack {
    margin-right: 0px;
    margin-top: 5px;
    float: right
}

#putLeft {
    margin: 10px;
}

#putRight {
    margin: 10px;
}

#musicLib {
    width: 40%;
    height: auto;
    float: left;
    padding: 20px;
}
#card {
    border-radius: 25px;
    width: 96%;
    height: 50%;
  
    margin-left: 2%;
    margin-right: 2%; 
}

#songlist {
    width: 60%;
    height: auto;
    float: right;
    padding: 10px
}
.hovering{
  color: red
}

</style>