import { db } from "../../init/firebase"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
} from "firebase/firestore"

const coll = collection(db, "tasks")

export const createTask = async (values) => {
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

export const changeTaskDepartment = async (id, department) => {
  await setDoc(doc(coll, id), { department })
}

export const getTasksSnapshot = async (callback) => {
  return onSnapshot(coll, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    callback(data)
  })
}
