angular.module('starter.ownServices', [])

  /*----------------------------------------------------------------------------*/
  /* MidataService for the use of x3a (^.^)
  /* isels1
  /* The comments should show "how to use it"
  /*----------------------------------------------------------------------------*/
  // Use this service like all others:
  // --> Add reference to your index.html (<script src="js/midataServices.js"></script>)
  // --> Add module to the app.js service list ('starter.ownServices')
  // --> Add service to the controller params (ownMidataService)
  // --> Now it should work
  .service('ownMidataService', [function() {

    // Set your own appname and appscr. Not in the app.js anymore
    var appname = 'MitrendS3';
    var appsecr = 'Mi3636trend9696S003';


    var authToken = '';
    var refreshToken = '';

    // Creating the object to handle midata-requests
    var md = new midata.Midata(
      'https://demo.midata.coop:9000', appname, appsecr);

    var bundle = new midata.Bundle('transaction');

    // Login function (call it with ownMidataService.login(un, pw, role))
    // Sets the authToken and refreshToken (not really used anywhere)
    // -->  un:   Unsername
    // -->  pw:   Passwort
    //            The user Role can be 'member', 'provider', 'developer' or 'research'
    function login(un, pw) {
      md.login(un, pw)
        .then(function() {
          console.log('Logged in!');
          authToken = md.authToken;
          refreshToken = md.refreshToken;
          console.log(md);
        });
    }

    // Check if logged in (call it with ownMidataService.loggedIn())
    // returns true if logged in and false if not
    function loggedIn() {
      return md.loggedIn;
    }

    // Logout function (call it with ownMidataService.logout())
    function logout() {
      md.logout();
      console.log(md.authToken);
    }


    function addToBundle(res) {
      console.log("hallo");
      //return new Promise < string > ((resolve, reject) => {
      try {
        bundle.addEntry("POST", "Observation", res);
        //  resolve('Entry added');
      } catch (e) {
        //return ERROR
        //reject(e);
      }
      //})
    }

    function saveBundle() {
      console.log(bundle.toJson());
      md.save(bundle);
    }

    // TO BE CONTINUED... (/-.-)/ |__|

    return {
      login: login,
      loggedIn: loggedIn,
      logout: logout,
      addToBundle: addToBundle,
      saveBundle: saveBundle
    }
  }]);
