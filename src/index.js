import fs from 'fs';

import {
  splitEvery,
  exists,
  getAverage,
  getDurationMiliSecToStr,
  getPilotTurnData,
  indexOfObjectInArr,
} from './helpers';

import {
  bgYellow,
  error,
  keyValueLog,
} from './logger';

const fileToList = (fileName) => {
  try {
    const data = fs.readFileSync(fileName, 'utf8');
    return data
      .toString()
      .split(/\s\s\s*|\n|\t/)
      .slice(5);
  } catch (e) {
    error('Error:', e.stack);
  }
}

const printResults = (file) => {
  const obj = generateGroupedList(fileToList(file))
  const ranking = getRanking(obj);
  
  const bestTurn = obj.bestTurn
  delete obj.bestTurn

  bgYellow('\n_________________________\n     RESULTADOS          ')
  Object.keys(obj).forEach((pilot) => {
    bgYellow('_________________________')
    keyValueLog('POSICAO', indexOfObjectInArr(obj[pilot].name, ranking) + 1)
    keyValueLog('CODIGO DO PILOTO', pilot);
    keyValueLog('NOME DO PILOTO', obj[pilot].name);
    keyValueLog('QTD DE VOLTAS COMPLETAS', obj[pilot].nTurns);
    keyValueLog('TEMPO TOTAL DE PROVA',
      `${getDurationMiliSecToStr(obj[pilot].totalDuration)} min`);
    keyValueLog('DURACAO DA MELHOR VOLTA',
      `${getDurationMiliSecToStr(obj[pilot].bestDuration)} min`);
    keyValueLog('MEDIA DE VELOCIDADE',
      `${getAverage(obj[pilot].listOfVelocities)} KM/H`);
  })

  bgYellow(`\n________________________\n     MELHOR VOLTA       
________________________`)
  keyValueLog('PILOTO', bestTurn.pilot);
  keyValueLog('DURACAO', getDurationMiliSecToStr(bestTurn.time));
}

const getRanking = (groupedObj) => Object.keys(groupedObj)
  .reduce((acc, pilot) => exists(groupedObj[pilot].lastTurn)
    ? [
      {
        duration: groupedObj[pilot].lastTurn,
        name: groupedObj[pilot].name
      },
      ...acc,
    ]
    : acc, [])
  .sort((a, b) => (a.duration.getTime() > b.duration.getTime()) ? 1 : -1)

const generateGroupedList = (list) => {
  const groupedList = splitEvery(5, list);
  const groupedByPilot = groupedList.reduce((acc, turn) => {
    const turnData = getPilotTurnData(turn)
    const [code, name] = turn[1].split(' – ')

    const pilotTurns = exists(acc[code])
      ? [...[turnData], ...acc[code].turns]
      : [turnData]

    const pilotCalculatedData = exists(acc[code])
      ? calculateNewPilotData(acc[code], turnData)
      : getDefaultCalculatedData(turnData)

    const pilotData = {
      [code]: {
        nTurns: pilotTurns.length,
        name,
        ...pilotCalculatedData,
        turns: pilotTurns,
      }
    }

    const bestTurn = {
      bestTurn: acc.bestTurn.time >  pilotCalculatedData.bestDuration
        ? { time: pilotCalculatedData.bestDuration, pilot: name }
        : acc.bestTurn,
    };

    return { ...acc, ...pilotData, ...bestTurn };
  }, { bestTurn: { time: 999999, pilot: '' } });

  return groupedByPilot
}

const calculateNewPilotData = (pilotData, turnData) => ({
  totalDuration: pilotData.totalDuration + turnData.duration,
  bestDuration: turnData.duration < pilotData.bestDuration
    ? turnData.duration
    : pilotData.bestDuration,
  listOfVelocities: [
    ...pilotData.listOfVelocities,
    turnData.velocity,
  ],
  lastTurn: turnData.time.getTime() > pilotData.lastTurn.getTime()
    ? turnData.time
    : pilotData.lastTurn,
})

const getDefaultCalculatedData = turnData => ({
  totalDuration: turnData.duration,
  bestDuration: turnData.duration,
  listOfVelocities: [turnData.velocity],
  lastTurn: turnData.time,
})

printResults('input.txt');