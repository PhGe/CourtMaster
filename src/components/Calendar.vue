<template>
    <div>
      <div class="week-range">{{ formatWeekRange }}</div>
      <div class="navigation">
        <el-button @click="prevWeek" plain>
          <i class="el-icon-arrow-left"></i> Previous Week
        </el-button>
        <el-button @click="nextWeek" plain>
          Next Week <i class="el-icon-arrow-right"></i>
        </el-button>
      </div>
  
      <el-row class="calendar">
        <el-col v-for="day in week" :key="day.date" :span="3">
          <div class="day">{{ day.name }}</div>
          <div
            v-for="hour in hours"
            :key="`${day.date}-${hour}`"
            class="time-slot"
            @click="bookHour(day.date, hour)"
          >
            {{ hour }}:00
          </div>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CalendarView',
    data() {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday

  return {
    initialStartOfWeek: new Date(startOfWeek),
    currentWeek: startOfWeek,
    week: [],
    hours: Array.from({ length: 13 }, (_, i) => i + 8), // 8:00 to 20:00
  };
},
    computed: {
    formatWeekRange() {
      const startOfWeek = new Date(this.currentWeek);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start from Sunday

      const startOfWeekFormatted = this.formatDate(startOfWeek);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6); // End on Saturday
      const endOfWeekFormatted = this.formatDate(endOfWeek);

      return `${startOfWeekFormatted} - ${endOfWeekFormatted}`;
    },
  },
    mounted() {
      this.renderCalendar();
    },
    methods: {
      renderCalendar() {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const startOfWeek = new Date(this.currentWeek);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start from Sunday
  
        this.week = Array.from({ length: 7 }, (_, i) => {
          const day = new Date(startOfWeek);
          day.setDate(startOfWeek.getDate() + i);
          return { name: days[i], date: day.toDateString() };
        });
      },
      bookHour(day, hour) {
        //TODO booking function in connection with database
        alert(`Booked on ${day} at ${hour}:00`);
      },
      prevWeek() {
        console.log("Prev week");
        const newDate = new Date(this.currentWeek);
        newDate.setDate(newDate.getDate() - 7);

        // Check if the new date is before the current date
        if (newDate >= this.initialStartOfWeek) {
            this.currentWeek = newDate;
            this.renderCalendar();
        }
        },
        nextWeek() {
        console.log("Next week");
        const newDate = new Date(this.currentWeek);
        newDate.setDate(newDate.getDate() + 7);

        // Check if the new date is before the current date
        if (newDate >= this.initialStartOfWeek) {
            this.currentWeek = newDate;
            this.renderCalendar();
        }
        },
      formatDate(date) {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
    },
  };
  </script>
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  /* Add your existing styling here */
  
  .week-range {
    text-align: center;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .el-row{
    justify-content: space-evenly;
    width: 100vh;
  }
  
  .navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  
  .calendar {
    margin: 0 auto;
  }
  
  .day {
    font-weight: bold;
    text-align: center;
    margin-bottom: 5px;
  }
  
  .time-slot {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: center;
    cursor: pointer;
    margin-bottom: 5px;
  }
  
  .time-slot:hover {
    background-color: #f0f0f0;
  }
  </style>