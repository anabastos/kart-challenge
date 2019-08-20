const splitEvery = (n, list) => {
  let result = [];
  let counter = 0;
  while (counter < list.length) {
    result = [
      ...result,
      list.slice(counter, counter += n),
    ]
  }
  return result;
};

const indexOfObjectInArr = (name, ranking) => ranking
  .map(e => e.name)
  .indexOf(name);

const exists = (item) => {
  const type = typeof item
  return type !== 'undefined' && type !== 'null'
}

const getAverage = (list) => (list.reduce((a, b) => a + b, 0) / list.length)
  .toFixed(2)

const getValidDate = (str) => {
  const date = '1995-06-13T'
  // Format to a valid date(YYYY-MM-DDTHH:mm:ss.sss) using a fixed day(my birthday)
  const formatedDate = `${date}${str}`
  return new Date(formatedDate)
}

const pad = (n, size) => {
  const str = `000${n}`
  return str.substr(str.length - size);
}

const getDurationMiliSecToStr = (time) => {
  const min = Math.floor(time / 60000)
  const rem = time - (min * 60000)
  const sec = Math.floor(rem / 1000)
  const mili = rem - (sec * 1000)

  return `${pad(min, 2)}:${pad(sec, 2)}.${pad(mili, 3)}`
}

const getDurationStrToMiliSec = (str) => {
  const time = str
    .split(/\.|:/)
    .map(n => parseInt(n, 10));
  return ((time[0] * 60) + time[1]) * 1000 + time[2]
}


export {
  splitEvery,
  exists,
  getAverage,
  getDurationMiliSecToStr,
  indexOfObjectInArr,
  getDurationStrToMiliSec,
  getValidDate,
}