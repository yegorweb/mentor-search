<script setup>
import { storeToRefs } from 'pinia';
import UserService from '../services/UserService';
import EntryContainer from './entries/EntryContainer.vue';
import Slave from './Slave.vue';
import { useResponsesShowing } from '../stores/responsesShowing'
import { useUser } from '../stores/user';

let { showing, responses } = storeToRefs(useResponsesShowing())

let userStore = useUser()
let responses_list = responses.value.map(async user_id => await userStore.get_by_id(user_id))
console.log(responses_list)

function getTopGap() {
	return window.scrollY + 20
}
</script>

<template>
  <div class="box" v-show="showing">
		<v-col 
			:style="`margin-top: ${getTopGap()}px`"
			cols="12" lg="8" xl="6"
		>
			<EntryContainer>
				<v-icon @click="showing = false">mdi-close</v-icon>
				<v-row class="flex-column">
					<v-row 
						class="response flex-row justify-space-between align-center w-100"
						v-for="user in responses_list"
						:key="user._id"
					>
						<Slave :user="user" />
					</v-row>
				</v-row>
			</EntryContainer>
		</v-col>
	</div>
</template>

<style lang="scss" scoped>
.box {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 9999999;
	background: rgba($color: #000000, $alpha: 0.2);
	display: flex;
}
</style>