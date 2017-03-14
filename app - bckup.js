(function(){

'use strict';

angular.module("NarrowItDownApp", [])
      .controller("NarrowItDownController", NarrowItDownController)
      .service("MenuSearchService", MenuSearchService);


NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService){
  var list = this;

  list.found = [];
  console.log("Inside Controller");
  list.getMatchedMenuItems = function(){
    console.log("Inside function");
    list.found.splice(0, list.found.length);
    var promise = MenuSearchService.getMatchedMenuItems();
    console.log("Strange promise " + promise);
    promise.then(function (response){
        list.items = response.data.menu_items;
        CheckForSerchItems(list.search);
    })
    .catch(function(error){
      console.log("Caught the error " + error);
    });
    console.log("Search item is " + list.search );
  } ;

  function CheckForSerchItems(search){
    console.log("Inside Check for search items");
        if(search){
        console.log("Inside Seach with count " + list.items.length);
        for(var i=0;i<list.items.length;i++){
          var n = list.items[i].description.toLowerCase().search(search.toLowerCase());
          console.log("Found at position " + n + " in " + list.items[i].description);
          if(n != -1){
            console.log("Found Match" + list.items[i]);
            list.found.push(list.items[i])
            console.log("Excpeption in push");
          }
          else {
            console.log("Not Match");
          }
        }
      }
      else{
        console.log("search failed");
      }
    }; //CheckForSerchItems
  //
  list.removeItem = function(index){
      list.found.splice(index, 1);
  };
} // Controller


  MenuSearchService.$inject = ["$http"];
  function MenuSearchService($http){
    var service = this;

    service.getMatchedMenuItems = function(){
      var response = $http({
        method:"GET",
        url: ("https://davids-restaurant.herokuapp.com/menu_items.json")
        // url: ("https://davids-restaurant.herokuapp.com/categories.json")
      });
      console.log("Inside http call");
      return response;
    }
  };

})();
