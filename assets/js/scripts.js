(function (window, undefined) {
  'use strict';

  /*
  NOTE:
  ------
  PLACE HERE YOUR OWN JAVASCRIPT CODE IF NEEDED
  WE WILL RELEASE FUTURE UPDATES SO IN ORDER TO NOT OVERWRITE YOUR JAVASCRIPT CODE PLEASE CONSIDER WRITING YOUR SCRIPT HERE.  */

  var isRtl = $('html').attr('data-textdirection') === 'rtl';
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
  //Socket.io
  var socket = io.connect('https://noobpk-solid-lamp-9q997w55xq537xjr-5000.preview.app.github.dev');
  // socket.emit('after connect', function(connectMsg) {
  //   $('#log').append('<br>' + $('<div/>').text('What is the intention of the code: ' + connectMsg.data).html());
  //   console.log(connectMsg.data)
  //   alert(connectMsg.data);
  // });
  // socket.emit('message', function(msg) {
  //   $('#log').append('<br>' + $('<div/>').text(msg.data).html());
  //   alert(msg);
  // })

  socket.on('connect', function() {
    console.log('Connected to the server');

    // Send a message to the server every 10 seconds
    setInterval(function() {
      socket.emit('requestData');
    }, 10000);
  });
  
  socket.on('message', function(data) {
    console.log(data); // Outputs "Hello from the server!"
  });

  socket.on('responseData', function(msg) {
    // Handle the data received from the server
    console.log(msg);
    $('#payload').prepend(`<div class="alert alert-primary" role="alert">
                                <h4 class="alert-heading">Accuracy: </h4>
                                <div class="alert-body">${msg.data}</div>
                            </div>
                        </div>
                    </div>`).html();
  });

  socket.on('notification', function(data) {
    // Display the notification to the user
    console.log(data);
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
  });

  const predict = (data) => {
    fetch('https://noobpk-solid-lamp-9q997w55xq537xjr-5000.preview.app.github.dev/predict', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({"data": data})
    }).then((res) => res.json())
    .then((data) => {
      if(data.status == 'Success') {
        if(data.accuracy >= 0.8) {
          toastr['success']('Accuracy: '+data.accuracy, '✨✨✨✨✨', {
            closeButton: true,
            tapToDismiss: false,
            rtl: isRtl
          });

          $('#payload').append(`<div class="alert alert-danger" role="alert">
                                  <h4 class="alert-heading">Accuracy: ${data.accuracy}</h4>
                                <div class="alert-body">${data.prediction}</div>
                            </div>
                        </div>
                    </div>`).html();
        }else if(data.accuracy >= 0.5) {
          toastr['success']('Accuracy: '+data.accuracy, '✨✨✨', {
            closeButton: true,
            tapToDismiss: false,
            rtl: isRtl
          });

          $('#payload').append(`<div class="alert alert-warning" role="alert">
                                  <h4 class="alert-heading">Accuracy: ${data.accuracy}</h4>
                                <div class="alert-body">${data.prediction}</div>
                            </div>
                        </div>
                    </div>`).html();

        }else if(data.accuracy < 0.5) {
          toastr['success']('Accuracy: '+data.accuracy, '✨', {
            closeButton: true,
            tapToDismiss: false,
            rtl: isRtl
          });

          $('#payload').append(`<div class="alert alert-primary" role="alert">
                                  <h4 class="alert-heading">Accuracy: ${data.accuracy}</h4>
                                <div class="alert-body">${data.prediction}</div>
                            </div>
                        </div>
                    </div>`).html();
        }   
      }else if(data.status == 'Fail') {
        toastr['info']('❌ Please input your payload.', 'Info!', {
          closeButton: true,
          tapToDismiss: false,
          rtl: isRtl
        });
      }
    })
    .catch(
      error => console.log(error)
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
        toastr['error']('❌ Please input your payload.', 'Error!', {
          closeButton: true,
          tapToDismiss: false,
          rtl: isRtl
        });
      }
      predict(text_value);
    }else if(document.getElementById('fileRadio').checked) {
      if(!files[0]) {
        toastr['error']('❌ Please select your file.', 'Error!', {
          closeButton: true,
          tapToDismiss: false,
          rtl: isRtl
        });
      }
      predict(files[0]);
    }
  });
})(window);
