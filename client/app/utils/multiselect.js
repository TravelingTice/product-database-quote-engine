// these are 2 functions that are frequently used in the multi select component in react, one for converting a array of strings to an array of objects that can be used by the MultiSelect component and the other to revert back to a string array

export const revertToStringArr = arr => {
  const newArr = [];
  arr.forEach(obj => {
    newArr.push(obj.value);
  });
  return newArr;
}

export const createObjArr = arr => {
  const newArr = [];
  arr.forEach(str => {
    newArr.push({
      label: str,
      value: str
    });
  });
  return newArr;
}