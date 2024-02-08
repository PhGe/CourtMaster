<template>
    <div class="booking-window"
      :style="{ top: topPosition + 'px', left: leftPosition + 'px' }"
      @mousedown="startDrag">
      <div class="booking-content">
        <h2>Buchen</h2>
        <p>Wähle einen Platz aus:</p>
        <div class="court-toggle">
          <button @click="toggleCourt(-1)">Previous</button>
          <span>{{ currentCourt }}</span>
          <button @click="toggleCourt(1)">Next</button>
        </div>
        <div v-if="currentTimeslots !== 'No timeslots available' ">
          <div class="form-group" v-for="timeSlot in currentTimeslots" :key="timeSlot">
            <input type="radio" :id="timeSlot" :value="timeSlot" v-model="selectedTimeSlot">
            <label :for="timeSlot">{{ timeSlot }}</label>
          </div>
        </div>
        <div v-else>
            No timeslots available
        </div>
        <div class="form-group">
          <button @click="confirmBooking">Confirm</button>
          <button @click="cancelBooking">Cancel</button>
        </div>
      </div>
    </div>
  </template>
  
  
  <script>
  import axios from 'axios';
  import { mapGetters } from 'vuex';
  
  export default {
    name: 'BookingWindow',
    props: {
    },
    data() {
      return {
        currentCourtIndex: 0,
        currentTimeslotIndex: 0,
        bookingTime: '',
        topPosition: 100,
        leftPosition: 100,
        isDragging: false,
        initialX: 0,
        initialY: 0,
        localCourts: [],
        TimeSlots: [],
        selectedTimeSlot: null,
        selectedDate: "2024-02-14",
        userId: null
      };
    },
    computed: {
     ...mapGetters(['getUserId']),
      currentCourt() {
        return this.localCourts.length > 0 ? this.localCourts[this.currentCourtIndex].court_name : 'No courts available';
      },
      currentTimeslots() {
    // Log for debugging purposes
    
    // Check if TimeSlots is defined and availableTimeSlots is an array
    if (this.TimeSlots?.availableTimeSlots && Array.isArray(this.TimeSlots.availableTimeSlots)) {
      // Log availableTimeSlots for debugging purposes
      // Return availableTimeSlots
      return this.TimeSlots.availableTimeSlots;
    } else {
      // Log a message if no time slots are available
      //console.log('No available time slots');
      // Return an empty array or null, depending on your application logic
      return [];
    }
      }
    },
    mounted() {
      this.getCourtData();
    },
    methods: {
      getCourtData() {
        const authToken = localStorage.getItem('authToken');
        axios.get('http://localhost:3000/courts/all', {
            headers: {
              'Authorization': authToken,
            }
          })
          .then(response => {
            this.localCourts = response.data;
            this.currentCourtIndex = Math.min(this.currentCourtIndex, this.localCourts.length - 1);
            const courtIds = response.data.map(({ court_id }) => court_id);
            this.fetchAvailableTimeSlots(courtIds);
          })
          .catch(error => {
            console.error('Error fetching court IDs:', error);
          });
      },
      fetchAvailableTimeSlots(courtIds) {
        const currentCourtId = courtIds[this.currentCourtIndex];
        const authToken = localStorage.getItem('authToken');
        //axios.get(`http://localhost:3000/courts/${courtIds[0]}/availability`, {
            axios.get(`http://localhost:3000/courts/${currentCourtId}/availability`, {
            headers: {
              'Authorization': authToken,
            }
          })
          .then(response => {
            this.TimeSlots = response.data;
            this.currentTimeslotIndex = Math.min(this.currentTimeslotIndex, this.TimeSlots.length - 1);
          })
          .catch(error => {
            console.error('Error fetching timeslots:', error);
          });
      },
      toggleCourt(direction) {
        if (direction === -1) {
          this.currentCourtIndex = (this.currentCourtIndex - 1 + this.localCourts.length) % this.localCourts.length;
        } else {
          this.currentCourtIndex = (this.currentCourtIndex + 1) % this.localCourts.length;
        }
        const courtIds = this.localCourts.map(({ court_id }) => court_id);
        this.fetchAvailableTimeSlots(courtIds);
      },
      confirmBooking() {
        const authToken = localStorage.getItem('authToken');
        if (this.selectedTimeSlot) {
        const bookingData = {
          userId: this.$store.getters.getUserId,
          date: this.selectedDate,
          time: this.selectedTimeSlot,
          courtId: this.localCourts[this.currentCourtIndex].court_id, // Include court ID based on your data structure
        };
        console.log(bookingData)
        // Send bookingData to backend using an HTTP POST request
        axios
          .post('http://localhost:3000/booking/book', bookingData, {
            headers: {
              'Authorization': authToken,
            }
          } )
          .then((response) => {
            // Handle successful booking
            console.log('Booking confirmed:', response.data);
            // Close booking window
            this.isBookingWindowOpen = false;
            // Update UI to reflect that the selected time slot is no longer available
            // You can remove the selected time slot from the available time slots array
          })
          .catch((error) => {
            // Handle booking error
            console.error('Error confirming booking:', error);
            // Close booking window
            this.isBookingWindowOpen = false;
          });
      } else {
        alert('Please select a time slot for your booking.');
      }
      },
      cancelBooking() {
        this.$emit('cancel');
      },
      startDrag(event) {
        this.isDragging = true;
        this.initialX = event.clientX - this.leftPosition;
        this.initialY = event.clientY - this.topPosition;
  
        window.addEventListener('mousemove', this.handleDrag);
        window.addEventListener('mouseup', this.stopDrag);
      },
      handleDrag(event) {
        if (this.isDragging) {
          this.leftPosition = event.clientX - this.initialX;
          this.topPosition = event.clientY - this.initialY;
        }
      },
      stopDrag() {
        this.isDragging = false;
        window.removeEventListener('mousemove', this.handleDrag);
        window.removeEventListener('mouseup', this.stopDrag);
      }
    }
  };
  </script>
  
  

  
  <style scoped>
  .booking-window {
    position: absolute;
    width: 300px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.9); /* Light opacity */
    z-index: 1000; /* Ensure it's on top of other elements */
    cursor: move; /* Change cursor to indicate draggability */
  }
  
  .booking-content {
    user-select: none; /* Prevent text selection during drag */
  }
  
  .form-group {
    margin-bottom: 10px;
  }
  
  .label {
    font-weight: bold;
  }
  
  input[type="date"],
  input[type="time"] {
    width: 100%;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
  }
  
  button {
    padding: 5px 10px;
    margin-right: 10px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
  
  .court-toggle {
    display: flex;
    align-items: center;
  }
  </style>
  