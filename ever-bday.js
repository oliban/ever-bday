// This is my first github project
// Also note that I am not very good at js so use at your own risk.
// The Facebook login stuff was shamelessly copied from kdar's fbpoke project at https://github.com/kdar/fbpoke.git so all creds with the login goes to him.
// Running this requires phantomjs that can be found here: https://github.com/ariya/phantomjs.git
// 
// So.. what does this baby do?
// It logs you into your Facebook account and changes your birthday to tomorrows date.
// I figured it would be fun to have a birthday every day.
// However, Facebook restricts the changing of birthday.. not sure yet how long you have to wait until you can change it again but I'm sure to find out now since I have this script that my crontab runs every day.
// I'll update these docs when I know.
//
// Installing: Install phantomjs and make sure you have a binary.
// Run this script through the phantomjs binary: /path/phantomjs ever-bday/ever-bday.js
//
// Ok have fun now! Let me know if you're using this for something. fredrik.safsten@gmail.com
//
// 1) TODO: Log out first if already logged in.
// 2) Cleanup messy code, especially the ridiculus 25 second limit
// 3) Procrastinate
//
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

        		document.querySelector("#birthday_day").value = tomorrowDay;
        		document.querySelector("#birthday_month").value = tomorrowMonth;
	
			console.log("Changing b-day to " + tomorrowDay + "-" + tomorrowMonth);
	
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
