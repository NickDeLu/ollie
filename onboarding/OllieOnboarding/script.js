setTimeout(function(){ 
  console.log(window.location.href )
  if(window.location.href == 'http://127.0.0.1:5500/onboarding/OllieOnboarding/index.html'){
    console.log('its true')
    window.location.href = "http://127.0.0.1:5500/onboarding/OllieOnboarding/summarize.html"; 
  }
}, 3000);