  <template>
    <div class="container">
      <div v-if="validCheck">
        <MeetingRooms :checked="checked" :meetingID="meetingID" :username="username" />
      </div>
      <div v-else>
        <FormContainer>
          <Form @submit.prevent="handleSubmitform">
            <Label>Meeting ID:</Label>
            <Input
              type="text"
              v-model="meetingID"
            />
            <Label>Role:</Label>
            <Select v-model="role">
              <option value="host">Host</option>
              <option value="participant">Participant</option>
            </Select>
  
            <template v-if="role === 'host'">
              <Label>Username:</Label>
              <Input
                type="text"
                v-model="username"
              />
              <template v-if="typeof localStorage == 'undefined'">
                <Label>Client ID:</Label>
                <Input
                  type="text"
                  v-model="clientID"
                />
              </template>
              <Label>Password:</Label>
              <Input
                type="password"
                v-model="password"
              />
            </template>
  
            <template v-else>
              <Label>Username:</Label>
              <Input
                type="text"
                v-model="username"
              />
            </template>
  
            <Label>Offer:</Label>
            <Input
              type="text"
              v-model="offer"
            />
            <Button type="submit">Join Meet</Button>
          </Form>
        </FormContainer>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import styled from 'vue3-styled-components';
  import MeetingRooms from "../components/MeetingRooms.vue";
  
  const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #f0f2f5;
    padding: 20px;
  `;
  
  const Form = styled.form`
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
  `;
  
  const Label = styled.label`
    margin-bottom: 5px;
    font-weight: bold;
  `;
  
  const Input = styled.input`
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    width: calc(100% - 22px); /* Adjust for padding and borders */
    box-sizing: border-box; /* Ensures padding and border are included in width */
  `;
  
  const Select = styled.select`
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    width: 100%;
  `;
  
  const Button = styled.button`
    padding: 12px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
  
    &:hover {
      background-color: #0056b3;
    }
  `;
  
  export default {
    components: {
      MeetingRooms,
      FormContainer,
      Form,
      Label,
      Input,
      Select,
      Button
    },
    setup() {
      const route = useRoute();
      const meetingID = ref("");
      const offer = ref("");
      const clientID = ref("");
      const validCheck = ref(false);
      const checked = ref(false);
      const username = ref("");
      const password = ref("");
      const dob = ref("");
      const role = ref("host");
  
      const getQueryParams = (search) => new URLSearchParams(search);
  
      onMounted(() => {
        const queryParams = getQueryParams(route.query);
        if (queryParams.get('mID') && queryParams.get('oID')) {
          queryParams.get('t')?.toLowerCase() === 'p' ? role.value = 'participant' : role.value = 'host';
          meetingID.value = queryParams.get('mID');
          offer.value = queryParams.get('oID');
        }
  
        if(localStorage.getItem('clientID')){
          const clientIDFromStorage = localStorage.getItem('clientID');
          if (clientIDFromStorage) {
            clientID.value = clientIDFromStorage;
          }
        }
  
        if(localStorage.getItem('username')){
          const usernameFromStorage = localStorage.getItem('username');
          if (usernameFromStorage) {
            username.value = usernameFromStorage;
          }
        }
      });
  
      const handleSubmitform = async (e) => {
        e.preventDefault();
        try {
          if (role.value === 'host') {
            validCheck.value = true;
            checked.value = true;
            localStorage.setItem('clientID', clientID.value);
          } else {
            validCheck.value = true;
            checked.value = true;
          }
        } catch {
          console.log("error")
        }
      }
  
      return {
        meetingID,
        offer,
        clientID,
        validCheck,
        checked,
        username,
        password,
        dob,
        role,
        handleSubmitform
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f0f2f5;
  }
  </style>
  