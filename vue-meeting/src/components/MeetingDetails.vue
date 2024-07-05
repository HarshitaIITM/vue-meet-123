<template>
    <div>
      <div ref="detailsRef">
        <div style="text-align: center; font-size: 20px; font-weight: bold;">
          Meeting ID: {{ url }}
        </div>
        <div>Participant Details:</div>
        <div v-for="(item, index) in participant" :key="index">
          <div>Participant {{ index + 1 }} Name: {{ item }}</div>
          <div>Offer: {{ offerlist[index] }}</div>
          <div>
            Meetlink: 
            <a :href="meetlink[index]" style="cursor: pointer; text-decoration: underline; color: blue;">
              {{ meetlink[index] }}
            </a>
          </div>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 20px;">
        <button @click="copyToClipboard" style="padding: 10px 20px; font-size: 16px;">
          Copy Details
        </button>
        <button @click="gotoHome" style="padding: 10px 20px; font-size: 16px;">
          Home
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import { mapMutations } from 'vuex';

  export default {
    props: {
      url: {
        type: String,
        required: true
      },
      participant: {
        type: Array,
        required: true
      },
      offerlist: {
        type: Array,
        required: true
      },
      meetlink: {
        type: Array,
        required: true
      }
    },
    computed:{
      // ...mapMutations("store",['updateValue']),
    },
    created() {
      // this.updateValue(this.participant);
    },
    methods: {
      copyToClipboard() {
        // const detailsDiv = this.$refs.detailsRef;
        let detailsText = `Meeting ID: ${this.url}\nParticipant Details:\n`;
        this.participant.forEach((item, index) => {
          detailsText += `\nParticipant ${index + 1} Name: ${item}\n`;
          detailsText += `Offer: ${this.offerlist[index]}\n`;
          detailsText += `Meetlink: ${this.meetlink[index]}\n`;
        });
        navigator.clipboard.writeText(detailsText)
          .then(() => {
            alert('Details copied to clipboard!');
          })
          .catch(err => {
            console.error('Failed to copy details: ', err);
          });
      },
      gotoHome() {
        window.location.href = '/';
      }
    }
  }
  </script>
  
  <style scoped>
  /* Add any scoped styles if needed */
  </style>
  