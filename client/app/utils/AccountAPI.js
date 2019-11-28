import { address, api } from './APICONFIG';

let token = localStorage.token

if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Accept': 'application/json',
  'Authorization': token
}

export const signIn = (username, password) =>
  fetch(`${address}/${api}/account/signin`, { 
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password
    })
  })
    .then(res => res.json())

export const signUp = user =>
  fetch(`${address}/${api}/account/signup`, { 
    method: 'POST',
    headers,
    body: user
   })
    .then(res => res.json())

export const verify = token =>
  fetch(`${address}/${api}/account/verify?token=${token}`, {
    headers
  }).then(res => res.json())

export const signOut = token => 
  fetch(`${address}/${api}/account/signout?token=${token}`, {
    headers
  }).then(res => res.json())
  

export const getUsers = () =>
  fetch(`${address}/${api}/account/getUsers`, {
    headers
  }).then(res => res.json())

export const getUser = username =>
  fetch(`${address}/${api}/account/getUser?username=${username}`, {
    headers
  }).then(res => res.json())

export const getUserByID = id =>
  fetch(`${address}/${api}/account/getUserByID?id=${id}`, {
    headers
  }).then(res => res.json())

export const updateUser = user => 
  fetch(`${address}/${api}/account/updateUser`, {
    headers,
    method: 'PUT',
    body: user
  })
  .then(res => res.json())

export const removeUser = (username, email) =>
  fetch(`${address}/${api}/account/removeUser`, {
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      username,
      email
    })
  }).then(res => res.json())

export const getCurrentUser = () =>
  fetch(`${address}/${api}/account/getCurrentUser`, {
    headers
  }).then(res => res.json())