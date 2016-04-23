// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('todo', ['ionic'])

/**
 * The Projects factory handles saving and loading projects
 * from local storage, and also lets us save and load the
 * last active project index.
 */

.factory('Projects', function() {
  return {
    all: function() {
      var projectString = window.localStorage['projects'];
      if (projectString) {
        return angular.fromJson(projectString);
      }
      return [];
    },
    save: function(projects) {
      window.localStorage['projects'] = angular.toJson(projects);
    },
    newProject: function(projectTitle) {
      return {
        title: projectTitle,
        tasks: []
      };
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveIndex']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveIndex'] = index;
    }
  }
 })


.controller('TodoController', function($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate) {

  // Funcion para crear nuevos proyectos con un titulo
  var createProject = function(projectTitle) {
    var newProject = Projects.newProject(projectTitle);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length-1);
  }

  // Inicializar proyectos
  $scope.projects = Projects.all();

  // Extrae último proyecto activo
  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

  // LLamada para crear un nuevo proyecto
  $scope.newProject = function() {
    var projectTitle = prompt('Project Name');
    if (projectTitle) {
      createProject(projectTitle);
    }
  };

  // Seleccionar un proyecto
  $scope.selectProject = function(project, index) {
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  $ionicModal.fromTemplateUrl(
    'new-task.html', 
    function(modal){
        $scope.taskModal = modal;
    },
    {
      scope: $scope
      // animation: 'slide-in-up'
    }
  );

  $scope.createTask = function(task) {
    if (!$scope.activeProject || !task ){
      return;
    }
    $scope.activeProject.tasks.push({ title: task.title });
    $scope.taskModal.hide();
    Projects.save($scope.projects);
    task.title = "";
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

  $timeout(function() {
    if ($scope.projects.length == 0) {
      while (true) {
        var projectTitle = prompt('Tu primer proyecto:');
        if (projectTitle) {
          createProject(projectTitle);
          break;
        }
      }
    }
  });

});

// .run(function($ionicPlatform) {
//   $ionicPlatform.ready(function() {
//     if(window.cordova && window.cordova.plugins.Keyboard) {
//       // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//       // for form inputs)
//       cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

//       // Don't remove this line unless you know what you are doing. It stops the viewport
//       // from snapping when text inputs are focused. Ionic handles this internally for
//       // a much nicer keyboard experience.
//       cordova.plugins.Keyboard.disableScroll(true);
//     }
//     if(window.StatusBar) {
//       StatusBar.styleDefault();
//     }
//   });
// })
