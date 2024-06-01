import { db } from "../../init/firebase"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore"

const coll = collection(db, "users")

export const createUser = async (values) => {
  const docRef = doc(coll)
  await setDoc(docRef, values)
}

export const getUsers = async () => {
  const querySnapshot = await getDocs(coll)
  const data = querySnapshot.docs.map((doc) => doc.data())
  return data
}

export const deleteUser = async (id) => {
  await deleteDoc(doc(coll, id))
}

export const updateUserStatus = async (uid, role) => {
  const qry = query(coll,where("uid","==",uid))
  const querySnapshot = await getDocs(qry)
  querySnapshot.forEach((doc)=> {
    updateDoc(doc.ref,{role})
  })

}
