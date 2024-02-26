<script setup>
import { ref, watch } from 'vue'
import "cropperjs/dist/cropper.css"
import Cropper from "cropperjs"

const emit = defineEmits(["addImage"])

let loadedImages = ref([])
let preview = ref({})
let previewImage = ref(null)
let imageInput = ref(null)

let cropper

watch(preview, () => {
    if (!previewImage.value) return

    cropper = new Cropper(previewImage.value, {
      aspectRatio: 1,
      minContainerHeight: 300,
      guides: true,
      center: true,
    })
  }
)
async function crop() {
  if (!cropper) return

  cropper
    .getCroppedCanvas({
      fillColor: "#fff",
      width: 200,
      height: 200
    })
    .toBlob((blob) => {
        emit("addImage", blob)
        loadedImages.value = []
      }, 
      'image/jpeg', 
      0.9
    )
}

function loadImage() {
    loadedImages.value = imageInput.value.files

    if (loadedImages.value.length) {
        let reader = new FileReader()
        reader.onloadend = () => {
            preview.value = { img: reader.result, name: loadedImages.value[0].name }
            previewImage.value.src = preview.value.img
        }
        reader.readAsDataURL(loadedImages.value[0])
    } else {
        preview.value = null
    }
}
</script>

<template>
  <input @change="loadImage" type="file" accept="image/*" 
    ref="imageInput" id="upload" style="display: none">

  <label for="upload">
    <div v-if="!loadedImages.length" class="d-flex justify-center align-center flex-column"
        style="height: 50vh cursor: pointer">
        <span class="mdi mdi-24px mdi-camera"></span>
        <span>выбрать фото</span>
    </div>
  </label>
    
  <img 
    v-if="loadedImages.length" 
    ref="previewImage" 
    class="w-80" 
  />

  <div   
    v-if="loadedImages.length"
    class="d-flex mt-4 w-100 justify-center" 
  >  
    <v-btn @click="crop">Отправить</v-btn>
  </div>  
</template>