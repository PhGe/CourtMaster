<template>
    <div class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-content">
          <p>Are you sure you want to confirm?</p>
          <button @click="confirm">Confirm</button>
          <button @click="cancel">Cancel</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      confirm() {
        this.$emit('confirm');
      },
      cancel() {
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
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  /* Style the modal dialog */
  .modal-dialog {
    background-color: white;
    border-radius: 5px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
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
  </style>
  