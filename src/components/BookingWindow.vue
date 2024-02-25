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
      <iframe
      width="100%"
      height="300"
      frameborder="0"
      style="border:0"
      :src="getGoogleMapsUrl(currentLocation)"
      allowfullscreen
      loading="lazy">
    </iframe>
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
        <button @click="showConfirmationModal">Confirm</button>
        <ConfirmationModal v-if="showModal" @confirm="confirmBooking" @cancel="hideConfirmationModal" />
        <button @click="seasonalBooking">Seasonal Booking</button>
        <button @click="cancelBooking">Cancel</button>
      </div>
    </div>
  </div>
</template>



<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';
import ConfirmationModal from './ConfirmationModal.vue';

export default {
  components: {
    ConfirmationModal,
  },
  name: 'BookingWindow',
  props: {
    selectedDate: {
      type: String,
      default: ''
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
      bookingStatus: 'pending',
      availableTimeSlots: [],
      bookingsFetched: false,
      apiUrl: process.env.API_BASE_URL || 'https://court-master-e4c0d72c16c5.herokuapp.com/users/login',
      isConfirmingBooking: false,
      showModal: false,
    };
  },
  computed: {
    ...mapGetters(['getUserId', 'getAvailableTimeSlots']),
    currentCourt() {
      return this.localCourts.length > 0 ? this.localCourts[this.currentCourtIndex].court_name : 'No courts available';
    },
    currentLocation() {
      return this.localCourts.length > 0 ? this.localCourts[this.currentCourtIndex].location : 'No locations available';
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
    this.loadGoogleMapsApi();
  },
  methods: {
    ...mapActions(['updateAvailableTimeSlots']),
    
    async loadGoogleMapsApi() {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDOfwLpf7bLzn5b4_iHvvITnDWZW5qAV4M&libraries=geometry,places&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onload = this.initMap;
      document.head.appendChild(script);
    } else {
      this.initMap();
    }
  },
  initMap() {
    // Here you can initialize your map or perform any other actions related to Google Maps API
  }
,
    getGoogleMapsUrl(location) {
      // Encode the location string
      const encodedLocation = encodeURIComponent(location);
      
      // Construct the Google Maps URL with the encoded location
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyDOfwLpf7bLzn5b4_iHvvITnDWZW5qAV4M&q=${encodedLocation}&maptype=satellite`;
    },
    showConfirmationModal() {
      if (this.selectedTimeSlot) {
        this.showModal = true;
      }
    },
    hideConfirmationModal() {
      this.showModal = false;
    },
    async fetchBookings() {
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await axios.get(`${this.apiUrl}/booking/all`, {
          headers: {
            'Authorization': authToken,
          }
        })
        const bookings = response.data;
        console.log(bookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    },
    getCourtData() {
      const authToken = localStorage.getItem('authToken');
      axios.get(`${this.apiUrl}/courts/all`, {
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

      axios.get(`${this.apiUrl}/courts/${currentCourtId}/availability`, {
        headers: {
          'Authorization': authToken,
        }
      })
      .then(response => {
        this.TimeSlots = response.data;

        axios.get(`${this.apiUrl}/booking/availability`, {
          params: {
            courtId: currentCourtId,
            date: this.selectedDate,
          },
          headers: {
            'Authorization': authToken,
          }
        })
        .then(bookingResponse => {
          const bookedTimeSlots = bookingResponse.data;

          this.availableTimeSlots = this.TimeSlots.availableTimeSlots.map(slot => {
            const [startTime, endTime] = slot.split('-');
            const slotString = `${startTime}-${endTime}`;
            const bookingStatus = bookedTimeSlots.includes(slotString) ? 'confirmed' : 'available';

            return {
              startTime: startTime,
              endTime: endTime,
              booking_status: bookingStatus,
            };
          });

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
        this.isConfirmingBooking = true;
        const { startTime, endTime } = this.selectedTimeSlot;
        const bookingData = {
          userId: this.$store.getters.getUserId,
          date: this.selectedDate,
          time: `${startTime}-${endTime}`,
          courtId: this.localCourts[this.currentCourtIndex].court_id,
        };

        axios
          .post(`${this.apiUrl}/booking/book`, bookingData, {
            headers: {
              'Authorization': authToken,
            }
          })
          .then((response) => {
            console.log('Booking confirmed:', response.data);
            this.bookingStatus = 'confirmed';
            this.updateAvailableTimeSlots(this.selectedTimeSlot);
            this.availableTimeSlots = this.availableTimeSlots.filter(slot => slot !== this.selectedTimeSlot);
            this.selectedTimeSlot = null;
            this.isBookingWindowOpen = false;
            this.showModal = false;
          })
          .catch((error) => {
            console.error('Error confirming booking:', error);
            this.isBookingWindowOpen = false;
          })
          .finally(() => {
            this.isConfirmingBooking = false;
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
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 1000;
  cursor: move;
}

.booking-content {
  user-select: none;
}
.form-group {
  margin-bottom: 10px;
}

.form-group input[type="radio"] {
  display: none;
}

.form-group label {
  display: inline-block;
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease; /* Add border-color transition */
}

.form-group label:hover {
  background-color: #f0f0f0; /* Change background color on hover */
}

.form-group input[type="radio"]:checked + label {
  background-color: #007bff; /* Change background color for selected radio button */
  color: #fff; /* Change text color for selected radio button */
  border-color: #007bff; /* Change border color for selected radio button */
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

.el-radio-group {
  margin-top: 10px;
  text-align: center; /* Center the content */
}

.el-radio {
  margin-bottom: 5px;
}

/* Style for individual timeslots */
.input-wrapper {
  display: flex;
  align-items: center;
}

.input-wrapper input[type="radio"] {
  margin-right: 5px;
}

.label-wrapper {
  font-size: 14px;
  color: #333;
}

</style>

