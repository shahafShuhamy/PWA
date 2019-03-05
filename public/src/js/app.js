let enableNotifButtons = document.querySelectorAll('.enable-notifications');
var deferredPrompt;

if (!window.Promise) {
  window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function () {
      console.log('Service worker registered!');
    })
    .catch(function(err) {
      console.log(err);
    });
}

window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});

function displayConfirmNotification() {
  if ('serviceWorker' in navigator) {
    let options = {
      body: 'Your successfully subscribed to our Notification service',
      icon: '/src/images/icons/app-icon-96x96.png',
      image: 'src/images/sf-boat.jpg',
      dit: 'ltr',
      lang: 'en-US',                                                                  // BCP 47
      vibrate: [100, 50 ,200],                                                        // vibration, pause, vibration in milies.
      badge: '/src/images/icons/app-icon-96x96.png',
      tag: 'confirmation-notification',                                                // not setting tag makes push Nots stack - while setting it will overrite last tag push Not
      renotify: true,                                                                  // vibration on each new notifcation with the tag set.
      actions: [                                                                       // should check with the DEVICE targeted -> not very usefull!
        { action: 'confirm',title: 'Okay',icon: '/src/images/icons/app-icon-96x96.png' },
        { action: 'confirm',title: 'Okay',icon: '/src/images/icons/app-icon-96x96.png' }
      ]
    
    };
    navigator.serviceWorker.ready
      .then( (swreg) => {
        swreg.showNotification('Successfully Subscribed!', options);
      });
  }
}

function asForNotificationPermission() {                                              // personal-without service worker Notification
  Notification.requestPermission((result) => {
    console.log('user choise', result);
    if (result !== 'granted') {
      console.log('no notification perission granted!', result);
    } else {
        displayConfirmNotification();
    }
  });
}

if ('Notification' in window) {
  for (let i=0; i< enableNotifButtons.length; i++) {
    enableNotifButtons[i].style.display = 'inline-block';
    enableNotifButtons[i].addEventListener('click', asForNotificationPermission);
  }
}

