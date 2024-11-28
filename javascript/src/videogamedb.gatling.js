import { atOnceUsers, scenario, simulation } from "@gatling.io/core";
import {http, status } from '@gatling.io/http';

export default simulation((setUp) => {
    // HTTP Protocol
    const httpProtocol = http
    .baseUrl('https://qa.nectarsleep.com/')
    .acceptHeader('application/json')
    .contentTypeHeader('application/json')

    // Scenario
    const myScenario = scenario("My scenario")
    .exec(http('Get all games').get("/mattress")
    .check(status().is(200)));

    // Simulation
    setUp(myScenario.injectOpen(atOnceUsers(10000))).protocols(httpProtocol);
})