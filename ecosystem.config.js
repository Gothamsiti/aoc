module.exports = {
    apps : [
        {
            name : "AirOceanCargoGothamDemo",
            script : "npm run start",
            args : "start --port 3200",
            env: {
                APIHOST:"https://aoc.gotham.studio",
                ENVIROMENT: "production",
            },
            time: true,
            exec_mode: "fork",
            interpreter : 'node@14.19.3'
        }
    ]
}