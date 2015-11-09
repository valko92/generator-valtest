'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var mkdirp = require('mkdirp');

var ValtestGenerator = yeoman.generators.Base.extend({
  prompUser: function() {
    var done = this.async();

    //greet the user
    console.log(this.yeoman);

    //short sweet message
    console.log(chalk.magenta('You\'re using Val\'s test generator!'));



    var prompts = [{
      name: 'appName',
      message: 'What is your app\'s name?'
    }, {
      type: 'list',
      name: 'addFramework',
      message: 'Would you like to use Cardinal or Bootstrap?',
      choices: ['Cardinal', 'Bootstrap']
    }];

    this.prompt(prompts, function(props) {
      this.appName = props.appName;

      if(props.addFramework === 'Cardinal') {
        this.addFramework = 'Cardinal';
      } else {
        this.addFramework = 'Bootstrap';
      }

      done();
    }.bind(this));
  },
  scaffoldFolders: function() {
    var context = {
      site_name: this.appName,
      framework: this.addFramework
    };

    mkdirp.sync("assets");
    mkdirp.sync("assets/css");
    mkdirp.sync("assets/js");

    if (context.framework === 'Cardinal') {
      mkdirp.sync("assets/less");
    } else {
      mkdirp.sync("assets/sass");
    }

  },
  copyMainFiles: function () {

    var context = {
      site_name: this.appName,
      framework: this.addFramework
    };

    console.log(context.framework+' IS...');

    if (context.framework === 'Cardinal') {
      this.copy("_gruntfile_less.js", "Gruntfile.js");
      this.copy("_package_less.json", "package.json");
      this.copy("_bower_less.json", "bower.json");
      this.copy("_custom_styles.less", "assets/less/custom_styles.less");
      this.copy("_main.less", "assets/less/main.less");
    } else {
      this.copy("_gruntfile_sass.js", "Gruntfile.js");
      this.copy("_package_sass.json", "package.json");
      this.copy("_bower_sass.json", "bower.json");
      this.copy("_custom_styles.scss", "assets/less/custom_styles.scss");
      this.copy("_main.scss", "assets/less/main.scss");
    }

    this.template("_index.html", "app/index.html", context);
    this.copy("_server_creds.json", "server_creds.json");
    this.copy("_main.css", "assets/css/main.css");




  },
  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    this.copy('bowerrc', '.bowerrc');
    this.copy('gitignore', '.gitignore');
  },
  installDependencies: function() {
    console.log(chalk.magenta('I shall now install dependencies. Sit back and enjoy the ride!'));

    var context = {
      site_name: this.appName,
      framework: this.addFramework
    };

    var done = this.async();
    this.npmInstall(['grunt'], { 'saveDev': true });
    this.npmInstall(['grunt-autoprefixer'], { 'saveDev': true });
    this.npmInstall(['grunt-contrib-connect'], { 'saveDev': true });
    this.npmInstall(['grunt-contrib-cssmin'], { 'saveDev': true });
    this.npmInstall(['grunt-contrib-concat'], { 'saveDev': true });
    this.npmInstall(['grunt-contrib-watch'], { 'saveDev': true });
    this.npmInstall(['grunt-rsync'], { 'saveDev': true });
    this.npmInstall(['matchdep'], { 'saveDev': true });

    if(context.framework === 'Cardinal') {
      this.npmInstall(['grunt-contrib-less'], { 'saveDev': true });
    } else {
      this.npmInstall(['grunt-sass'], { 'saveDev': true });
    }

    this.bowerInstall();
    done();
  }
});

module.exports = ValtestGenerator;
