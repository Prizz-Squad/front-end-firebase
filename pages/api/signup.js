// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { api } from "@/utils/api";

// TODO: use axios or class smth less verbose
export default async function handler(req, res) {
  console.log("api", api);
  console.log("body", req.body);
  const response = await fetch(`${api}/users/register`, {
    method: "POST",
    body: JSON.stringify(req.body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  console.log("json", json);
  res.status(200).json(json);
}
