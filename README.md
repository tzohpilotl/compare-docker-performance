# Dockerfile testing

Compare different approaches to create the same image

While trying to optimize a Dockerfile for an app I'm working on I found myself wanting to have data to lean on instead of guessing what would be the more performant option, given the inconsistent results I was getting and the long waiting times that I had to endure while creating and recreating the Docker image of interest.

This program's API is exposed through two commands defined in the `package.json`: `start` and `create-report`.

## start

This is the main of this program and it's job is to execute a `docker-compose up <service-name>` command on every parameter that is passed to it.

Check the services defined in the `docker-compose.yml` file or roll out your own since the program will fail if the service you pass as an argument is not defined in that top-level file.

### Example usage

**NPM**

```shell
npm start service-name service-name-2
```

**Yarn**

```shell
yarn start service-name service-name-2
```

## create-report

As of now, the report is only a formated output printed to the console; it has the script name associated with the mean of time taken to execute the script.

## Notes

- Always run `docker system prune -a` between program runs to ensure you're testing from a clean state, or create all the images first and start testing.
- The report would be empty if there are no previous results in the `results/results.json` file
- A `docker-compose` config file with services in it is needed

## To Do

- [ ] Enable automatic Docker prunning
- [ ] Enable passing a number of times to be run with the same parameters
- [ ] Allow to test any script (decouple from Docker)
