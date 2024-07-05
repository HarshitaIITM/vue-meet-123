<!-- <template>
  <div class="create-room-container">
    <div class="role-section">
      <div v-if="!isHostVerified">
        <div class="sign-in-title">Sign In</div>
        <form @submit.prevent="handleSubmitHost" class="host-form">
          <div class="form-group">
            <label class="labelstyle">
              Client Id:
              <input type="text" v-model="clientId" />
            </label>
          </div>
          <div class="form-group">
            <label class="labelstyle">
              Username:
              <input type="text" v-model="username" />
            </label>
          </div>
          <div class="form-group">
            <label class="labelstyle">
              Password:
              <input type="password" v-model="password" />
            </label>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
      <div v-else>
        <div v-if="!participantCreated">
          <div class="participant-title">Participant Details</div>
          <form @submit.prevent="handleSubmitParticipant" class="host-form">
            <div class="form-group">
              <label class="labelstyle">
                Participant Number:
                <input type="number" v-model.number="ParticipantNumber" />
              </label>
            </div>
            <div v-if="ParticipantNumber > 3">
              <h3>Number of Participants should be less than or equal to 3</h3>
            </div>
            <div v-else>
              <div
                v-for="(item, index) in parseInt(ParticipantNumber)"
                :key="index"
                class="form-group"
              >
                <label class="labelstyle">
                  Participant {{ index + 1 }} Name:
                  <input
                    type="text"
                    :value="participant[index + 1]"
                    @input="handleAddParticipant($event.target.value, index + 1)"
                  />
                </label>
              </div>
            </div>
            <button type="submit">Submit Details</button>
          </form>
        </div>
        <div v-else>
          <MeetingDetails :url="url" :participant="participant" :offerlist="offerlist" :meetlink="meetlink" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import config from '../config.json';
import MeetingDetails from '../components/MeetingDetails.vue';

const DSS_URL = config.DSS_URL || 'http://localhost:3000';
const URL = config.URL || 'http://localhost:8000';

export default {
  components: {
    MeetingDetails
  },
  data() {
    return {
      username: '',
      password: '',
      clientId: '',
      participantCreated: false,
      ParticipantNumber: 0,
      participant: [],
      isHostVerified: false,
      url: '',
      offerlist: [],
      meetlink: []
    };
  },
  mounted() {
    if (localStorage.getItem('validHostUser')) {
      this.isHostVerified = true;
      this.clientId = localStorage.getItem('clientID');
      this.username = localStorage.getItem('username');
      this.participant = [localStorage.getItem('username')];
    }
  },
  methods: {
    async handleSubmitHost(event) {
      try {
        event.preventDefault();
        let res = await axios.post(`${DSS_URL}/login`, { client_id: this.clientId, username: this.username, password: this.password });
        console.log(res.data);
        this.handleAddParticipant(this.username, 0);
        localStorage.setItem('validHostUser', 'true');
        localStorage.setItem('clientID', this.clientId);
        localStorage.setItem('username', this.username);
        this.isHostVerified = true;
        alert("Verification successful!");
      } catch (err) {
        alert("Invalid credentials!");
        console.log(err);
      }
    },
    async handleSubmitParticipant(event) {
      try {
        event.preventDefault();
        let response = await axios.post(`${URL}/createRoom`, { client_id: localStorage.getItem('clientID'), participant: this.participant, URL: URL });
        this.participantCreated = true;
        console.log(response.data);
        let id = response.data.roomID;
        let offerlist = response.data.offerlist;
        this.offerlist = offerlist;
        this.url = `${id}`;
        this.meetlink = response.data.meetlink;
      } catch (err) {
        console.log(err);
      }
    },
    handleAddParticipant(value, index) {
      let temp = [...this.participant];
      temp[index] = value;
      this.participant = temp;
    }
  }
};
</script>


<style scoped>
.create-room-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.role-section {
  margin-bottom: 20px;
}

.host-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 10px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type='text'],
input[type='password'] {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-sizing: border-box;
}

button {
  padding: 10px 20px;
  font-size: 14px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.sign-in-title, .participant-title {
  text-align: center;
  font-size: 20px;
}

.labelstyle {
  width: 100%;
  font-size: 14px;
}
</style> -->


<template>
  <div class="create-room-container">
    <div class="role-section">
      <div v-if="!isHostVerified">
        <div class="sign-in-title">Sign In</div>
        <form @submit.prevent="handleSubmitHost" class="host-form">
          <div class="form-group">
            <label class="labelstyle">
              Client Id:
              <input type="text" v-model="clientId" />
            </label>
          </div>
          <div class="form-group">
            <label class="labelstyle">
              Username:
              <input type="text" v-model="username" />
            </label>
          </div>
          <div class="form-group">
            <label class="labelstyle">
              Password:
              <input type="password" v-model="password" />
            </label>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
      <div v-else>
        <div v-if="!participantCreated">
          <div class="participant-title">Participant Details</div>
          <form @submit.prevent="handleSubmitParticipant" class="host-form">
            <div class="form-group">
              <label class="labelstyle">
                Participant Number:
                <input type="number" v-model.number="participantNumberInput" />
              </label>
            </div>
            <div v-if="ParticipantNumber > 3">
              <h3>Number of Participants should be less than or equal to 3</h3>
            </div>
            <div v-else>
              <div
                v-for="(item, index) in ParticipantNumber"
                :key="index"
                class="form-group"
              >
                <label class="labelstyle">
                  Participant {{ index + 1 }} Name:
                  <input
                    type="text"
                    :value="participant[index + 1]"
                    @input="handleAddParticipant($event.target.value, index + 1)"
                  />
                </label>
              </div>
            </div>
            <button type="submit">Submit Details</button>
          </form>
        </div>
        <div v-else>
          <MeetingDetails :url="url" :participant="participant" :offerlist="offerlist" :meetlink="meetlink" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import config from '../config.json';
import MeetingDetails from '../components/MeetingDetails.vue';

const DSS_URL = config.DSS_URL || 'http://localhost:3000';
const URL = config.URL || 'http://localhost:8000';

export default {
  components: {
    MeetingDetails
  },
  data() {
    return {
      username: '',
      password: '',
      clientId: '',
      participantCreated: false,
      participantNumberInput: 0,
      participant: [],
      isHostVerified: false,
      url: '',
      offerlist: [],
      meetlink: []
    };
  },
  computed: {
    ParticipantNumber() {
      let num = parseInt(this.participantNumberInput, 10);
      return isNaN(num) || num < 0 ? 0 : num;
    }
  },
  mounted() {
    if (localStorage.getItem('validHostUser')) {
      this.isHostVerified = true;
      this.clientId = localStorage.getItem('clientID');
      this.username = localStorage.getItem('username');
      this.participant = [localStorage.getItem('username')];
    }
  },
  methods: {
    async handleSubmitHost(event) {
      try {
        event.preventDefault();
        let res = await axios.post(`${DSS_URL}/login`, { client_id: this.clientId, username: this.username, password: this.password });
        console.log(res.data);
        this.handleAddParticipant(this.username, 0);
        localStorage.setItem('validHostUser', 'true');
        localStorage.setItem('clientID', this.clientId);
        localStorage.setItem('username', this.username);
        this.isHostVerified = true;
        alert("Verification successful!");
      } catch (err) {
        alert("Invalid credentials!");
        console.log(err);
      }
    },
    async handleSubmitParticipant(event) {
      try {
        event.preventDefault();
        let response = await axios.post(`${URL}/createRoom`, { client_id: localStorage.getItem('clientID'), participant: this.participant, URL: URL });
        this.participantCreated = true;
        console.log(response.data);
        let id = response.data.roomID;
        let offerlist = response.data.offerlist;
        this.offerlist = offerlist;
        this.url = `${id}`;
        this.meetlink = response.data.meetlink;
      } catch (err) {
        console.log(err);
      }
    },
    handleAddParticipant(value, index) {
      let temp = [...this.participant];
      temp[index] = value;
      this.participant = temp;
    }
  }
};
</script>

<style scoped>
.create-room-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.role-section {
  margin-bottom: 20px;
}

.host-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 10px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type='text'],
input[type='password'] {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-sizing: border-box;
}

button {
  padding: 10px 20px;
  font-size: 14px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.sign-in-title, .participant-title {
  text-align: center;
  font-size: 20px;
}

.labelstyle {
  width: 100%;
  font-size: 14px;
}
</style>

