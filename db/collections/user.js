import { db } from "../../init/firebase"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore"

const coll = collection(db, "users")

export const createUser = async (values) => {
  const docRef = doc(coll)
  await setDoc(docRef, values)
}

export const getUsers = async () => {
  const querySnapshot = await getDocs(coll)
  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
  console.log("data", data)
  return data
}

export const deleteUser = async (id) => {
  await deleteDoc(doc(coll, id))
}

export const updateUser = async (id, values) => {
  await setDoc(doc(coll, id), values)
}
