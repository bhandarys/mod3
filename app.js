(function(){

'use strict';

angular.module("NarrowItDownApp", [])
      .controller("NarrowItDownController", NarrowItDownController)
      .service("MenuSearchService", MenuSearchService)
      .constant('ApiBasePath', "http://davids-restaurant.herokuapp.com")
      .directive("foundItems", FoundItemsDirective);

function FoundItemsDirective(){
  var ddo = {
    templateUrl: 'menuList.html',
    scope: {
       found: '<',
      preSearch: '<',
      removeItem: '&'
    },
    controller: FoundItemsDirectiveController,
    controllerAs: 'list',
    bindToController: true,
    link: FoundItemsDirectiveLink
  };
  return ddo;
};


function FoundItemsDirectiveController() {
  var items = this;

  items.showMsg = function(){
    if(items.preSearch == true){
      return false;
    } else {
      if (items.found.length == 0){
        return true;
      }
    }
    return false;
  }
};

function FoundItemsDirectiveLink(scope, element, attrs, controller) {

  scope.$watch('list.showMsg()', function (showMsg) {
    var emptyElem = element.find("div");
    if (showMsg === true) {
      emptyElem.css('display', 'block');
    }
    else {
      emptyElem.css('display', 'none');
    }
  });

}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService){
  var list = this;
  console.log("Inside Controller");

  list.preSearch = true;
  list.found = [];
  list.getMatchedMenuItems = function(){
    console.log("Inside getMatchedMenuItems function");
    list.found.splice(0, list.found.length);
    list.preSearch = true;
    var promise = MenuSearchService.getMatchedMenuItems(list.search);
    console.log("Got promise");
    promise.then(function (response){
        console.log("Inside promise")
        list.found = response;
        list.preSearch = false;
        console.log("End of promise")
    })
    .catch(function(error){
      console.log("1. Caught the error with reason" + error.reason);
      // console.log("Caught the error " + error.name);
    });
  } ;

  list.removeItem = function(index){
      list.found.splice(index, 1);
      if (list.found.length == 0) list.preSearch = false;
  };
} // Controller


MenuSearchService.$inject = ["$http", "ApiBasePath"];
function MenuSearchService($http, ApiBasePath){
  var service = this;

  service.getMatchedMenuItems = function(search){
    console.log("Inside the service");
    var response = $http({
      method:"GET",
      url: (ApiBasePath + "/menu_items.json")
    })
    .then(function(response){
          var found = [];
          if(search){
            for(var i=0;i<response.data.menu_items.length;i++){
              var n = response.data.menu_items[i].description.toLowerCase().search(search.toLowerCase());
              if(n != -1){
                found.push(response.data.menu_items[i])
              }
            }
          } else {
            console.log("search failed");
          }
          return found;
    });
    return response;
  }; //function(search)
}; //MenuSearchService

})();
