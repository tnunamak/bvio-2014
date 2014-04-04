function signinCallback(authResult) {
  if (authResult['status']['signed_in']) {
    console.log('user logged in');

    gapi.auth.setToken(authResult);

    window.googlePlusLoaded = true;

    // Update the app to reflect a signed in user
    // Hide the sign-in button now that the user is authorized, for example:

  } else {
    // Update the app to reflect a signed out user
    // Possible error values:
    //   "user_signed_out" - User is signed-out
    //   "access_denied" - User denied access to your app
    //   "immediate_failed" - Could not automatically log in the user
    console.log('Sign-in state: ' + authResult['error']);
  }
}

(function() {
  var po = document.createElement('script');
  po.type = 'text/javascript'; po.async = true;
  po.src = 'https://apis.google.com/js/client:plusone.js?onload=render';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(po, s);
})();

function render() {
  gapi.signin.render('customBtn', {
    //'callback': 'signinCallback',
    'clientid': '841077041629.apps.googleusercontent.com',
    'cookiepolicy': 'single_host_origin',
    'requestvisibleactions': 'http://schemas.google.com/AddActivity',
    'scope': 'https://www.googleapis.com/auth/plus.login'
  });
}