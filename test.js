console.log("got here");
var page = require('webpage').create();

page.onConsoleMessage = function(msg) {
    console.log(msg);
};


page.open("http://facebook.com", function(status) {
    if ( status === "success" ) {
        page.evaluate(function() {
		// Yes, these are fake credentials but feel free to test me on that. :)
		// No, the creds in the inital commit won't work either. :)
              document.querySelector("input[name='email']").value = "yolo";
              document.querySelector("input[name='pass']").value = "fakepass";
              document.querySelector("#login_form").submit();
              console.log("Login submitted!");
        });

console.log("waiting");
page.setTimeout(function () {
console.log('done waiting'); 

//page.open("http://www.facebook.com/urgas?sk=info&edit=eduwork", function(status) {
page.open("http://www.facebook.com/urgas", function(status) {
	if (status === "success") {
		page.evaluate(function() {
			console.log("testing output..");
			console.log(document.querySelector("table.profileInfoTable td.data").innerText);
			//console.log(document.querySelector("table.uiInfoTable td.data").innerText);
		});
	} else {
		console.log("Accessing page FAILED");
		console.log(status);
	}
});

}, 1000);

        window.setTimeout(function () {
          page.render('colorwheel.png');
          console.log("Phantom out!");
	  phantom.exit();
        }, 5000);
   }
});

