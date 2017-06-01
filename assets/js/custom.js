// if (userParticipating == "true" /*&& pushEnabled == "false"*/) {
//   setTimeout(function () {
//     /*Enable push modal*/
//     $('.ask-push.modal').click(function (e) { ga('send', 'event', 'WebApp', 'modal', 'ask_for_push_notifications'); });
//     $('.ask-push.modal').modal({
//       closable: true,
//       onDeny: function () {
//         window.alert('Wait not yet!');
//         return false;
//       },
//       onApprove: function () {
//         window.alert('Approved!');
        
//       }
//     }).modal('show');
//   }, 4000);
// }



/*Handel webapp "add to home" user event*/
window.addEventListener('beforeinstallprompt', function (e) {
  // beforeinstallprompt Event fired

  // e.userChoice will return a Promise.
  e.userChoice.then(function (choiceResult) {

    console.log(choiceResult.outcome);

    if (choiceResult.outcome == 'dismissed') {
      ga('send', 'event', 'WebApp', 'add_to_home', 'cancel_button');
    }
    else {
      ga('send', 'event', 'WebApp', 'add_to_home', 'accept_button');
    }
  });
});


/*Points notifications*/
var beforePoints = -1;
function updateParticipationInfo() {
  $.ajax({
    type: "GET",
    url: '//' + window.location.host + '/api/participation/info',
    dataType: "json",
    data: {
      userId: $.cookie("userId"),
      promoId: promoId
    },
    success: function (data) {

      //Actualiza la variable de puntos anterior por primera vez para tener constancia de los cambios
      if (beforePoints == -1) {
        beforePoints = data.beforePoints;
      }

      console.log(data);

      $(".avgPoints").html(data.avgPoints);
      $(".userPoints").html(data.userPoints);
      $(".particNumber").html(data.particNumber);
      $(".visualNumber").html(data.visualNumber);
      $(".particPoints").html(data.particPoints);
      $(".visualPoints").html(data.visualPoints);

      if ((data.userPoints - beforePoints) > 0 && (data.userPoints - beforePoints) < 10) {
        notifyPoints(0, data.userPoints - beforePoints);
      } else if ((data.userPoints - beforePoints) >= 10) {
        notifyPoints(1, data.userPoints - beforePoints);
      }

      userPoints = data.userPoints;
    },
    error: function () {
      console.error("Participation data not available");
    }
  });
}


//Actualización de datos de participantes cada 5 segundos =====================
//  updateParticipationInfo();
var bucleActualizacionPuntos = setInterval(function () {
  if (promoEnded == "false" && userParticipating == "true") {
    updateParticipationInfo();
  } else {
    clearInterval(bucleActualizacionPuntos);
  }
}, 10000);


/*Fixed menu open-close*/
$('.ui.sticky.fixed.bottom').click(function () {
  $('.angle.up.icon.link').toggle();
  $('.collapsable-content').transition('fade up');
});


/*Remaining time logic*/

//Restart timer on focus
$(window).focus(function () {
  window_focus = true;
  countDown();
})
countDown();

var clockInterval; //Global var
function countDown() {

  //Reinicia el Intevalo anterior
  if (clockInterval != null) {
    clearInterval(clockInterval);
  }

  var display = $('.time strong');
  var today = new Date();

  //var vector_fecha_limite = fecha_limite.split("/"); //variable fecha_limite en DOM !!!
  //var vector_hora_limite = fecha_limite.split(" ");
  //var fecha_limite_objeto = new Date(vector_fecha_limite[2].substring(0, 4), vector_fecha_limite[1] - 1, vector_fecha_limite[0], vector_hora_limite[1].substring(0, 2), vector_hora_limite[1].substring(3, 5), '00', '00');

  //var endDate = new Date(); //debug date
  //endDate.setDate(endDate.getDate() + 5);
  var endDate = endPromotionDate;
  console.log("today: " + today.toLocaleString());
  console.log("finaliza el: " + endDate.toLocaleString());

  if (endDate > today) {
    var diffTime = (endDate.getTime() - today.getTime()) / 1000;
    clockInterval = downTimer(diffTime, display);
  } else {
    console.log("promoción ya estaba finalizada");
    //window.location.reload(true); //reload promotion
  }
}


function downTimer(duration, display) {
  var timer = duration,
    hours, minutes, seconds;
  var periode = setInterval(function () {
    hours = parseInt(timer / 3600, 10);
    minutes = parseInt((timer - hours * 3600) / 60, 10);
    seconds = parseInt(timer % 60, 10);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.html(hours + "h " + minutes + "m " + seconds + "s ");

    if (--timer < 0) {
      console.log("promoción acaba de finalizar");
      clearInterval(periode);
      window.location.reload(true); //reload promotion
    }
  }, 1000);
  return periode; //devuelve el Intervalo para ser cancelado postriormente
}

/*Google Maps + StreetView*/
function initialize() {

  var coor = {
    //lat: 39.4851826,
    //lng: -0.3634006
    lat: parseFloat(promoLat),
    lng: parseFloat(promoLng)
  };
  var map = new google.maps.Map(document.getElementById('map'), {
    center: coor,
    zoom: 17
  });
  var panorama = new google.maps.StreetViewPanorama(
    document.getElementById('pano'), {
      position: coor,
      pov: {
        heading: 34,
        pitch: 10
      }
    });
  var reCenter = new google.maps.LatLng(coor);
  map.setCenter(reCenter);
  map.setStreetView(panorama);


}

/*Geolocalization button*/
function geoFindMe() {
  var output = document.getElementById("out");

  if (!navigator.geolocation) {
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }

  //On geo. success handler
  function successGeoLocHandler(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

    var img = new Image();
    img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";

    output.appendChild(img);
  }

  //On geo. error handler
  function errorGeoLocHandler() {
    output.innerHTML = "Unable to retrieve your location";
  }

  output.innerHTML = "<p>Locating…</p>";
  navigator.geolocation.getCurrentPosition(successGeoLocHandler, errorGeoLocHandler);
}


function doParticipate(phone, email, firstName, lastName, facebookId, googleId, profileImg) {
  var cookiePromotions = $.cookie('promotions');

  function getQueryVariable(index) {
    var query = window.location.toString();
    var parts = query.split("/");
    return parts[index];
  }

  let refFriend = getQueryVariable(4);


  var form = {
    "email": email,
    "phone": phone,
    "firstName": firstName,
    "lastName": lastName,
    "facebookId": facebookId,
    "googleId": googleId,
    "profileImg": profileImg,
    "promoId": promoId,
    "promo_id": promo_id,
    "refFriend": refFriend,
  };

  $.ajax({
    type: "POST",
    url: '//' + window.location.host + '/api/participate/',
    data: form,
    success: function (response) {
      console.log('Perticipating successfuly: ' + response);
      window.location.reload(true); //reload promotion
    },
    error: function (error) {
      console.error('Error when trying to participate: ' + error);
    }
  });

  e.preventDefault();
  return false;


}

/*Facebook Login*/
window.fbAsyncInit = function () {
  FB.init({
    appId: '1485419298444998',
    cookie: true, // enable cookies to allow the server to access the session
    xfbml: true, // parse social plugins on this page
    version: 'v2.8' // use graph api version 2.8
  });

  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  FB.getLoginStatus(function (response) {
    /////statusChangeCallback(response); //NOT PARTICIPATE BY DEFAULT
  });
};

// Load the SDK asynchronously
(function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = "//connect.facebook.net/es_ES/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me?fields=id,name,first_name,last_name,email,picture,permissions', function (response) {

    if (response.permissions.data[1].status === 'declined') {

      //  document.getElementById('status').innerHTML = 'We also need your email.<button onClick="javasript:reAskForEmail()">GIVE MY EMAIL</button>';

    } else {
      console.log('Successful login for: ' + response.name);
      //  document.getElementById('status').innerHTML = 'Thanks for logging in, ' + response.name + '! Your email is: ' + response.email;
      ga('send', 'event', 'WebApp', 'buttton', 'participate_facebook_inner_button');
      doParticipate(undefined, response.email, response.first_name, response.last_name, response.id, undefined, response.picture.data.url);
    }
  });
}

function loginBtn() {
  FB.login(function (response) {
    statusChangeCallback(response);
  }, {
      scope: 'email,public_profile'
    });
}

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
  console.log('statusChangeCallback');
  console.log(response);
  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  if (response.status === 'connected') {
    // Logged into your app and Facebook.
    testAPI();
  } else if (response.status === 'not_authorized') {
    // The person is logged into Facebook, but not your app.
    //////document.getElementById('status').innerHTML = 'Please log into this app nnn.';
  } else {
    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
    //////document.getElementById('status').innerHTML = 'Please log into Facebook ccc.';
  }
}

// Ask one more time about the email if the user has unchecked it before
function reAskForEmail() {
  FB.login(function (response) {
    console.log('Rerequest succesful');
    statusChangeCallback(response);
  }, {
      scope: 'email,public_profile',
      return_scopes: true,
      auth_type: 'rerequest'
    });
}



/*Google Login*/

// Enter an API key from the Google API Console:
//   https://console.developers.google.com/apis/credentials
var apiKey = 'AIzaSyD0Zii_g_wXuaIrIHW5xv62fTFrfPc0bPY';

// Enter the API Discovery Docs that describes the APIs you want to
// access. In this example, we are accessing the People API, so we load
// Discovery Doc found here: https://developers.google.com/people/api/rest/
var discoveryDocs = ["https://people.googleapis.com/$discovery/rest?version=v1"];

// Enter a client ID for a web application from the Google API Console:
//   https://console.developers.google.com/apis/credentials?project=_s
// In your API Console project, add a JavaScript origin that corresponds
//   to the domain where you will be running the script.
var clientId = '208662593023-osoiommdi22b0m7ejdugt18if7iggt9e.apps.googleusercontent.com';

// Enter one or more authorization scopes. Refer to the documentation for
// the API or https://developers.google.com/people/v1/how-tos/authorizing
// for details.
var scopes = 'profile';
var authorizeButton = document.getElementById('google-login');
// var signoutButton = document.getElementById('signout-button');
function handleClientLoad() {
  // Load the API client and auth2 library
  gapi.load('client:auth2', initClient);
}
var isSignedInGoogle = false;
function initClient() {
  gapi.client.init({
    apiKey: apiKey,
    discoveryDocs: discoveryDocs,
    clientId: clientId,
    scope: scopes
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    // Handle the initial sign-in state.
    /////// updateSigninStatus();
    isSignedInGoogle = gapi.auth2.getAuthInstance().isSignedIn.get();
    updateSigninStatus(false);
    authorizeButton.onclick = handleAuthClick;
    // signoutButton.onclick = handleSignoutClick;
  });
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    // authorizeButton.style.display = 'none';
    // signoutButton.style.display = 'block';
    makeApiCall();
  } else {
    // authorizeButton.style.display = 'block';
    // signoutButton.style.display = 'none';
  }
}

function handleAuthClick(event) {
  console.log("login handle" + event);
  if (isSignedInGoogle) {
    makeApiCall();
  } else {
    gapi.auth2.getAuthInstance().signIn();
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
  }



}

//function handleSignoutClick(event) {
//  gapi.auth2.getAuthInstance().signOut();
// }

// Load the API and make an API call.  Display the results on the screen.
function makeApiCall() {
  gapi.client.people.people.get({
    resourceName: 'people/me'
  }).then(function (resp) {
    ga('send', 'event', 'WebApp', 'buttton', 'participate_google_inner_button');
    var name = resp.result.names[0].displayName;
    var givenName = resp.result.names[0].givenName;
    var familyName = resp.result.names[0].familyName;
    var email = resp.result.emailAddresses[0].value;
    var profileImage = resp.result.photos[0].url;
    var id = resp.result.metadata.sources[0].id;

    doParticipate(undefined, email, givenName, familyName, undefined, id, profileImage);

    // var p = document.createElement('p');
    //  p.appendChild(document.createTextNode('Hello, ' + name + '! Your email is: ' + email));
    // document.getElementById('content').appendChild(p);
  });
}




$(document).ready(function () {


  //Funcion para notificar la obtencion de nuevos puntos
  function notificarPuntos(tipo, puntos) {

    var textoMensaje, tipoAlerta, puntos, plantillaEspecial, tiempoEspera;
    switch (tipo) {
      case 0:
        tiempoEspera = 10000;
        textoMensaje = 'Nuevo amigo visitando tu enlace. Anímalos a participar.';
        tipoAlerta = 'success';
        plantillaEspecial = '<br> <p class="text-center" style="font-size: large"></p> <p class="text-center" style="font-size: x-large;"><strong>+ ' + puntos + textoPuntos + '  </strong></p><span class="text-center center-block "><small>  Hemos añadido los puntos a tu perfil.</small></span>';
        navigator.vibrate([100, 0, 90]);
        break;
      case 1:
        tiempoEspera = 10000;
        textoMensaje = 'Nuevo amigo participando. Sigue compartiendo.';
        tipoAlerta = 'warning';
        plantillaEspecial = '<br> <p class="text-center" style="font-size: large"></p> <p class="text-center" style="font-size: x-large;"><strong>+ ' + puntos + textoPuntos + '  </strong></p><span class="text-center center-block "><small>  Hemos añadido los puntos a tu perfil.</small></span>';
        navigator.vibrate([120, 0, 100]);
        break;
      case 3:
        tiempoEspera = 10000;
        textoMensaje = 'Te regalamos unos puntos para empezar. Invita a tus amigos para tener más posibilidades de ganar.';
        tipoAlerta = 'warning';
        plantillaEspecial = '<br> <p class="text-center" style="font-size: large"></p> <p class="text-center" style="font-size: x-large;"><strong>+ ' + puntos + textoPuntos + '  </strong></p><span class="text-center center-block "><small>  Hemos añadido los puntos a tu perfil.</small></span>';
        navigator.vibrate([120, 0, 100]);
        break;
      case 10:
        tiempoEspera = 7000;
        textoMensaje = 'Acabas de recibir una invitación para participar en la promoción.';
        tipoAlerta = 'warning';
        plantillaEspecial: '...';
        navigator.vibrate([120, 0, 100]);
        break;
      case 11:
        tiempoEspera = 7000;
        textoMensaje = 'Participa y comparte la promoción con tus amigos.';
        tipoAlerta = 'warning';
        plantillaEspecial: '...';
        navigator.vibrate([120, 0, 100]);
        break;
      case 12:
        tiempoEspera = 7000;
        textoMensaje = 'Por cada amigo que visite tu enlace consigues 1 punto, y si participa 10.';
        tipoAlerta = 'warning';
        plantillaEspecial: '...';
        navigator.vibrate([120, 0, 100]);
        break;
    }
    var textoPuntos = (puntos == 1) ? ' punto' : ' puntos';
    return $.notify({
      icon: 'fa fa-user-plus',
      title: textoMensaje,
      message: plantillaEspecial
    }, {
        type: tipoAlerta,
        delay: tiempoEspera,
        animate: {
          enter: 'animated flipInY',
          exit: 'animated flipOutX'
        },
        newest_on_top: true,
        template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">  <button type="button" aria-hidden="true" class="close"  data-notify="dismiss">×</button>        <span data-notify="icon"></span>            <span data-notify="title" style="font-size: medium;font-weight: bold">{1}</span>            <span data-notify="message">{2}</span>            <div class="progress" data-notify="progressbar"> <div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div> </div> <a href="{3}" target="{4}" data-notify="url"></a> </div>'
      });
  }

  var notificacion = null;

  /*
   //Obtiene los parametros de la url REST
      function getQueryVariable(index) { 
          var query = window.location.toString();
          var parts = query.split("/");
          return parts[index];
      }
  
  var notif10 = null;
   if (getQueryVariable(4)) {
     notif10 = notificarPuntos(10);
  } 
  */





  function notifyPoints(tipo, puntos) {

    if (notificacion != null) {
      notificacion.close();
    }
    notificacion = notificarPuntos(tipo, puntos);

    //quitar al hacer clic
    $('.alert').click(function () {
      notificacion.close();
    });
    //quitar al deslizar el dedo
    $('.alert').on('swipe', function () {
      notificacion.close();
    });
  }




  $('button.login-participate').click(function (e) {
    $(this).attr("disabled", "disabled");
    e.preventDefault();
    var inputFormParticipate = $('.participate-input').val();
    if (type == 'phone') {
      ga('send', 'event', 'WebApp', 'buttton', 'participate_phone_inner_button');
      doParticipate(inputFormParticipate, undefined, undefined, undefined, undefined, undefined, undefined);

    } else if (type == 'email') {
      ga('send', 'event', 'WebApp', 'buttton', 'participate_email_inner_button');
      doParticipate(undefined, inputFormParticipate, undefined, undefined, undefined, undefined, undefined);
    }

  })

  var state = false;
  var type = '';
  function checkIfValidLoginEnableButton() {
    var checked = $('.accept-terms').is(':checked');
    if (state && checked) {
      $('button.login-participate').prop('disabled', false);
    } else {
      $('button.login-participate').prop('disabled', true);
    }
  }

  $('.accept-terms').change(function () {
    checkIfValidLoginEnableButton();
  })

  $('.participate-input').on('keyup change paste  ', function (e) {

    var $icon = $('.verify-icon');

    if ($(this).val().length > 0) {
      $('.participate-form-ext').show();
    } else {
      $('.participate-form-ext').hide();
    }



    var regEmail = /[a-zA-Z0-9]+(?:(\.|_)[A-Za-z0-9!#$%&'*+/=?^`{|}~-]+)*@(?!([a-zA-Z0-9]*\.[a-zA-Z0-9]*\.[a-zA-Z0-9]*\.))(?:[A-Za-z0-9](?:[a-zA-Z0-9-]*[A-Za-z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/;
    var regMovil = /[6|7]{1}[0-9]{8}/;
    var regNoSpaces = /^\S+$/;

    var inputFormParticipate = $('.participate-input').val();



    // Datos no introducidos-------------------------------------

    if (inputFormParticipate.length === 0) {
      state = false;
    }

    // Movil o Email valido -------------------------------------

    if (regNoSpaces.test(inputFormParticipate) && regMovil.test(inputFormParticipate) && inputFormParticipate.length == 9) {
      state = true;
      type = 'phone';
    } else if (regNoSpaces.test(inputFormParticipate) && regEmail.test(inputFormParticipate)) {
      state = true;
      type = 'email';
    } else {
      state = false;
      type = '';

    }

    // Comprobar estado para cambiar imagen error/ok -------------
    if (state) {

      $icon.attr('class', 'green icon checkmark verify-icon');
      checkIfValidLoginEnableButton();

    } else {

      $icon.attr('class', 'red icon remove verify-icon');
      checkIfValidLoginEnableButton();

      if ($(this).val() <= 0) {

        $icon.attr('class', 'verify-icon');
      }
    }
  });






  /*jQuery selectors triggerers*/
  $('.geoloc-button').click(geoFindMe);
  $('#facebook-login').click(loginBtn);


  /*end of jQuery selectors triggerers*/

  /*Share buttons*/
  $('.whatsapp.button').click(function () {
    ga('send', 'event', 'WebApp', 'buttton', 'whatsapp_share_button');
    window.location = 'whatsapp://send?text=' + shareMessage + ' https://whatspromo.com/' + promoId + '/' + $.cookie("userId");
  });
  $('.messenger.button').click(function () {
    ga('send', 'event', 'WebApp', 'buttton', 'fbmessenger_share_button');
    var link = 'https://whatspromo.com/' + promoId+ '/' + $.cookie("userId"); ;
    var app_id = '1485419298444998';
    window.location = 'fb-messenger://share?link=' + encodeURIComponent(link) + '&app_id=' + encodeURIComponent(app_id);
  });

  /*Accordion Menu*/
  $('.ui.accordion').accordion({
    onOpen : function(){
      
      //Refresh map
      google.maps.event.trigger(map, "resize");
    }
  });

  $('#accordion .panel-heading').click(function () {
    var elements = $('#accordion .panel-heading');
    if (!$(this).hasClass('opened')) {
      elements.removeClass('opened');
    }
    $(this).toggleClass('opened');

    
  });


  /*Sidebar Menu*/
  // create sidebar and attach to open menu
  $('.ui.sidebar').sidebar('attach events', '.toc.item');
  $('.ui.sidebar').sidebar('setting', {
    dimPage: true,
  });


  /*Login modal*/
  $('.modal.login').click(function (e) { ga('send', 'event', 'WebApp', 'buttton', 'participate_button'); });
  $('.modal.login').modal('attach events', '.button.participate', 'show');

  /*Profile modal*/
  $('.modal.profile').click(function (e) { ga('send', 'event', 'WebApp', 'buttton', 'profile_button'); });
  $('.modal.profile').modal('attach events', '.item.profile', 'show');

  /*Settings modal*/
  $('.modal.settings').click(function (e) { ga('send', 'event', 'WebApp', 'buttton', 'settings_share_button'); });
  $('.modal.settings').modal('attach events', '.item.settings', 'show');

  /*Report modal*/
  $('.modal.report').click(function (e) { ga('send', 'event', 'WebApp', 'buttton', 'report_share_button'); });
  $('.modal.report').modal('attach events', '.item.report', 'show');

  /*Share promo modal*/
  $('.modal.login').click(function (e) { ga('send', 'event', 'WebApp', 'buttton', 'general_share_button'); });
  $('.modal.share').modal('attach events', '.button.share', 'show');

  /*FAQ's modal*/
  $('.modal.faqs').click(function (e) { ga('send', 'event', 'WebApp', 'buttton', 'faqs_button'); });
  $('.modal.faqs').modal('attach events', '.item.faqs', 'show');

  $('XX.modal.login')
    .modal({
      closable: false,
      onDeny: function () {
        window.alert('Wait not yet!');
        return false;
      },
      onApprove: function () {
        window.alert('Approved!');
      }
    });

  /*Checkbox input*/
  $('.ui.checkbox').checkbox();

  /*ZipCodes dropdown (needs a querified API passing /{query})*/
  $('.ui.dropdown').dropdown({
    apiSettings: {
      url: 'https://gist.githubusercontent.com/dacripo/a48e408d1eca3187c983da04b0edf313/raw/1187038ad1f4a8d92023b5e63aaad2bf640c6a01/zipcodes-spain.json?q={query}',
      saveRemoteData: false
    }
  });



});
