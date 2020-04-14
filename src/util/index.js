const shuffle = function(array) {
  let random, temp;
  for (let i = array.length - 1; i > 0; i--) {
    random = Math.floor(Math.random() * (i + 1));
    temp = array[i];
    array[i] = array[random];
    array[random] = temp;
  }

  return array;
}

const env = 'DOCKER_BUILDKIT=1';

const operate = service => `docker-compose up --no-color ${service}`;

const script = function({ env, operate }) {
  return `${env} ${operate}`;
};

const makeScript = ({ service }) => script({
  env,
  operate: operate(service),
});

const makeScriptable = service => ({ service });

const addFilename = ({ service }) => ({ service, filename: service });

const measureProgram = async function(program) {
  const start = new Date();
  const results = await program();
  const timeDiff = (new Date()).valueOf() - start.valueOf();
  return { results, time: timeDiff };
}

module.exports = {
  shuffle,
  operate,
  script,
  makeScript,
  makeScriptable,
  addFilename,
  measureProgram
};