import admin from "@/lib/firebase-admin"

export default async function handler(req, res) {
  const { email, password, firstName, lastName } = req.body
  const record = await admin.auth().createUser({
    email,
    password,
    displayName: `${firstName} ${lastName}`,
  })
  console.log("record", record)
  res.status(200).json({ success: true, uid: record.uid })
}
