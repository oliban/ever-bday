var system = require('system');

// CONFIGURATION
var fbemail = system.args[1] || "user";
var fbpass = system.args[2] || "passsword";
var delay = 3000;
// CONFIGURATION

var page = require('webpage').create();
var testindex = 0, loadInProgress = false;

function evaluate(page, func) {
  var args = [].slice.call(arguments, 2);
  var str = 'function() { return (' + func.toString() + ')(';
  for (var i = 0, l = args.length; i < l; i++) {
    var arg = args[i];
    if (/object|string/.test(typeof arg)) {
      str += 'JSON.parse(\'' + JSON.stringify(arg) + '\'),';
    } else {
      str += arg + ',';
    }
  }
  str = str.replace(/,$/, '); }');
  return page.evaluate(str);
}

page.onConsoleMessage = function(msg) {
  console.log(msg);
};

page.onLoadStarted = function() {
  loadInProgress = true;
};

page.onLoadFinished = function() {
  loadInProgress = false;
};

var steps = [
  function() {
    console.log("Loading facebook.com...");
    page.open("http://facebook.com");
  }, function() {
    console.log("Logging in...");
    document.test = "hey"
    evaluate(page, function(fbemail, fbpass) {
      document.querySelector('input[name=email]').value = fbemail;
      document.querySelector('input[name=pass]').value = fbpass;
      document.querySelector('form').submit();
    }, fbemail, fbpass);
  }, function() {
    if (!page.evaluate(function(phantom) {
      if (document.querySelector('input[name=email]')) {
        console.log("Login failed. Check your credentials.");
        return false;
      }
      return true;
      })) { phantom.exit(); }
      
      console.log("Checking user settings page..");
      page.open("http://www.facebook.com/urgas?sk=info&edit=eduwork", function(status) {
        page.evaluate(function() {
		console.log("testing output..");
                console.log(document.querySelector("#pagelet_basic table.profileInfoTable td.data").innerText);

		console.log("Clicking edit button..");
		id = "basic_edit_button";
		var a = document.getElementById(id);
		var e = document.createEvent('MouseEvents');
  		e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);

		setTimeout (function() {
    			console.log("Looking for stuffs");
        		console.log(document.querySelector("#birthday_day").value);
        		document.querySelector("#birthday_day").value = 30;
        		console.log(document.querySelector("#birthday_day").value);
		
			var a = document.querySelector("table.uiGrid input[name=save]");
			console.log("mupp");
			console.log(a.value);
			var f = document.createEvent('MouseEvents');
  			f.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			console.log("Dispatching");
			a.dispatchEvent(f);


		}, 1000);


		phantom.exit();

        });
      });
    }, function() {
	console.log("Test");	
    }
];

interval = setInterval(function() {
  if (!loadInProgress && typeof steps[testindex] == "function") {
    steps[testindex]();
    //page.render("images/step" + (testindex + 1) + ".png");
    testindex++;
  }
  if (typeof steps[testindex] != "function") {
    clearInterval(interval);
    // phantom.exit();
  }
}, 50);
