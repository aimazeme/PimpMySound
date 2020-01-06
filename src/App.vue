<template>
  <div id="app">
    
    <PimpMySound msg="Welcome to Pimp My Sound"/>
    <FileInput/>
    <FileInput/>
    <CrossFader/>
    <VolumeSlider/>

  </div>
</template>

<script>
import PimpMySound from './components/PimpMySound.vue'
import FileInput from './components/FileInput.vue'
import CrossFader from './components/Crossfader.vue'
import VolumeSlider from './components/VolumeSlider.vue'

export default {
  name: 'app',
  components: {
    PimpMySound, FileInput, CrossFader, VolumeSlider
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
</style>
