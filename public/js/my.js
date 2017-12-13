document.addEventListener('DOMContentLoaded', function() {
  // firebase.auth().onAuthStateChanged(user => { });
  // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
  // firebase.messaging().requestPermission().then(() => { });
  // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });

  $(".echo").click(function (e) {
    $.ajax({
      url: "/echo",
      type: 'POST',
      data: $('#secretSantasForm').serialize(),
      success: function(data){
        $("#formRows").html(
          data.santas.map(function (santa, i) {
            return "" +
              "<div class='row' id='santas" + i + "'>" +
              "  <input type='hidden' value='" + santa.name + "' name='santas[" + i + "][name]'/>" +
              "  <input type='hidden' value='" + santa.email + "' name='santas[" + i + "][email]'/>" +
              "  <input type='hidden' value='" + santa.wishlist + "' name='santas[" + i + "][wishlist]'/>" +
              "  <div class='col-md-3'>" +
              santa.name +
              "  </div>" +
              "  <div class='col-md-6'>" +
              data.santas.filter(function (victim) {
                return victim.email != santa.email;
              }).map(function (victim, j) {
                return "" +
                  "    <div class='row' id='santas" + i + "victims" + j + "'>" +
                  "      <input type='hidden' value='" + victim.name + "' name='santas[" + i + "][victims][" + j + "][name]'/>" +
                  "      <input type='hidden' value='" + victim.email + "' name='santas[" + i + "][victims][" + j + "][email]'/>" +
                  "      <input type='hidden' value='" + victim.wishlist + "' name='santas[" + i + "][victims][" + j + "][wishlist]'/>" +
                  "      <div class='col-md-9'>" +
                  victim.name +
                  "      </div>" +
                  "      <div class='col-md-3'>" +
                  "        <a class='btn btn-default deletevictimrow' data-santa='" + i + "' data-id='" + j + "' role='button' href='#'><b>-</b></a>" +
                  "      </div>" +
                  "    </div>" +
                  "";
              }).join("\n") +
              "  </div>" +
              "</div>" +
							"<hr/>" +
              "";
          }).join("\n")
        );
        $(".deletevictimrow").click(function(e) {
          var santa = $(this).data("santa");
          var i = $(this).data("id");
          var node = $("#santas" + santa + "victims" + i);
          node.remove();
        });
        $(".echo").hide();
        $(".submit").show();
      }
    });
    return false;
  });

  $(".submit").click(function (e) {
    $.ajax({
      url: "/secret-santa",
      type: 'POST',
      data: $('#secretSantasForm').serialize(),
      success: function(santa){
        $("#formRows").html(
					"<div class='row' id='secretSantaResult' style='display: none;'>" +
					"  <div class='col-md-12'>" +
					((f, s) => f(f, s))((f, s) => s.name + (s.victim ? " => " + f(f, s.victim) : ""), santa) +
					"  </div>" +
					"</div>" +
					"<div class='row'>" +
					"  <div class='col-md-12'>" +
					"    <p>All mails have been sent!</p>" +
					"    <p>If you want to know who got who: <a class='btn btn-default showResults' role='button' href='#'><b>Show results</b></a></p>" +
					"  </div>" +
					"</div>"
				);
				$(".showResults").click(() => $("#secretSantaResult").show());
        $(".submit").hide();
      }
    });
    return false;
  });

  $(".mail").click(function (e) {
    console.log($('#mailForm').val());
    $.ajax({
      url: "/mail",
      type: 'POST',
      data: {
        email: $('#mailForm').val()
      },
      success: function(data){
        console.log("Done!");
      }
    });
  });

  var santasIndex = 2;

  $(".addrow").click(function(e) {
    var i = santasIndex++;
    $("#formRows").append("" +
      "<div class='row' id='santas" + i + "'>" +
      " <div class='col-md-3'>" +
      "   <input type='text' class='form-control' placeholder='Name' name='santas[" + i + "][name]'/>" +
      " </div>" +
      " <div class='col-md-3'>" +
      "   <input type='text' class='form-control' placeholder='E-mail' name='santas[" + i + "][email]'/>" +
      " </div>" +
      " <div class='col-md-3'>" +
      "   <input type='text' class='form-control' placeholder='Wishlist url' name='santas[" + i + "][wishlist]'/>" +
      " </div>" +
      " <div class='col-md-3'>" +
      "   <a class='btn btn-default deletesantarow' data-id='" + i + "' role='button' href='#'><b>-</b></a>" +
      " </div>" +
      "</div>" +
      "");
  });

  $(".deletesantarow").click(function(e) {
    var i = $(this).data("id");
    var node = $("#santas" + i);
    node.remove();
  });
});
