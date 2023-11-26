<template>
    <img alt="Vue logo" src="../assets/Tennisball.png">
    <HelloWorld msg="Welcome Tennis players du looser !!!!!!!"/>
    <PlayerNames/>
  </template>
  
  <script>
  import HelloWorld from '../components/HelloWorld.vue';
  import PlayerNames from '../components/PlayerNames.vue';
  
  
  export default {
    name: 'App',
    components: {
      HelloWorld,
      PlayerNames
  }
  }
  </script>
  
  <style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    
  }
  img{
    width: 150px;
    height: 150px;
  }
  </style>
  