<!-- Subpage.vue -->
<template>
    <div>
      <h1>Login Successfull!</h1>
        <img src="../assets/Tennisball.png">
      <PlayerNames></PlayerNames>
    </div>
  </template>

  <script>
import PlayerNames from '@/components/PlayerNames.vue';

  export default {
    name: "SubpageView",
    components: { PlayerNames },
};
  </script>

  <style>
  img{
    width: 150px;
    height: 150px;
  }
</style>
  