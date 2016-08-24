
$(document).ready(function () {


        $('#enterbutton').click(function() {


        $.ajax({
            type: "POST",
            url: '/posts/new',
            data: $("#enterpost").val(),
            success: success
          }.done{



          }

        })
    });


  });
