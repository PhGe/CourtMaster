<template>
    <div class="modal-overlay" v-if="showModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <p v-if="!confirmed">Are you sure you want to cancel?</p>
            <p class="confirm" v-if="confirmed">
              <el-icon :size="50" color="green" style="margin-right: 10px" >
                <SuccessFilled />
              </el-icon>
              Booking is canceled!
            </p>
          <button v-if="!confirmed" @click="confirm">Confirm</button>
          <button v-if="!confirmed" @click="cancel">Cancel</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        showModal: true,
        confirmed: false
      };
    },
    methods: {
      confirm() {
        this.confirmed = true;
        this.$emit('confirm');
      },
      cancel() {
        this.showModal = false;
        this.$emit('cancel');
      },
    },
  };
  </script>
  
  <style scoped>
  /* Style the modal overlay */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1); /* Semi-transparent black */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999; /* Ensure modal is above other content */
  }
  
  /* Style the modal dialog */
  .modal-dialog {
    background-color: white;
    border-radius: 5px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  }
  
  /* Style the modal content */
  .modal-content {
    text-align: center;
  }
  
  /* Style the buttons */
  button {
    padding: 8px 16px;
    margin: 0 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .confirm {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  </style>
  