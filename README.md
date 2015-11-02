First you need to change the config.

# For python
  1. go to "hw-admin/hwadmin/hwadmin/settings.py" and change the "DATABASES" option
  accordingly.
  2. Install python (if you dont already have it), along with "pip"
  3. install django
  4. now when in path "hw-admin/hwadmin" run "python manage.py syncdb", this will create tables in mysql.
  5. then run "python manage.py runserver" to start admin server


#For node.js
  1. since, the tables were created before by the python "syncdb", you can go to config.js,
  and change the config for mysql or any other config you see,
  the names of the config options are sort of self explanatory.
  2. assuming you have node installed (version > 0.10.30), now to install dependencies, run "npm install" in the project root directory
  3. now to run the server run "node app.js"

# to access APIs docs
  1. Install postman extension for chrome and import the "Healthwise.json.postman_collection" file.
  2. The api and their params are listed in their segregated according to their namespace.
