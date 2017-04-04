var allIdeas = []

$('document').ready(refreshIdeaBoxes)

// Event Listeners
$('.title-input, .body-input').on('input', function() {
  var titleText = $('.title-input').val();
  var bodyText = $('.body-input').val();

  if (titleText != "" && bodyText != "") {
    $('.save-button').attr('disabled', false);
  }

  if (titleText == "" || bodyText == ""){
    $('.save-button').attr('disabled', true);
  }
});


$('.save-button').on('click', function() {
  console.log("it worked!")
  var titleInput = $('.title-input').val();
  var bodyInput = $('.body-input').val();
  var newIdea = new ConstructIdea(titleInput, bodyInput);

  addToStorage(newIdea);
  buildBox(newIdea);
})

// Delete Button
$('.main-container').on('click', '.delete', function() {
  var boxID = parseInt($(this).closest('.box').attr('id'));
  allIdeas.forEach(

    function(idea, index){
    if (idea.id === boxID) {
      allIdeas.splice(index, 1);
    }
    localStorage.setItem('allIdeas', JSON.stringify(allIdeas));
  });

  refreshIdeaBoxes();
})


// Load page, check local storage

// Checks if allIdeas array exists in localStorage, if not set to empty array, otherwise assign to allIdeas array var
function checkStorage () {
  var stringifiedArr = localStorage.getItem('allIdeas');
  allIdeas = JSON.parse(stringifiedArr) || [];
}

// Checks current storage then adds new idea to any existing ideas then sends to local storage
function addToStorage (idea) {
  checkStorage();
  allIdeas.push(idea);
  localStorage.setItem('allIdeas', JSON.stringify(allIdeas));
  checkStorage();
}

function refreshIdeaBoxes() {
  clearBoxContainer();
  checkStorage();
  allIdeas.forEach(function(idea){
    buildBox(idea);
  })
}

function clearBoxContainer() {
  $('.box-container').children().remove();
}

function ConstructIdea (title, body) {
  this.id = parseInt(Math.random() * 100000);
  this.title = title;
  this.body = body;
  this.quality = 'swill';
};

function buildBox (idea) {
  $('.box-container').prepend(
    '<article class="box" id=' + idea.id + '>'+
    '<div class="idea-header">' +
    '<h3>' + idea.title +'</h3>' +
    '<img src="assets/delete.svg" alt="exit button" class="delete icon">' +
    '</div>' +
    '<p class="idea-body">' +
      idea.body +
    '</p>' +
    '<div class="idea-footer">' +
    '<div class="quality-icons">' +
      '<img src="assets/upvote.svg" alt="upvote" class="upvote icon">' +
      '<img src="assets/downvote.svg" alt="downvote" class="upvote icon">' +
    '</div>' +
    '<p class="idea-quality">Quality: <span class="quality-value">swill</span></p>' +
    '</div>' +
    '</article>'

  )


}
