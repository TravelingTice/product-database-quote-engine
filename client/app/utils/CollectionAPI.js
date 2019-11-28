import { address, api } from './APICONFIG';

let token = localStorage.token

if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Accept': 'application/json',
  'Authorization': token
}

export const getCollections = () =>
  fetch(`${address}/${api}/collections`, { 
    headers
  })
    .then(res => res.json())

export const getCollectionNames = () =>
  fetch(`${address}/${api}/collections/names`, {
    headers
  })
  .then(res => res.json())

export const getCollection = name =>
  fetch(`${address}/${api}/collection?name=${name}`, {
    headers
  })
    .then(res => res.json())

export const createCollection = name =>
  fetch(`${address}/${api}/collection/create`, {
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      name
    })
  })
    .then(res => res.json())

export const deleteCollection = name =>
  fetch(`${address}/${api}/collection/delete?name=${name}`, {
    headers
  })
    .then(res => res.json())

export const deleteCollectionByID = id =>
  fetch(`${address}/${api}/collection/deleteByID?id=${id}`, {
    headers
  })
    .then(res => res.json())