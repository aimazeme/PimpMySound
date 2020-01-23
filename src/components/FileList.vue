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

                <b-button variant="outline-danger" id="putLeft" @click="sendLeft()" size="sm">Left Track</b-button>
                <b-button variant="secondary" id="addTrack" size="sm" @click="addTrack()">Add Track</b-button>
                <b-button variant="outline-info" id="putRight" @click="sendRight()" size="sm">Right Track</b-button>            
                <b-form inline>
                    <b-form inline>
                        <b-button
                            variant="danger"
                            id="reset"
                            size="sm"   
                            @click="clearLeftFiles()" 
                            class="mr-2">Reset
                        </b-button>
                        <p class="mt-2">Selected file: {{file ? file.name : ''}}</p>
                    </b-form>
                     <b-button variant="danger" id="deleteTrack" size="sm">Delete Track</b-button>
                </b-form>
            </b-form-group>
        </div>
        
        <!-- <div> -->
            <b-list-group id="songlist" size="sm" >
                <b-list-group-item 
                id="songItem" 
                v-bind:key="song.title" 
                v-for="song in songs" 
                variant="outline-dark"
                v-on:click="chooseFile(song), checkMice(song.title)" >
                    {{ song.title }}
                </b-list-group-item>
            </b-list-group>
        <!-- </div> -->
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
                // {
                //     title: 'Monkey Island Theme',
                //     source: require('../audio/Monkey Island Theme.mp3')
                // },
                // {
                //     title: 'Super Mario Bros Theme Song',
                //     source: require('../audio/Super Mario Bros Theme Song.mp3')
                // },
                // {
                //     title: 'Wartemusik',
                //     source: require('../audio/Wartemusik.mp3')
                // },
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
                }
                // window.console.log(this.index)
            } else if (data.btnValue === 63) {
                //decrease
                if (this.songs.length > 0) {
                   if(this.index > 0){
                       this.index -= 1;
                   } else if (this.index === 0){
                       this.index = this.songs.length - 1
                   }
                } 
                // window.console.log('Length: ' +  this.songs.length + ' ' + this.index)
            }
            this.chooseFile(this.songs[this.index])
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
            checkMice(yo){
                window.console.log(yo)
            },
            chooseFile(selectedFile){
                this.selectedFile = selectedFile
                // window.console.log(this.selectedFile)
            },
            clearLeftFiles() {
                this.$refs['file-input'].reset()
            },
            sendLeft() {
                if(this.selectedFile){
                EventBus.$emit('loadLeft', this.selectedFile )
                window.console.log('Send to left');
                }
            },
            sendRight() {
                if(this.selectedFile){
                    EventBus.$emit('loadRight', this.selectedFile )
                window.console.log('Send to right');
            }},
            addTrack() {
                if (this.file) {
                     var newSong = {
                        title: this.file.name,
                        source: this.file
                    }
                     this.songs.push(newSong);
                   
                    this.$refs['file-input'].reset()
                }
                // window.console.log(this.songs);
            },
            fileChosen(file) {
                EventBus.$emit("fileChosen", file);
            }
        }
        }
</script>

<style scoped>

#addTrack {
    margin: 10px;
}

#reset {
    margin: 10px;
}

#deleteTrack {
    margin-left: 65%;
}

#putLeft {
    margin: 10px;
    float: left;
}

#putRight {
    margin: 10px;
    float: right;
}

#musicLib {
    width: 50%;
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
    width: 50%;
    height: auto;
    float: right;
    padding: 20px
}
.hovering{
  color: red
}

</style>