<!-- Userlist.vue -->
<template>
    <div>
      <h1>Login Successfull!</h1>
        <img src="../assets/Tennisball.png">
      <PlayerNames></PlayerNames>
    </div>
  </template>

  <script>
import PlayerNames from '@/components/PlayerNames.vue';
 // TODO: Nach Login landingpage kalender mit ausgegraut wenn belegt vor zurück zoomn // search bar cqalendar // profile / admin bereich / rechnungen betrag vereinsmitglieed/keinmitglied/ email/ termine/ stornieren /trainer maybee /paypal/vorOrtzahleenm
  export default {
    name: "UserListView",
    components: { PlayerNames },
};
  </script>

  <style>
  img{
    width: 150px;
    height: 150px;
  }
</style>
  