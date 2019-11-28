import { address, api } from './APICONFIG';

let token = localStorage.token

if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Accept': 'application/json',
  'Authorization': token
}

export const getVendors = () =>
  fetch(`${address}/${api}/vendors`, {
    headers,
  })
  .then(res => res.json())

export const getVendorNames = () =>
  fetch(`${address}/${api}/vendors/names`, {
    headers,
  })
  .then(res => res.json())

export const getVendor = _id => 
  fetch(`${address}/${api}/vendor/find?id=${_id}`)
  .then(res => res.json())

export const createVendor = vendor =>
  fetch(`${address}/${api}/vendor/create`, {
    headers,
    method: 'POST',
    body: vendor
  })
  .then(res => res.json())

export const updateVendor = vendor => 
  fetch(`${address}/${api}/vendor/update`, {
    headers,
    method: 'PUT',
    body: vendor
  })
  .then(res => res.json())

export const deleteVendor = id =>
  fetch(`${address}/${api}/vendor/delete?id=${id}`, {
    headers,
    method: 'DELETE'
  })
  .then(res => res.json())