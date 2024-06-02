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

const coll = collection(db, "taskTrackHistory")

// userId
// taskId
// startAt
// endAt
export const createTaskTrackHistory = async (values) => {
  console.log("values", values)
  const docRef = doc(coll)
  await setDoc(docRef, values)
}

export const getUsersTaskHistory = async (userIds) => {
  const q = query(coll, where("userId", "in", userIds))
  const querySnapshot = await getDocs(q)
  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
  return data
}
