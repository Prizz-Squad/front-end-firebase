import { db } from "../../init/firebase"
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  or,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore"

const coll = collection(db, "messages")

export const createMessage = async (values) => {
  const docRef = doc(coll)
  await setDoc(docRef, {
    ...values,
    createdAt: Timestamp.now(),
  })
}

export const getMessagesSnapshot = async (callback, { userId }) => {
  const qry = query(
    coll,
    orderBy("createdAt", "asc"),
    or(where("userId", "==", userId), where("toUserId", "==", userId))
  )
  onSnapshot(qry, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    callback(data)
  })
  return () => {}
}
