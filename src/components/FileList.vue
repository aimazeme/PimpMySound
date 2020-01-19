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
                <b-button variant="outline-info" id="putRight" @click="sendRight()" size="sm">Right Track</b-button>            
                
                <b-button variant="outline-secondary" id="addTrack" size="sm" @click="addTrack()">Add Track</b-button>
                <b-button variant="danger" id="deleteTrack" size="sm">Delete Track</b-button>
            </b-form-group>
        </div>
        
        <div>
            <b-label></b-label>
            <b-list-group id="songlist" size="sm" >
                <b-list-group-item id="songItem" v-bind:key="song.title" v-for="song in songs">
                    {{ song.title }}
                </b-list-group-item>
            </b-list-group>
        </div>
    </b-card>
</template>

<script>

import {EventBus} from '../main.js';

export default {
    

    name: 'filelist',
    data () {
        return {
            file: null,
            current: {},
            songs: [{
                    title: 'Monkey Island Theme',
                    source: require('../audio/Monkey Island Theme.mp3')
                },
                {
                    title: 'Super Mario Bros Theme Song',
                    source: require('../audio/Super Mario Bros Theme Song.mp3')
                },
                {
                    title: 'Wartemusik',
                    source: require('../audio/Wartemusik.mp3')
                },
            ],
        }
        },
        methods: {
            sendLeft() {
                window.console.log('sent left');
            },
            sendRight() {
                window.console.log('sent right');
            },
            addTrack() {
                if (this.file) {
                    window.console.log(this.file)
                    window.console.log(this.file.name)
                    var newSong = {
                        title: this.file.name,
                        source: this.file
                    }
                    window.console.log(URL.createObjectURL(this.file));
                    this.songs.push(newSong);
                   
                    this.$refs['file-input'].reset()
                }
                window.console.log(this.songs);
            },
            fileChosen(file) {
                EventBus.$emit("fileChosen", file);
            }
        }
        }
</script>

<style scoped>

#deleteTrack {
    margin: 10px;
    float: right;
}

#addTrack {
    margin: 10px;
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

</style>