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
    var today = new Date();
    console.log("----------------------------------------");
    console.log(today.toString());
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
        		var day = document.querySelector("#birthday_day");
			if (day.getAttribute("disabled") == 1) {
				console.log('Cannot change.. Aborting.');
				return false;
			}
			console.log("Ok.. we're good.. let's rumble!");
			
			var today = new Date();
			var tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
			console.log("New birthday: " +tomorrow);

			var tomorrowDay = tomorrow.getDate().toString();
                        var tomorrowMonth = tomorrow.getMonth().toString();
                        var tomorrowYear = tomorrow.getFullYear().toString();

        		document.querySelector("#birthday_day").value = tomorrowDay;
        		document.querySelector("#birthday_month").value = tomorrowMonth;
        		document.querySelector("#birthday_year").value = tomorrowYear;
	
			console.log("Changing b-day to " + tomorrowDay + "-" + tomorrowMonth + "-" + tomorrowYear);
	
			var a = document.querySelector("table.uiGrid input[name=save]");
			var f = document.createEvent('MouseEvents');
  			f.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			a.dispatchEvent(f);
			return true;
		}, 1500);
		
        });
      });
}];

interval = setInterval(function() {
  if (!loadInProgress && typeof steps[testindex] == "function") {
    steps[testindex]();
    //page.render("images/step" + (testindex + 1) + ".png");
    testindex++;
  }
  if (typeof steps[testindex] != "function") {
    clearInterval(interval);
    setTimeout (function() {
    	console.log("The party is over, good bye!");
	phantom.exit();
    }, 25000);
  }
}, 500);
