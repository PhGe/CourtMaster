<template>
    <div class="booking-window"
      :style="{ top: topPosition + 'px', left: leftPosition + 'px' }"
      @mousedown="startDrag">
      <p>Selected Date: {{ selectedDate }}</p>
      <div class="booking-content">
        <h2>Buchen</h2>
        <div v-if="bookingStatus === 'pending'">
            <p>Booking Status: Pending</p>
          </div>
          <div v-else-if="bookingStatus === 'confirmed'">
            <p>Booking Status: Confirmed</p>
          </div>
        <p>Wähle einen Platz aus:</p>
        <div class="court-toggle">
          <button @click="toggleCourt(-1)">Previous</button>
          <span>{{ currentCourt }}</span>
          <button @click="toggleCourt(1)">Next</button>
        </div>
        <div v-if="currentTimeslots !== 'No timeslots available'">
            <div class="form-group" v-for="timeSlot in currentTimeslots" :key="timeSlot.startTime">
                <input type="radio" :id="timeSlot.startTime" :value="timeSlot" v-model="selectedTimeSlot">
                <label :for="timeSlot.startTime">{{ timeSlot.startTime }} - {{ timeSlot.endTime }}</label>
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
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    name: 'BookingWindow',
    props: {
        selectedDate: { // Define selectedDate as a prop
      type: String, // Change the type if necessary based on your data type
      default: '' // Set a default value if needed
    }
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
        userId: null,
        bookingStatus: 'pending', // Initialize booking status
        availableTimeSlots: [],
        bookingsFetched: false
      };
    },
    computed: {
     ...mapGetters(['getUserId', 'getAvailableTimeSlots']),
      currentCourt() {
        return this.localCourts.length > 0 ? this.localCourts[this.currentCourtIndex].court_name : 'No courts available';
      },
      currentTimeslots() {
        if (this.availableTimeSlots && Array.isArray(this.availableTimeSlots)) {
            const filteredTimeSlots = this.availableTimeSlots.filter(slot => slot.booking_status !== 'confirmed');
            return filteredTimeSlots;
        } else {
            return [];
        }
        }
    },
    mounted() {
      this.getCourtData();
      this.fetchBookings();
    },
    methods: {
        ...mapActions(['updateAvailableTimeSlots']), // Add action for updating availableTimeSlots
        async fetchBookings() {
      try {
        // Fetch bookings data from the backend
        const authToken = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:3000/booking/all', {
            headers: {
              'Authorization': authToken,
            }
          })
        const bookings = response.data;
        console.log(bookings)
        // Filter out confirmed bookings
        console.log("Timeslots:" + this.availableTimeSlots)
        console.log('Bookings fetched:', bookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    },
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

    // Fetch time slots from court_time_slots
    axios.get(`http://localhost:3000/courts/${currentCourtId}/availability`, {
        headers: {
        'Authorization': authToken,
        }
    })
    .then(response => {
        this.TimeSlots = response.data;
        console.log(this.TimeSlots)

        // Fetch bookings for the selected court and date
        axios.get(`http://localhost:3000/booking/availability`, {
        params: {
            courtId: currentCourtId,
            date: this.selectedDate,
        },
        headers: {
            'Authorization': authToken,
        }
        })
        .then(bookingResponse => {
            console.log(bookingResponse)
            const bookedTimeSlots = bookingResponse.data;

            console.log(bookedTimeSlots)

            this.availableTimeSlots = this.TimeSlots.availableTimeSlots.map(slot => {
                const [startTime, endTime] = slot.split('-');
                const slotString = `${startTime}-${endTime}`;
                console.log(slot.startTime)
                console.log("Constructed slotString:", slotString);
                console.log("SLOT:  "+slot);
                const bookingStatus = bookedTimeSlots.includes(slotString) ? 'confirmed' : 'available';
                console.log("Comparing time slots:", slotString, bookedTimeSlots.includes(slotString));

                console.log(bookingStatus)
                return {
                    startTime: startTime,
                    endTime: endTime,
                    booking_status: bookingStatus,
                };
            });
            // Filter out the confirmed bookings
            console.log(this.availableTimeSlots)
            const filteredTimeSlots = this.availableTimeSlots.filter(slot => slot.booking_status !== 'confirmed');
            console.log(filteredTimeSlots)
           // const availableTimeSlots = filteredTimeSlots.map(slot => slot.time_slot);
            //console.log(availableTimeSlots)
           // this.availableTimeSlots = availableTimeSlots;
            this.currentTimeslotIndex = Math.min(this.currentTimeslotIndex, this.TimeSlots.length - 1);
        })
        .catch(error => {
            console.error('Error fetching bookings:', error);
        });
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
        const { startTime, endTime } = this.selectedTimeSlot;
        const bookingData = {
          userId: this.$store.getters.getUserId,
          date: this.selectedDate,
          time: `${startTime}-${endTime}`, // Combine startTime and endTime into a string
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
            this.bookingStatus = 'confirmed';
            this.updateAvailableTimeSlots(this.selectedTimeSlot); // Dispatch action to update available time slots
            console.log(this.availableTimeSlots)
            this.availableTimeSlots = this.availableTimeSlots.filter(slot => slot !== this.selectedTimeSlot);
            console.log(this.availableTimeSlots)
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
  