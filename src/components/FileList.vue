<template>
    <b-card id="card" bg-variant="default" class="text-center" style="opacity: 0.8">
     
        <b-button-group>
            <b-button id="putRight" @click="sendRight()" size="sm">Right Track
            </b-button>
            <b-button id="putLeft" @click="sendLeft()" size="sm">Left Track
            </b-button>

        <b-form-file ref="fileinput"  v-on:change="fileChosen" v-model="file" class="mt-3" plain></b-form-file>
            <b-button id="addTrack" size="sm" @click="addTrack()">Add Track
            </b-button>
        </b-button-group>   
        
        <div>
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
                    var newSong = {
                        title: this.file.name,
                        source: this.file
                    }
                    window.console.log(URL.createObjectURL(newSong))
                    newSong;
                    this.songs.push(newSong);
                   
                    this.$refs['fileinput'].reset()
                }
            },
            fileChosen(file) {
                EventBus.$emit("fileChosen", file);
            }
        }
        }
</script>

<style scoped>
#card{
    border-radius: 25px;
    width: 96%;
    height: 50%;
  
    margin-left: 2%;
    margin-right: 2%; 
}

#songlist{
    width: 50%;
    height: auto;
    float: right;
}

</style>