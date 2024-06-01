import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage"
// const { storage } = require("@/init/firebase")
import { storage } from "@/init/firebase"

//const { storage } = require("@/init/firebase")
import { storage } from "@/init/firebase"
const getRandomId = () => Math.random().toString(36).substr(2, 9)
const imageRef = storageRef(storage, `products/${getRandomId()}`)

export const uploadFileToBucket = ({ imageUpload, onSuccess }) => {
  if (imageUpload === null) {
    console.log("Please select an image")
    return
  }

  uploadBytes(imageRef, imageUpload)
    .then((snapshot) => {
      getDownloadURL(snapshot.ref)
        .then((url) => {
          onSuccess(url)
        })
        .catch((error) => {
          console.log(error.message)
        })
    })
    .catch((error) => {
      console.log(error.message)
    })
}
