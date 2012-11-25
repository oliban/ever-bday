console.log("got here");
var page = require('webpage').create();

page.onConsoleMessage = function(msg) {
    console.log(msg);
};


page.open("http://facebook.com", function(status) {
    if ( status === "success" ) {
        page.evaluate(function() {
              document.querySelector("input[name='email']").value = "email";
              document.querySelector("input[name='pass']").value = "pass";
              document.querySelector("#login_form").submit();

              console.log("Login submitted!");
        });
        window.setTimeout(function () {
          page.render('colorwheel.png');
          phantom.exit();
        }, 5000);
   }
});
