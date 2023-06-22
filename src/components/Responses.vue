<script setup>
import { storeToRefs } from 'pinia';
import Slave from './Slave.vue';
import { useResponsesShowing } from '../stores/responsesShowing'
import { useUser } from '../stores/user';

let { showing, responses } = storeToRefs(useResponsesShowing())

let userStore = useUser()
let responses_list = responses.value.map(async (user_id) => (await userStore.get_by_id(user_id)))
</script>

<template>
  <v-dialog 
    v-model="showing"
    scrollable
  >
    <v-container>
		  <v-card 
        style="min-height: 80vh;" 
        class="rounded-lg"
      >
			  <v-icon @click="showing = false">
          mdi-close
        </v-icon>
			  
        <v-row class="flex-column">
			  	<v-col
				  	cols="12"
		  			v-for="user in responses_list"
		  			:key="user._id"
			   	>
		  			<Slave :user="user" />
			  	</v-col>
			  </v-row>
		  </v-card>
    </v-container>
	</v-dialog>
</template>

