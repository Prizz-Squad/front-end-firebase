import { db } from "../../init/firebase"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore"

const coll = collection(db, "comments")

export const createComment = async (values) => {
  const docRef = doc(coll)
  await setDoc(docRef, values)
}

export const deleteComment = async (id) => {
  await deleteDoc(doc(coll, id))
}

export const getCommentsSnapshot = async (callback, { taskId }) => {
  console.log(taskId)
  const qry = query(coll, where("taskId", "==", taskId), orderBy("date", "asc"))
  onSnapshot(qry, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    callback(data)
  })
  return () => {}
}
