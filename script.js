  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 320; // We will scale the photo width to this
  var height = 0; // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  var video = null;
  var canvas = null;
  var startbutton = null;
  var message = null;

testing = document.querySelector(".getresponse")

  function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    startbutton = document.getElementById('startbutton');
    message = document.getElementById('message');

    

    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      })
      .then(function (stream) {
        video.srcObject = stream;

        video.play();
      })
      .catch(function (err) {
        console.log("An error occurred: " + err);
      });

    video.addEventListener('canplay', function (ev) {
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth / width);

        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.

        if (isNaN(height)) {
          height = width / (4 / 3);
        }

        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
      
        streaming = true;
      }
    }, false);

    startbutton.addEventListener('click', function (ev) {
      takepicture();
      ev.preventDefault();
    }, false);

    clearphoto();
    
    message.addEventListener('click', function (ev) {
      send();
      ev.preventDefault();
    }, false);
    
  }
  function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);
  
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  
    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
  
    // create a view into the buffer
    var ia = new Uint8Array(ab);
  
    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
  
    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], {type: mimeString});
    return blob;
  
  }
  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');

  }

function send() {
var link = 'mailto:agupta-22@peddie.org?subject=Customer Inquiry'
+document.getElementById('email').value
+'&body='+document.getElementById('email').value;
window.location.href = link;
}



  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      console.log(video.src)
      context.drawImage(video,0,0, width, height);
      context.rect(90,0,140,240);
      context.lineWidth = "3";
      context.strokeStyle = "red";    
      context.stroke();
      let output;
      output = canvas.toDataURL('image/jpeg'); 
      console.log(output);
      send(dataURItoBlob(output),"test");
      return output;
    } else {
      clearphoto();
    }
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener('load', startup, false);
  function send(image,fileName){
   

                var formData = new FormData();
                
                formData.append('userImage',image,fileName);
                
                // formData.append('userBookImage',document.getElementById().files[0],fileName);

                var xhr = new XMLHttpRequest();
                
                xhr.open('POST', 'https://exchange.peddie.org/signLanguage/uploadUserBook', true);
                console.log("hello console from add");
                xhr.timeout=15000;//added ten second timeout 
               
                xhr.ontimeout = function(){
                    alert("error code #67, image upload timed out, please report this to compsciclub@peddie.org");
                    
                    var variablesJson=[];
                    
                    
                 //   $.post('https://exchange.peddie.org/nodejs/reportFrontEndError',{error:"code67",variables:variablesJson});
                    
                  //  window.location.replace("https://exchange.peddie.org/Sellerpage.html");
                }
                xhr.onload = function(){
                	console.log("reached the load"); 
                	console.log(xhr.response);
                	testing.innerHTML = xhr.response;
                    console.log(xhr.responseText);
                	
                }
                xhr.onerror = function () {
                    alert("error code #68, image upload failed, please report this to compsciclub@peddie.org");
                    
                    var variablesJson=[];
                    
                    $.post('https://exchange.peddie.org/nodejs/reportFrontEndError',{error:'code68',variables:variablesJson});
                    
                   // window.location.replace("https://exchange.peddie.org/Sellerpage.html");
                };
              
                xhr.send(formData);
              }