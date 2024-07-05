<template>
    <div class="main-container">
      <h2>Select Your Role</h2>
      <div class="homepage-role-section">
        <button @click="setRole('Host')" class="btn">Host</button>
        <button @click="navigateToRoom('Participant')" class="btn">Participant</button>
      </div>
      <div v-if="role === 'Host'" class="host-section">
        <h2>Host</h2>
        <form class="homepage-host-form" @submit.prevent="handleSubmitParti">
          <div class="homepage-form-group">
            <label for="meetingIDCreated">Meeting ID Created:</label>
            <input
              type="checkbox"
              id="meetingIDCreated"
              v-model="meetingIDCreated"
            />
          </div>
          <button type="submit" class="btn">Submit</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const role = ref('');
      const meetingIDCreated = ref(false);
      const router = useRouter();
  
      const navigateToRoom = (selectedRole) => {
        role.value = selectedRole;
        if (selectedRole === 'Participant') {
          router.push('/room');
        }
      };
  
      const setRole = (selectedRole) => {
        role.value = selectedRole;
      };
  
      const handleSubmitParti = () => {
        if (meetingIDCreated.value) {
          router.push('/room');
        } else {
          router.push('/host');
        }
      };
  
      return {
        role,
        meetingIDCreated,
        navigateToRoom,
        setRole,
        handleSubmitParti,
      };
    },
  };
  </script>
  
  <style scoped>
  .main-container {
    max-width: 600px;
    margin: 100px auto;
    padding: 40px;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    background-color: #f7f9fc;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  h2 {
    margin-bottom: 20px;
    color: #333;
  }
  
  .homepage-role-section {
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  
  .homepage-host-form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .homepage-form-group {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
  }
  
  label {
    margin-right: 10px;
    color: #333;
  }
  
  input[type='checkbox'] {
    margin-right: 10px;
  }
  
  .btn {
    padding: 10px 20px;
    margin-top: 20px;
    font-size: 14px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .btn:hover {
    background-color: #007bff;
  }
  </style>
  
