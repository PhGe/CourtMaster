<template>
  <Header></Header>
    <div class="calendarDiv">
      <h1>Calendar</h1>
      <calendar></calendar>
  </div>
</template>

  <script>
  import calendar from '../components/Calendar.vue'
  import Header from '../components/Header.vue'
  
  export default {
    name: 'CalendarView',
    components: {
      calendar,
      Header
    },
  };
  </script>


<style scoped>


.calendarDiv {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
</style>