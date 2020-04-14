const { readFileSync } = require('fs');
const {
  prop,
  propOr,
  compose,
  curry,
  flatten
} = require('ramda');

const get2ndArg = compose(prop(2), prop('argv'));
const readUTFFileSync = curry(inversedReadFile)('utf-8');

function inversedReadFile(encoding, filename) {
  return readFileSync(filename, encoding)
}

function convertToList(data) {
  const keys = Object.keys(data);
  const dataInList = keys.reduce((acc, curr) => {
    return [...acc, data[curr]];
  }, []);
  return dataInList;
}

function calculateTotals(data) {
  return data.reduce((totals, curr) => {
    const currentScript = prop('script', curr);
    const currentTime = prop('time', curr, 0);
    const currentState = propOr({}, currentScript, totals);
    const currentCount = propOr(0, 'count', currentState);
    const currentTotal = propOr(0, 'total', currentState);
    totals[currentScript] = {
      script: currentScript,
      count: currentCount + 1,
      total: currentTotal + currentTime
    };
    return totals;
  }, {});
}

function mean(total, observations) {
  return total / observations;
}

function calculateMeans(totals) {
  const keys = Object.keys(totals);
  return keys.reduce((_totals, key) => {
    const currentState = prop(key, _totals);
    const { total, count } = currentState;
    _totals[key] = {
      ...currentState,
      mean: mean(total, count)
    };
    return _totals;
  }, totals);
}

function displayMeansInSeconds(observations) {
  const keys = Object.keys(observations);
  keys.forEach(key => {
    const { mean, script } = observations[key];
    console.log('---');
    console.log(script);
    console.log(`${mean / 1000} seconds`);
  });
}

function createReportString(observations) {
  const keys = Object.keys(observations);
  const reportChunks = keys.map(key => {
    const observation = observations[key];
    return observation.script + '\n' +
      mean(observation.total, observation.count) / 1000 + 'seconds';
  });
  return reportChunks.join('\n---\n');
}

function createReport() {
  const filename = get2ndArg(process);
  const data = readUTFFileSync(filename);
  const jsonData = JSON.parse(data);
  const dataInList = convertToList(jsonData);
  const flatData = flatten(dataInList);
  const totals = calculateTotals(flatData);
  const means = calculateMeans(totals);
  const report = createReportString(means);
  console.log(report);
}

createReport();