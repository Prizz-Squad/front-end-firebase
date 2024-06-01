import { db } from "../../init/firebase"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore"

const coll = collection(db, "tasks")

export const createTask = async (values) => {
  console.log(values,"colletionvalue")
  const docRef = doc(coll)
  await setDoc(docRef, values)
}

export const getTasks = async () => {
  const querySnapshot = await getDocs(coll)
  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
  return data
}

export const deleteTask = async (id) => {
  await deleteDoc(doc(coll, id))
}

export const updateTask = async (id, project) => {
  await setDoc(doc(coll, id), project)
}

export const changeTaskStatus = async (id, status) => {
  await setDoc(doc(coll, id), { status })
}

export const changeTaskColId = async (id, columnId) => {
  await updateDoc(doc(coll, id), { columnId })
}


export const getTasksSnapshot = async (callback) => {
  onSnapshot(coll, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    callback(data)
  })
  return () => {}
}
