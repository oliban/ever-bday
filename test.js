console.log("got here");
var page = require('webpage').create();

page.onConsoleMessage = function(msg) {
    console.log(msg);
};


page.open("http://facebook.com", function(status) {
    if ( status === "success" ) {
        page.evaluate(function() {
              document.querySelector("input[name='email']").value = "urgas";
              document.querySelector("input[name='pass']").value = "apedick";
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

