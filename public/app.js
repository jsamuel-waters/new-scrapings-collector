// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    var articleTitle = data[i].title;
    var articleID = data[i]._id;

    // Display the apropos information on the page
    $("#articles").append(
      "<p data-id='" + articleID + "'>" +
      articleTitle + 
      "</p>" +
      "<button class='link btn-primary' data-href='https://linuxjournal.com" + data[i].link + "'>" +
      "Go to Story" +
      "</button>" + 
      "<button class='save btn-warning' data-id='" + articleID + "'>"+
      "Save Article" +
      "</button><br /><hr />"
    );
  }
});

$(document).on("click", ".scrape-link", function(event) {
  var linkTarget = "http://localhost:3000/scrape";
  window.open(linkTarget);
});

$(document).on("click", ".saved-link", function(event) {
  var linkTarget = "http://localhost:3000/saved";
  window.open(linkTarget, '_self');
});

$(document).on("click", ".link", function(event) {
  event.preventDefault();
  var linkTarget = $(this).attr("data-href");
  window.open(linkTarget, "_blank");
});

$(document).on("click", ".save", function() {
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/save/" + thisId
  }).then(function(data){
    console.log(data);
    
  })
});
  
// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

