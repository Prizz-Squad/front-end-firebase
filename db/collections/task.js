import { db } from "../../init/firebase"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore"

const coll = collection(db, "tasks")

export const createTask = async (values) => {
  console.log(values, "colletionvalue")
  const docRef = doc(coll)
  await setDoc(docRef, values)
}

export const getTask = async (id) => {
  const docRef = doc(coll, id)
  const snap = getDoc(docRef)
  return (await snap).data()
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

export const changeTaskColId = async (id, columnId) => {
  await updateDoc(doc(coll, id), { columnId })
}

export const changeTaskPriority = async (id, priority) => {
  await updateDoc(doc(coll, id), { priority })
}

export const changeTaskStatus = async (id, columnId) => {
  await updateDoc(doc(coll, id), { columnId })
}

export const toggleIsTaskCompleted = async (id, isCompleted) => {
  await updateDoc(doc(coll, id), { isCompleted })
}

export const getTasksSnapshot = async (callback, { projectId }) => {
  const qry = query(coll, where("projectId", "==", projectId))
  onSnapshot(qry, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    callback(data)
  })
  return () => {}
}

export const changeTaskAssignee = async (id, assignee) => {
  await updateDoc(doc(coll, id), { assignee })
}

export const changeTaskDepartment = async (id, department) => {
  await updateDoc(doc(coll, id), { department })
}

export const addCaptionToTask = async (id, caption) => {
  await updateDoc(doc(coll, id), { caption })
}

export const addImageToTask = async (id, image) => {
  const task = await getTask(id)
  const images = task.images || []
  images.push(image)
  await updateDoc(doc(coll, id), { images })
}

export const removeImageFromTask = async (id, image) => {
  const task = await getTask(id)
  const images = task.images.filter((img) => img !== image)
  await updateDoc(doc(coll, id), { images })
}

export const addImagePostDateToTask = async ({ id, image, date }) => {
  const task = await getTask(id)
  const imageToDates = task.imageToDates || {}
  imageToDates[image] = date
  await updateDoc(doc(coll, id), { imageToDates })
}
