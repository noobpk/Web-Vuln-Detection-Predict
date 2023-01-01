(function (window, undefined) {
  'use strict';

  /*
  NOTE:
  ------
  PLACE HERE YOUR OWN JAVASCRIPT CODE IF NEEDED
  WE WILL RELEASE FUTURE UPDATES SO IN ORDER TO NOT OVERWRITE YOUR JAVASCRIPT CODE PLEASE CONSIDER WRITING YOUR SCRIPT HERE.  */
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

  // $('.predict-submit').on('click', function () {
  //   console.log("123");
  // });
  let form = document.querySelector('form');
  let button = document.querySelector('button[type="submit"]');
  let input_text = document.querySelector('#textpayload');
  let input_file = document.querySelector('#formFile');

  button.addEventListener('click', function (event) {
    event.preventDefault();
    // Your code to submit the form goes here
    let text_value = input_text.value;
    console.log(text_value);
    let files = input_file.files;
    console.log(files);
  });
})(window);
