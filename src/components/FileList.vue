<template>
    <b-card id="card" bg-variant="light" class="text-center">
        <div>
            <b-list-group size="sm" >
                <b-list-group-item id="songItem" v-bind:key="song.title" v-for="song in songs">
                    {{ song.title }}
                </b-list-group-item>

            </b-list-group>
        </div>
        <b-button-group vertical>
            <b-button id="putRight" @click="sendRight()" size="sm">Right Track
            </b-button>
            <b-button id="putLeft" @click="sendLeft()" size="sm">Left Track
            </b-button>

    <b-form-file ref="fileinput"  v-on:change="fileChosen" v-model="file2" class="mt-3" plain></b-form-file>
            <b-button id="addTrack" size="sm" @click="addTrack()">Add Track
            </b-button>
        </b-button-group>
    </b-card>
</template>

<script>

import {EventBus} from '../main.js';

export default {
    

    name: 'filelist',
    data () {
        return {
            file2: null,
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
            fileSystem: require('fs')
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
                if (this.file2) {
                    window.console.log(this.file2)
                    var newSong = {
                        title: this.file2.name,
                        source: this.file2.source
                    }
                    window.console.log(URL.createObjectURL(newSong))
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
  width: 46%;
  height: 50%;
  
  margin-left: 25%;
  margin-right: 25%; 
}

</style>