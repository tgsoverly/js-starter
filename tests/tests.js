module("Basic Tests");
 
test("library", function() {
  
  var lib = new MyLibrary.Lib("value")
  
  ok(lib!=undefined, "lib is definded");

});