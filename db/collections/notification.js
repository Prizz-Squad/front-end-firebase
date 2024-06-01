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
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore"

const coll = collection(db, "notifications")

export const createNotification = async (values) => {
  const docRef = doc(coll)
  await setDoc(docRef, {
    ...values,
    createdAt: Timestamp.now(),
  })
}

export const getNotifsSnapshot = async (callback) => {
  const qry = query(coll, orderBy("createdAt", "desc"))
  onSnapshot(qry, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    callback(data)
  })
  return () => {}
}
