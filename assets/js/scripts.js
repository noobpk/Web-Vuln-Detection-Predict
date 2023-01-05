(function (window, undefined) {
  'use strict';

  /*
  NOTE:
  ------
  PLACE HERE YOUR OWN JAVASCRIPT CODE IF NEEDED
  WE WILL RELEASE FUTURE UPDATES SO IN ORDER TO NOT OVERWRITE YOUR JAVASCRIPT CODE PLEASE CONSIDER WRITING YOUR SCRIPT HERE.  */

  function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  var isRtl = $('html').attr('data-textdirection') === 'rtl';
  var api = 'https://web-vuln-detection.hptcybersec.com';

  // On load Toast
  setTimeout(function () {
    toastr['success'](
      'Web Application Vulnerabilities Detection v1.0',
      '👋 Welcome!',
      {
        closeButton: true,
        tapToDismiss: false,
        rtl: isRtl
      }
    );
  }, 2000);

  // On check API
  setTimeout(function () {
    fetch(api)
    .then((response) => {})
    .then((data) => {
      toastr['success']('🔮 Connected to API', 'Success!', {
        closeButton: true,
        tapToDismiss: false,
        rtl: isRtl
      });
    })
    .catch((error) => {
      toastr['error']('❌ '+ error, 'Error!', {
        closeButton: true,
        tapToDismiss: false,
        rtl: isRtl
      });

      // Handle the connection error
      let apiConnectStatus = document.getElementById('api-connect-status');
      
      // Add a new class to the element
      apiConnectStatus.classList.add('bg-light-danger');

      // Remove a class from the element
      apiConnectStatus.classList.remove('bg-light-success');


    });
  }, 3000)

  //Socket.io
  var socket = io.connect(api);

  socket.on('connect', function() {
    console.log('Connected to the server');

    // Load first message
    socket.emit('requestData');
    // Send a message to the server every 40 seconds
    setInterval(function() {
      socket.emit('requestData');
    }, 40000);
  });
  
  socket.on('connect_error', function(error) {
    // Handle the connection error
    let websocketConnectStatus = document.getElementById('websocket-connect-status');
    let websocketSpinner = document.getElementById('websocket-spinner');

    // Add a new class to the element
    websocketConnectStatus.classList.add('bg-light-danger');
    websocketSpinner.classList.add('text-danger');

    // Remove a class from the element
    websocketConnectStatus.classList.remove('bg-light-success');
    websocketSpinner.classList.add('text-success');
  });

  socket.on('message', function(data) {
    console.log(data); // Outputs "Hello from the server!"
  });

  socket.on('responseData', function(msg) {
    // Handle the data received from the server
    const rec_data = msg.data;
    let html = '';
    for (const key in rec_data) {
      let alert = '';

      if(rec_data[key] >= 80) {
        alert = 'alert-danger';
      }else if(rec_data[key] >= 50) {
        alert = 'alert-warning';
      }else if(rec_data[key] < 50) {
        alert = 'alert-primary';
      }

      html += `<div class="alert ${alert}" role="alert">`
      html += `<h4 class="alert-heading">Accuracy: ${rec_data[key]}</h4>`
      html += `<div class="alert-body">${htmlEntities(key)}</div>`
      html += `</div>`;
    }

    $('#other-predictions').html(html);
  });

  // Select the element
  let vulns_bage = document.querySelectorAll('.vuln-bage');
  // Define an array of colors
  let colors = ['bg-primary', 'bg-secondary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'bg-dark'];

  // Loop through the elements
  for (let badge of vulns_bage) {
    // Generate a random index
    let randomIndex = Math.floor(Math.random() * colors.length);

    // Select the random color
    let randomColor = colors[randomIndex];

    // Set the background color of the element
    badge.className += ' ' + randomColor;
  }

  $('#textRadio').on('click', function () {
    let input = document.querySelector('#formFile');
    input.value = '';
    $('.vuln-text-payload').css({
      display: 'inline'
    });

    $('.vuln-file-upload').css({
       display: 'none'
    });

    // Remove enctype in form 
    $('#predictForm').removeAttr('enctype');

  });

  $('#fileRadio').on('click', function () {
    let input = document.querySelector('#textpayload');
    input.value = '';
    $('.vuln-text-payload').css({
      display: 'none'
    });

    $('.vuln-file-upload').css({
      display: 'inline'
    });

    // Add enctype in form 
    $('#predictForm').attr('enctype', 'application/x-www-form-urlencoded');
  });

  const predict = (data, type) => {
    var formdata = new FormData();
    if(type === 'text') {
      let body = JSON.stringify({"data": data});
      var requestOptions = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: body,
      };
    } else {
      formdata.append("file", data);
      var requestOptions = {
        method: 'POST',
        body: formdata,
      };
    }

    fetch(api+'/predict', requestOptions)
    .then((res) => res.json())
    .then((data) => {
      if(data.status == 'Success') {
        // store old data
        const storeData = {
          [data.accuracy]: data.prediction
        };
        localStorage.setItem('your_predictions', JSON.stringify(storeData));
        
        if(data.accuracy >= 80) {
          toastr['success']('Accuracy: '+data.accuracy, '✨✨✨✨✨', {
            closeButton: true,
            tapToDismiss: false,
            rtl: isRtl
          });

          $('#your-predictions').append(`<div class="alert alert-danger" role="alert">
                                  <h4 class="alert-heading">Accuracy: ${data.accuracy}</h4>
                                <div class="alert-body">${data.prediction}</div>
                              </div>`).html();

        }else if(data.accuracy >= 50) {
          toastr['success']('Accuracy: '+data.accuracy, '✨✨✨', {
            closeButton: true,
            tapToDismiss: false,
            rtl: isRtl
          });

          $('#your-predictions').append(`<div class="alert alert-warning" role="alert">
                                  <h4 class="alert-heading">Accuracy: ${data.accuracy}</h4>
                                <div class="alert-body">${data.prediction}</div>
                              </div>`).html();

        }else if(data.accuracy < 50) {
          toastr['success']('Accuracy: '+data.accuracy, '✨', {
            closeButton: true,
            tapToDismiss: false,
            rtl: isRtl
          });

          $('#your-predictions').append(`<div class="alert alert-primary" role="alert">
                                  <h4 class="alert-heading">Accuracy: ${data.accuracy}</h4>
                                <div class="alert-body">${data.prediction}</div>
                              </div>`).html();
        }   
      }else if(data.status == 'Fail') {
        toastr['warning']('⚠️ '+ data.message, 'Warning!', {
          closeButton: true,
          tapToDismiss: false,
          rtl: isRtl
        });
      }
    })
    .catch((error) => {
      toastr['error']('❌ '+ error, 'Error!', {
        closeButton: true,
        tapToDismiss: false,
        rtl: isRtl
      });
    }
    );
  };

  let form = document.querySelector('form');
  let button = document.querySelector('button[type="submit"]');
  let input_text = document.querySelector('#textpayload');
  let input_file = document.querySelector('#formFile');

  button.addEventListener('click', function (event) {
    event.preventDefault();
    let text_value = input_text.value;
    let files = input_file.files;
    // Your code to submit the form goes here
    if(document.getElementById('textRadio').checked) {
      if(!text_value) {
        toastr['warning']('⚠️ Please input your payload.', 'Warning!', {
          closeButton: true,
          tapToDismiss: false,
          rtl: isRtl
        });
      } else {
        predict(text_value, 'text');
      }
    }else if(document.getElementById('fileRadio').checked) {
      if(!files[0]) {
        toastr['warning']('⚠️ Please select your file.', 'Warning!', {
          closeButton: true,
          tapToDismiss: false,
          rtl: isRtl
        });
      } else {
        predict(files[0]);
      }
    }
  });
})(window);
