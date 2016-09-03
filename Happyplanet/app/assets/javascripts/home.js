
$(document).ready(function () {




// refer to https://developer.mozilla.org/en/docs/Web/API/Window/sessionStorage


      // Get saved data from sessionStorage
      var data = sessionStorage.getItem('displayed');
      //if data does not exit, meaning not in session storage,
      if(!data){
        $("#entersite").css("display","block")
      }



      $( "#entersite" ).on('click', function() {
         $('#entersite').fadeOut(2000);

         // Save data to sessionStorage, set it to false as a flag - we have shown entersite box before
         sessionStorage.setItem('displayed', 'true');
      });


      $('#pulse-button').on('click', function() {

        $('.box').slideDown(800);
      });








});
