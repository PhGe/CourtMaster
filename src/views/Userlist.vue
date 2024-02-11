<!-- Userlist.vue -->
<template>
  <div class="headerstyle">
    <Header></Header>
    </div>


    <div>
      <h1>Login Successfull!</h1>
        <img src="../assets/Tennisball.png">
      <PlayerNames></PlayerNames>
      <router-link to="/calendar" class="link">Calendar</router-link>
    </div>
  </template>

  <script>
import PlayerNames from '@/components/PlayerNames.vue';
import Header from '../components/Header.vue'
 // TODO: Nach Login landingpage kalender mit ausgegraut wenn belegt vor zurück zoomn // search bar cqalendar // profile / admin bereich / rechnungen betrag vereinsmitglieed/keinmitglied/ email/ termine/ stornieren /trainer maybee /paypal/vorOrtzahleenm
  export default {
    name: "UserListView",
    components: { PlayerNames,
    Header },
};
  </script>

  <style>
  img{
    width: 150px;
    height: 150px;
  }

  .links {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
  }
  
  .link {
    margin-bottom: 10px;
    padding: 10px;
    background-color: #3498db;
    color: #fff;
    text-decoration: none;
    border-radius: 5px;
    text-align: center;
    transition: background-color 0.3s;
  }
  
  .link:hover {
    background-color: #2980b9;
  }

  .headerstyle {
    display: flex;
    flex-direction: column;
    align-items: flex-end; /* Align items to the right side */
    padding: 20px;
  }
  
</style>
  