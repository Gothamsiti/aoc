module.exports = {
  apps: [
    {
      name: "AirOceanCargoGothamDemo",
      script: "/home/gothamsiti/apps/aoc/node_modules/nuxt/bin/nuxt.js",
      args: "start -p 3200",
      env: {
        APIHOST: "https://aoc.gotham.studio",
        ENVIROMENT: "production"
      },
      exec_mode: "fork",
      time: true
    }
  ]
}
