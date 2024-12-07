import { atOnceUsers, scenario, simulation, pause, jmesPath, csv, feed, rampUsers } from "@gatling.io/core";
import {http, status } from '@gatling.io/http';

export default simulation((setUp) => {
    // HTTP Protocol
    const httpProtocol = http
    .baseUrl('https://videogamedb.uk:443/api/v2')
    .acceptHeader('application/json')
    .contentTypeHeader('application/json')

    // Feeder for test data
    const feeder = csv("videogames.csv").random();

    // Scenario
    const myScenario = scenario("My scenario").exec(
        http('Get all games').get("/videogame")
        .check(status().is(200))
        .check(jmesPath("[0].id").saveAs('firstGameId')),
        pause(5),
        http('Get single game').get("/videogame/#{firstGameId}")
        .check(status().is(200))
        .check(jmesPath("name").is("Resident Evil 4")),
        pause(2),
        feed(feeder),
        http("Get Game: #{gameName}").get("videogame/#{gameId}")
        .check(jmesPath("name").isEL("#{gameName}"))
    );

    // Simulation
    setUp(myScenario.injectOpen(
        atOnceUsers(5),
        rampUsers(10).during(10)
    ).protocols(httpProtocol));
})