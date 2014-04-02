'use strict';

app.controller('ContentController', function($scope,
                                             $ionicModal,
                                             Projects,
                                             $firebase,
                                             $ionicLoading,
                                             $ionicSideMenuDelegate) {

  // Load projects
  var projectsUrl = 'https://ionic-guide-harry.firebaseio.com/projects/';
  var projectRef = new Firebase(projectsUrl);
  var firebaseKeyRegEx = /^-[A-Za-z0-9]{19}$/;

  // 3-way bind projects variable
  $scope.projects = $firebase(projectRef);

  $scope.showLoading = function() {
    $scope.loading = $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 500
    });
  };
  $scope.hideLoading = function(){
    $scope.loading.hide();
  };
  $scope.showLoading();

  // tasks that need to be run once projects are loaded
  // select project from localstorage if present
  $scope.projects.$on('loaded', function() {
    $scope.hideLoading();
    $scope.projectKeys = $scope.projects.$getIndex();
    $scope.lastActiveProjectKey = Projects.getLastActiveKey();
    if (firebaseKeyRegEx.test($scope.lastActiveProjectKey)) {
      $scope.selectProject($scope.lastActiveProjectKey);
    } else {
      $scope.selectProject($scope.projectKeys[0]);
    }
  });

  // utility function for creating a new project with the given projectTitle
  var createProject = function(projectTitle) {
    var newProject = Projects.newProject(projectTitle);

    // store project to firebase projects, upon success make it active project
    $scope.projects.$add(newProject).then( function(ref) {
      $scope.selectProject(ref.name());
    });
  };

  // Trigger modal for a new project
  $scope.newProject = function() {
    var projectTitle = prompt('Project name');
    if(projectTitle) {
      createProject(projectTitle);
    }
  };

  // Selects the given project by it's firebase key
  $scope.selectProject = function(key) {
    $scope.activeProject = $scope.projects.$child(key);
    $scope.activeTasks = $scope.activeProject.$child('tasks');
    $scope.taskKeys = $scope.activeTasks.$getIndex();
    Projects.setLastActiveKey(key);
  };

  // Create our modals
  $ionicModal.fromTemplateUrl('templates/newtaskmodal.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope
  });
  $ionicModal.fromTemplateUrl('templates/newprojectmodal.html', function(modal) {
    $scope.projectModal = modal;
  }, {
    scope: $scope
  });

  $scope.createTask = function(task) {
    if(!$scope.activeProject || !task) {
      return;
    }
    $scope.activeTasks.$add({
      title: task.title,
      finished: false
    }).then(function(/*ref*/) {
      $scope.activeTasks = $scope.activeProject.$child('tasks');
      $scope.taskKeys = $scope.activeTasks.$getIndex();
      $scope.hideLoading();
    });
    $scope.taskModal.hide();
    $scope.showLoading();

    // reset task title
    task.title = '';
  };

  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.toggleTask = function(key) {
    var taskFinishedRef = $scope.activeTasks.$child(key).$child('finished');
    console.log(taskFinishedRef);
    taskFinishedRef.on('value', function(snapshot) {
      console.log(snapshot.val());
    });
    if($scope.activeTasks.$child(key).finished) {
      console.log($scope.activeTasks.$child(key));
      $scope.activeTasks.$child(key).finished = !$scope.activeTasks.$child(key).finished;
    } else {
      $scope.activeTasks.$child(key).finished = 'true';
    }
    console.log($scope.activeTasks.$child(key).finished);
  };

});
