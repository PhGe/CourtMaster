<template>
    <div class="court-container">
      <!-- Display existing courts -->
      <div
      v-for="court in courts"
      :key="court.court_id"
      class="court-item"
      @click="toggleCourtDetails(court)"
      :class="{ 'expanded': court.expanded }"
    >
    <div class="court-name">
      <strong>{{ court.court_name }}</strong>
    </div>
        <div v-if="court.expanded" class="court-details">
          <div>
            <p><strong>Court Name:</strong> {{ court.court_name }}</p>
            <p><strong>Court ID:</strong> {{ court.court_id }}</p>
            <p><strong>Court Type:</strong> {{ court.court_type }}</p>
            <p><strong>Created At:</strong> {{ court.created_at }}</p>
            <p><strong>Location:</strong> {{ court.location }}</p>
            <p><strong>Capacity:</strong> {{ court.capacity }}</p>
            <p><strong>Available:</strong> {{ court.available ? 'Yes' : 'No' }}</p>
            <div class="timeslots-container">
                <p><strong>Timeslots:</strong></p>
                <div class="timeslots">
                  <el-tag v-for="(slot, index) in formattedTimeSlots(court.timeSlots)" :key="index">{{ slot }}</el-tag>
                </div>
              </div>
          </div>
          <!-- Court action buttons -->
          <div class="court-actions">
            <el-button type="primary" @click="editCourt(court)">Edit</el-button>
            <el-button type="danger" @click="deleteCourt(court)">Delete</el-button>
          </div>
        </div>
      </div>
      


      <div v-if="isEditing" class="court-card">
        <div class="court-card-header">
            <h3>Edit Court {{ editedCourt.court_name }}</h3>
            <button class="close-button" @click="closeEditCard">X</button>
        </div>
        <div class="court-card-content">
            <el-form ref="editForm" :model="editedCourt" label-width="100px" class="court-form">
                <el-form-item label="Court Name" class="court-form-item">
                <el-input v-model="editedCourt.court_name"></el-input>
                </el-form-item>
                <el-form-item label="Court Type" class="court-form-item">
                <el-input v-model="editedCourt.court_type"></el-input>
                </el-form-item>
                <el-form-item label="Location" class="court-form-item">
                <el-input v-model="editedCourt.location"></el-input>
                </el-form-item>
                <el-form-item label="Capacity" class="court-form-item">
                <el-input v-model.number="editedCourt.capacity" type="number"></el-input>
                </el-form-item>
                <el-form-item label="Available" class="court-form-item">
                <el-checkbox v-model="editedCourt.available">Available</el-checkbox>
                </el-form-item>
                <div class="timeslots-container">
                    <p><strong>Timeslots:</strong></p>
                    <div class="timeslots">
                      <el-tag v-for="(slot, index) in formattedTimeSlots(editedCourt.timeSlots)" 
                        :key="index" 
                        @click="toggleTimeslotSelection(slot)"
                        :class="{ 'selected-timeslot': isSelectedTimeslot(slot) }">
                        {{ slot }}
                      </el-tag>
                    </div>
                  </div>
                  <el-button type="primary" class="update-court-btn" @click="updateCourt">Update Court</el-button>
                  <div class="timeslot-input">
                    <label for="startHour">Start Time:</label>
                    <select v-model="newTimeslot.startHour" id="startHour">
                      <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}</option>
                    </select>
                    :
                    <select v-model="newTimeslot.startMinute" id="startMinute">
                      <option v-for="minute in minutes" :key="minute" :value="minute">{{ minute }}</option>
                    </select>
                  </div>
                  
                  <div class="timeslot-input">
                    <label for="endHour">End Time:</label>
                    <select v-model="newTimeslot.endHour" id="endHour">
                      <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}</option>
                    </select>
                    :
                    <select v-model="newTimeslot.endMinute" id="endMinute">
                      <option v-for="minute in minutes" :key="minute" :value="minute">{{ minute }}</option>
                    </select>
                  </div>
                  
                  <el-button type="primary" @click="addNewTimeslot(editedCourt)">Add Timeslot</el-button>
                  
                  <!-- Other form fields and buttons -->
                </el-form>
        </div>
    </div>
    <el-button id="CreateButton" type="primary" @click="toggleCreateForm">Create New Court</el-button>
    <div v-if="isCreating" class="court-card">
      
        <div class="court-card-header">
            <h3>Create New Court</h3>
            <button class="close-button" @click="closeCreateCard">X</button>
        </div>
        <div class="court-card-content">
            <el-form ref="courtForm" :model="newCourt" label-width="100px" class="court-form">
                <!-- Form fields -->
                <el-form-item label="Court Name" class="court-form-item">
                  <el-input v-model="newCourt.court_name"></el-input>
                </el-form-item>
                <el-form-item label="Court Type" class="court-form-item">
                  <el-input v-model="newCourt.court_type"></el-input>
                </el-form-item>
                <el-form-item label="Location" class="court-form-item">
                  <el-input v-model="newCourt.location"></el-input>
                </el-form-item>
                <el-form-item label="Capacity" class="court-form-item">
                  <el-input v-model.number="newCourt.capacity" type="number"></el-input>
                </el-form-item>
                <el-form-item label="Available" class="court-form-item">
                  <el-checkbox v-model="newCourt.available">Available</el-checkbox>
                </el-form-item>
                <el-button type="primary" class="create-court-btn" @click="createCourt">Confirm Creation</el-button>
              </el-form>
        </div>
    </div>
    </div>

  </template>
  
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'CourtsManagement',
    data() {
      return {
        courts: [],
        newCourt: {
          court_name: '',
          court_type: '',
          location: '',
          capacity: null,
          available: false,
        },
        editedCourt: {
        court_name: '',
        court_type: '',
        location: '',
        capacity: null,
        available: false,
      },
      newTimeslot: {
      startHour: '00',
      startMinute: '00',
      endHour: '00',
      endMinute: '00'
      },
      hours: [],
      minutes: ['00', '30'],
      isEditing: false,
      isCreating: false,
      selectedTimeslots: [], // Array to hold selected timeslots
      apiUrl: process.env.API_BASE_URL || 'https://court-master-e4c0d72c16c5.herokuapp.com' // Default to localhost
      }
    },
    created() {
    this.hours = Array.from({ length: 24 }, (_, index) => index.toString().padStart(2, '0'));
      this.fetchCourts();
    },
    methods: {
      closeEditCard() {
      this.isEditing = false;
      },
      closeCreateCard() {
      this.isCreating = false;
      },
      async fetchCourts() {
        try {
          const authToken = localStorage.getItem('authToken');
          const response = await axios.get(`${this.apiUrl}/courts/all`, {
            headers: {
              'Authorization': authToken,
            }
          });
          this.courts = response.data.map(court => ({
          ...court,
          expanded: false, // Initially set to false to hide details
        }));
          console.log(this.courts);
        } catch (error) {
          console.error('Error fetching courts:', error);
        }
      },
      toggleCourtDetails(clickedCourt) {
      // Toggle the expanded state of the clicked court
      this.courts = this.courts.map(court => ({
        ...court,
        expanded: court === clickedCourt ? !court.expanded : false,
      }));
    },
      async editCourt(court) {
    try {
      // Fetch court details based on court ID
      const authToken = localStorage.getItem('authToken');
      console.log(court.court_id)
      const response = await axios.get(`${this.apiUrl}/courts/all/${court.court_id}`,{
      headers: {
        'Authorization': authToken,
      },
    });
      this.editedCourt = response.data;
      console.log(this.editedCourt)
      console.log(this.editedCourt.court_name)
      this.isEditing = !this.isEditing;
      

    } catch (error) {
      console.error('Error fetching court details for editing:', error);
    }
      },
      async updateCourt() {
    try {
    const authToken = localStorage.getItem('authToken');
    const unselectedTimeslots = this.editedCourt.timeSlots.filter(slot => this.selectedTimeslots.includes(slot));

    await axios.post(`${this.apiUrl}/courts/delete-timeslots/${this.editedCourt.court_id}`, { unselectedTimeslots }, {
            headers: {
                'Authorization': authToken,
            }
        });

    console.log("UNSELECTED:   " +unselectedTimeslots)

    await axios.put(`${this.apiUrl}/courts/edit/${this.editedCourt.court_id}`, this.editedCourt, {
      headers: {
        'Authorization': authToken,
      }
    });
    // Clear form and fetch updated list of courts
    this.editedCourt = {
      court_name: '',
      court_type: '',
      location: '',
      capacity: null,
      available: false,
      timeSlots: [], 
    };
    this.selectedTimeslots = [];
    this.$refs.editForm.resetFields(); // Reset form fields
    this.fetchCourts(); // Fetch updated courts list
    this.isEditing = false; // Close the edit court card after updating
  } catch (error) {
    console.error('Error updating court details:', error);
  }
      },
      async deleteCourt(court) {
        try {
          const authToken = localStorage.getItem('authToken');
          console.log("Delete Court: " + court);
          console.log("Delete Court: " + court.court_id);
          await axios.delete(`${this.apiUrl}/courts/delete/${court.court_id}`,
          {
            headers: {
            'Authorization': authToken,
        },
          });
          this.fetchCourts(); // Refresh court list after deletion
        } catch (error) {
          console.error('Error deleting court:', error);
        }
      },
      async createCourt() {
        try {
        const authToken = localStorage.getItem('authToken');
          await axios.post(`${this.apiUrl}/courts/new`,  this.newCourt , {
            headers: {
              'Authorization': authToken,
            }
          });
          // Clear form and fetch updated list of courts
          this.newCourt = {
            court_name: '',
            court_type: '',
            location: '',
            capacity: null,
            available: false,
          };
          this.$refs.courtForm.resetFields(); // Reset form fields
          this.fetchCourts(); // Fetch updated courts list
          this.isCreating = false; // Close the create court form after creation
        } catch (error) {
          console.error('Error creating new court:', error);
        }
      },
      toggleCreateForm() {
    // Close the edit court card if it was open
    if (this.isCreating) {
        this.isCreating = false;
    } else {
        this.isCreating = true;
    }
    // Close the create court card if it was open
    if (this.isEditing) {
        this.isEditing = false;
    }
      },
      formattedTimeSlots(timeSlots) {
      if (!Array.isArray(timeSlots)) return [];

      return timeSlots.map(slot => {
        const [start, end] = slot.split('-');
        return `${start}-${end}`;
      });
      },
      toggleTimeslotSelection(timeslot) {
      // Check if the timeslot is already selected
      const index = this.selectedTimeslots.indexOf(timeslot);
      if (index !== -1) {
        // Timeslot is already selected, so remove it
        this.selectedTimeslots.splice(index, 1);
      } else {
        // Timeslot is not selected, so add it
        this.selectedTimeslots.push(timeslot);
      }
      },
      isSelectedTimeslot(timeslot) {
      // Check if the timeslot is selected
      return this.selectedTimeslots.includes(timeslot);
      },
      addNewTimeslot(court) {
    const { startHour, startMinute, endHour, endMinute } = this.newTimeslot;

    // Check if start time is equal to end time
    if (startHour === endHour && startMinute === endMinute) {
        alert("Start time cannot be equal to end time");
        return;
    }

    const newTimeslotString = `${startHour}:${startMinute}:00-${endHour}:${endMinute}:00`;

    // Check if the new timeslot already exists for the court
    if (court.timeSlots.includes(newTimeslotString)) {
        alert("This timeslot already exists for the court.");
        return;
    }

    // Check if the new timeslot conflicts with existing timeslots
    const conflictsExist = court.timeSlots.some(slot => {
        const [existingStart, existingEnd] = slot.split('-');
        const [newStart, newEnd] = newTimeslotString.split('-');
        
        return (
            (newStart >= existingStart && newStart < existingEnd) || // New timeslot starts within existing timeslot
            (newEnd > existingStart && newEnd <= existingEnd) ||     // New timeslot ends within existing timeslot
            (newStart <= existingStart && newEnd >= existingEnd)     // New timeslot fully encompasses existing timeslot
        );
    });

    if (conflictsExist) {
        alert("The new timeslot conflicts with existing timeslots.");
        return;
    }

    // Add the new timeslot to the editedCourt object
    this.editedCourt.timeSlots.push(newTimeslotString);

    // Make the API call to add the timeslot
    const authToken = localStorage.getItem('authToken');
    axios.post(`${this.apiUrl}/courts/add-timeslots/${court.court_id}`, {
            startTime: `${startHour}:${startMinute}:00`,
            endTime: `${endHour}:${endMinute}:00`
        }, {
            headers: {
                'Authorization': authToken,
            }
        })
        .then(response => {
            this.fetchCourts(); // Fetch updated courts list
            console.log("Timeslot added successfully:", response.data);
            console.log(this.editedCourt);
        })
        .catch(error => {
            console.error("Error adding timeslot:", error);
            // Handle the error as needed
        });
    },

    },

    };
  </script>
  
  <style scoped>
  .edit-court-card {
    position: relative;
    margin-top: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f0f0f0;
    padding: 15px;
  }
  .close-button {
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
    background: transparent;
    border: none;
    font-size: 18px;
    color: #999;
  }
  
  .close-button:hover {
    color: #666;
  }

  .court-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .court-item {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 200px; /* Adjust width as needed */
    text-align: center;
  }
  
  .court-item.expanded {
    width: 100%; /* Expanded width */
  }
  
  .court-name {
    font-weight: bold;
  }
  
  .court-details {
    margin-top: 10px;
    /* Include additional styling for court details */
  }
  .selected-timeslot {
    background-color: #409EFF; /* Add a different background color for selected timeslots */
    color: #fff; /* Change text color for better visibility */
    cursor: pointer; /* Change cursor to indicate it's clickable */
  }
  .court-container {
      padding: 20px;
  }
  
  .court-item {
      margin-bottom: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
      background-color: #f9f9f9;
      padding: 15px;
      width: 100%;
  }
  
  .court-details {
      display: flex;
      flex-direction: column; /* For mobile layout, change to column */
  }
  
  .court-actions {
      display: flex;
      justify-content: space-around; /* Adjust as needed */
      margin-top: 10px; /* Add some spacing */
  }
  
  .court-card {
      margin-top: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
      background-color: #f0f0f0;
      padding: 15px;
      width: 100%;
  }
  
  .court-card-header {
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #ccc;
      position: relative;
  }
  
  .court-card-header h3 {
      margin: 0;
      font-size: 18px;
  }
  
  .court-card-content {
      width: 100%;
  }
  
  .court-form {
      margin-top: 20px;
  }
  
  .court-form-item {
      margin-bottom: 15px;
  }
  
  .update-court-btn,
  .create-court-btn {
      margin-top: 15px;
  }
  
  /* Media Query for Mobile Devices */
  @media only screen and (max-width: 600px) {
      .court-details {
          flex-direction: column; /* Change to column layout for mobile */
      }
  
      .court-actions {
          flex-direction: column; /* Change to column layout for mobile */
          justify-content: center; /* Center align for mobile */
          align-items: center; /* Center align for mobile */
      }
  
      .court-card {
          padding: 10px; /* Adjust padding for mobile */
      }
  
      .court-card-content {
          width: 100%;
      }
  
      .court-form-item {
          margin-bottom: 10px; /* Adjust margin for mobile */
      }
  
      .update-court-btn,
      .create-court-btn {
          margin-top: 10px; /* Adjust margin for mobile */
      }
  }
  .timeslots-container {
    margin-top: 10px;
  }
  
  .timeslots {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .el-tag {
    margin-right: 5px;
    margin-bottom: 5px;
  }

  .timeslot-input {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }

  .timeslot-input label {
    margin-right: 10px;
    font-weight: bold;
  }

  .timeslot-input select {
    padding: 6px 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .timeslot-input select:focus {
    outline: none;
    border-color: #409EFF;
  }

  .timeslot-input select option {
    background-color: white;
  }

  .timeslot-input select:hover {
    border-color: #409EFF;
  }

  .timeslot-input select:active {
    border-color: #409EFF;
  }

  .timeslot-input select::-ms-expand {
    display: none;
  }

  .timeslot-input select::-webkit-inner-spin-button,
  .timeslot-input select::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .timeslot-input select::-webkit-calendar-picker-indicator {
    display: none;
  }

  .timeslot-input select::-webkit-clear-button {
    display: none;
  }

  .timeslot-input select::-ms-clear {
    display: none;
  }

  .timeslot-input select::-moz-placeholder {
    color: #999;
  }

  .timeslot-input select:-ms-input-placeholder {
    color: #999;
  }

  .timeslot-input select::-webkit-input-placeholder {
    color: #999;
  }

  .timeslot-input select:-moz-placeholder {
    color: #999;
  }

  #CreateButton{
    margin-top: 20px;
  }
  </style>
  