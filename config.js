module.exports = {
  mysql: {
    host     : 'localhost',
    user     : 'hwuser',
    password : 'hwpass',
    database : 'hwdb',
    charset  : 'utf8'
  },
  app: {
    jwtSecret: '^wf$qzwlBuj[[O7o*W4qg3r67XiZ"5',
    jwtExpireMinutes: 43200, //30 days validity for json webtoken
    jwtExpireSeconds: (43200*60),
    port: 8080
  }
}
