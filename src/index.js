const { isEmpty } = require('ramda');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { RESULTS_FILE, FIRST_SERVICE } = require('./config');
const {
  makeScript,
  makeScriptable,
  addFilename,
  measureProgram,
  shuffle } = require('./util');

const executeScripts = async function(scripts) {
  // We avoid parallel execution because measurements get skewed
  // when the resources are shared.
  // const measurements = scripts.map(proxiedExec);
  // await Promise.all(measurements);

  // We perform the actions sequentially to provision all the
  // resources at a time.
  console.group('Program measurment started');
  const results = [];
  for (let i = 0; i < scripts.length; i++) {
    console.log('Processing script:');
    console.log(scripts[i]);
    const { _, time } = await measureProgram(async () => await exec(scripts[i]));
    results.push({
      script: scripts[i],
      time
    });
  }
  console.groupEnd();

  return results;
};

const presentResults = function(results, time) {
  console.log('Results are');
  results.forEach(result => {
    console.group(result.script);
    console.log('Time: ', result.time);
    console.groupEnd();
  });
  console.log(`Finished in ${time} s`);
  console.groupEnd();
}

const gatherResults = async function(scripts) {
  const shuffledScripts = shuffle(scripts);
  const executeShuffled = async () => await executeScripts(shuffledScripts);
  return await measureProgram(executeShuffled);
}

const saveResults = function(results) {
  console.log('Saving results');
  const oldData = fs.readFileSync(RESULTS_FILE, 'utf-8');
  const parsedOldData = isEmpty(oldData) ? {} : JSON.parse(oldData);
  const newData = {
    ...parsedOldData,
    [(new Date()).toUTCString()]: results
  };
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(newData));
  console.log('Done');
}

const handleGeneralError = function(error) {
  console.group('Something went wrong while measuring.')
  console.error(error);
  console.groupEnd();
}

const prepareScripts = function() {
  const services = process.argv.slice(FIRST_SERVICE);
  const data = services.map(makeScriptable).map(addFilename);
  return data.map(makeScript);
}

async function measure() {
  const scripts = prepareScripts();
  try {
    const { results, time } = await gatherResults(scripts);
    presentResults(results, time);
    saveResults(results);
  } catch (error) {
    handleGeneralError(error);
  }
}

measure();