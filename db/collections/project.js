import { db } from ".././../init/firebase"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore"

const coll = collection(db, "projects")

export const createProject = async (project) => {
  const docRef = doc(coll)
  await setDoc(docRef, project)
}

export const getProjects = async () => {
  const querySnapshot = await getDocs(coll)
  const projects = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
  return projects
}

export const deleteProject = async (id) => {
  await deleteDoc(doc(coll, id))
}

export const updateProject = async (id, project) => {
  await updateDoc(doc(coll, id), project)
}
