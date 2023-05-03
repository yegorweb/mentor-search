<script setup>
import { storeToRefs } from 'pinia';
import UserService from '../services/UserService';
import EntryContainer from './entries/EntryContainer.vue';
import Slave from './Slave.vue';
import { useResponsesShowing } from '../stores/responsesShowing'

let { showing, responses } = storeToRefs(useResponsesShowing())
console.log(showing.value)

let responses_list = responses.value.map(async user_id => (await UserService.get_by_id(user_id)).data)

function getTopGap() {
	return window.scrollY + 20
}
</script>

<template>
  <div class="box" v-show="showing">
		<v-container :style="`margin-top: ${getTopGap()}px`">
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
		</v-container>
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
}
</style>