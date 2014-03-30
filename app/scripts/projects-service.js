'use strict';

/**
 * The Projects factory handles saving and loading the last active project's key
 * from localStorage
 */
app.factory('Projects', function() {
  return {
    //all: function () {
    //  var projectString = window.localStorage['projects'];
    //  if(projectString) {
    //    return angular.fromJson(projectString);
    //  }
    //  return [];
    //},
    //// just saves all the projects everytime
    //save: function(projects) {
    //  window.localStorage['projects'] = angular.toJson(projects);
    //},
    newProject: function(projectTitle) {
      return {
        title: projectTitle,
        tasks: []
      };
    },
    getLastActiveKey: function () {
      return window.localStorage.lastActiveProject || 0;
    },
    setLastActiveKey: function (key) {
      window.localStorage.lastActiveProject = key;
    }
  };
});
