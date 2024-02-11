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

    <el-calendar ref="calendar"
      v-model="currentWeek"
      :first-day-of-week="0"
      @change="renderCalendar"
      @click="openBookingWindow"
    ></el-calendar>

    <!-- Booking Window Component -->
    <BookingWindow
      v-if="isBookingWindowOpen"
      :selectedDate="selectedDate"
      :userId="userId"
      @confirm="confirmBooking"
      @cancel="closeBookingWindow"
    />
  
  </div>
</template>
  
  <script>

import BookingWindow from './BookingWindow.vue';

  export default {
    name: 'CalendarComponent',
    components:{
      BookingWindow,
    },
    data() {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday
      
  
      return {
        initialStartOfWeek: new Date(startOfWeek),
        currentWeek: startOfWeek,
        week: [],
        hours: Array.from({ length: 13 }, (_, i) => i + 8), // 8:00 to 20:00
        isBookingWindowOpen: false, // Ensure this line is included
        selectedCourtId: null,
        selectedDate: null,
        userId: null,
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
      return { name: days[i], date: day }; // Modified to include Date object
    });
      },
      prevWeek() {
        console.log('Prev week');
        const newDate = new Date(this.currentWeek);
        newDate.setDate(newDate.getDate() - 7);
  
        // Check if the new date is before the current date
        if (newDate >= this.initialStartOfWeek) {
          this.currentWeek = newDate;
          this.renderCalendar();
        }
      },
      nextWeek() {
        console.log('Next week');
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
      // Method to open booking window when a date is clicked
      openBookingWindow() {
        if (!this.$refs.calendar) return;
        

        // Use the calendar instance to select today's date
        const selectedDate = this.$refs.calendar.selectedDay.$d;
        console.log(selectedDate)
        
         // Extract the necessary information from the selected date
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1; // Month is zero-based, so add 1
        const day = selectedDate.getDate();

        // Format the date as desired (e.g., YYYY-MM-DD)
        const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;

        // Pass the formatted date to your BookingWindow component
        this.selectedDate = formattedDate;
        console.log(this.selectedDate)
        // Open the booking window
        this.isBookingWindowOpen = true;
      },
    // Method to close booking window
    closeBookingWindow() {
      this.isBookingWindowOpen = false;
      //this.$forceUpdate();
    },
  },
};
  </script>
  
  <style scoped>
  /* Add your existing styling here */
  
  .week-range {
    text-align: center;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  
  .calendar {
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(7, 1fr); /* Initially display days in a row */
    gap: 1px;
  }
  
  .el-row {
    justify-content: space-evenly;
    width: 100%;
  }
  
  .el-col-3 {
    max-width: none;
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
  
  /* Media query for responsiveness */
  @media screen and (max-width: 768px) {
    .calendar {
      grid-template-columns: repeat(2, 1fr); /* Display days in a column for small screens */
    }
  }
  </style>
  