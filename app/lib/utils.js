function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function closesAtMidnight(moment) {
  const time = moment.format('HH:mm');
  return (time === '00:00' || time === '23:59');
}

function deduplicateByKey(array, keyField) {
  const dictionary = {};
  return array.filter((o) => {
    const key = o[keyField];
    if (dictionary[key]) {
      return false;
    }
    dictionary[key] = true;
    return true;
  });
}

module.exports = {
  deepClone,
  closesAtMidnight,
  deduplicateByKey
};
