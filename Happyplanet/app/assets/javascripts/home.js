
$(document).ready(function () {



      $( "#pressme" ).on('click', function() {
      setTimeout(function() {
         $('#entersite').fadeOut();
       }, 1500)

      });


$('#pulse-button').on('click', function() {

    $('.box').slideDown(800);

  });

});
