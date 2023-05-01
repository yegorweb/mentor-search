<script setup>
import UserService from '../services/UserService';
import EntryContainer from './entries/EntryContainer.vue';
import Slave from './Slave.vue';

let props = defineProps({
	responses: {
		type: Array,
		required: true
	},
	visible: {
    type: Boolean
  },
})
let emit = defineEmits(['update:visible'])

let responses = props.responses.map(async user_id => (await UserService.get_by_id(user_id)).data)

function getTopGap() {
	return window.scrollY + 20
}
</script>

<template>
  <div class="box" v-if="props.visible">
		<v-container :style="`margin-top: ${getTopGap()}px`">
			<EntryContainer>
				<v-icon @click="emit('update:visible', false)">mdi-close</v-icon>
				<v-row class="flex-column">
					<v-row 
						class="response flex-row justify-space-between align-center w-100"
						v-for="user in responses"
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
	background: rgba($color: #000000, $alpha: 0.2);
}
</style>