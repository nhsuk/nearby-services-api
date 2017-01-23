function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) =>
    arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos);
}
function closesAtMidnight(moment) {
  const time = moment.format('HH:mm');
  return (time === '00:00' || time === '23:59');
}

module.exports = {
  deepClone,
  removeDuplicates,
  closesAtMidnight,
};
