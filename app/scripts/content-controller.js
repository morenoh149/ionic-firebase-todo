'use strict';

app.constant('FIREBASE_URI', 'https://ionic-guide-harry.firebaseio.com/projects/');

app.controller('ContentController', function($scope,
                                             $ionicModal,
                                             Projects,
                                             $firebase,
                                             $ionicLoading,
                                             $ionicSideMenuDelegate,
                                             $ionicPopup,
                                             FIREBASE_URI) {

  //TODO move this into a projects service object
  // Load projects
  var projectRef = new Firebase(FIREBASE_URI);
  var firebaseKeyRegEx = /^-\w{19}$/;

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


  // Selects the given project by it's firebase key
  $scope.selectProject = function(key) {
    $scope.activeProject = $scope.projects.$child(key);
    $scope.activeTasks = $scope.activeProject.$child('tasks');
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
      $scope.hideLoading();
    });
    $scope.taskModal.hide();
    $scope.showLoading();

    // reset task title
    task.title = '';
  };

  $scope.createProject = function(project) {
    if(!project) {
      return;
    }

    // store project to firebase projects, upon success make it active project
    $scope.projects.$add({
      title: project.title
    }).then( function(ref) {
      $scope.selectProject(ref.name());
      $scope.hideLoading();
    });
    $scope.projectModal.hide();
    $scope.showLoading();

    project.title = '';
  };


  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  $scope.newProject = function() {
    $scope.projectModal.show();
  };

  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  $scope.closeNewProject = function() {
    $scope.projectModal.hide();
  };

  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.toggleTask = function(key) {
    var clickedTask = $scope.activeTasks.$child(key);
    clickedTask.finished = !clickedTask.finished;
    clickedTask.$save();
  };

  $scope.deleteTask = function(key) {
    $scope.activeTasks.$remove(key);
  };

  $scope.deleteProject = function(key) {
    $ionicPopup.confirm({
      title: 'Delete Project',
      content: 'You sure?'
    }).then(function(res) {
      if(res) {
        $scope.projects.$remove(key);
        $scope.selectProject($scope.projectKeys[0]);
      } else {
      }
    });
  };

});
