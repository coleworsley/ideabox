// =====================================
// GLOBAL VARIABLES  ===================
// =====================================

var allIdeas = [];
var allIdeasSorted = [];

// =====================================
// EVENT LISTENERS  ====================
// =====================================

$('document').ready(refreshIdeaBoxes);

// Enable/Disable Save Button Event
$('.title-input, .body-input').on('input', enableSaveButton);

// Save Button Event
$('.save-button').on('click', function() {
  var titleInput = $('.title-input').val();
  var bodyInput = $('.body-input').val();
  var newIdea = new ConstructIdea(titleInput, bodyInput);
  $('.sort-btn').children('span').text('');
  clearInputs();
  addToStorage(newIdea);
  buildBox(newIdea);
  $(this).attr('disabled', 'true');
})

// Search Box Event
$('.search-box').on('input', search);

// Delete Button Event
$('.main-container').on('click', '.delete', function() {
  var boxID = parseInt($(this).closest('.box').attr('id'));
  allIdeas.forEach(function(idea, index){
    if (idea.id === boxID) {
      allIdeas.splice(index, 1);
    }
    localStorage.setItem('allIdeas', JSON.stringify(allIdeas));
  });
  refreshIdeaBoxes();
})

// Upvote Event
$('.box-container').on('click', '.upvote', function() {
  var boxID = parseInt($(this).closest('.box').attr('id'));
  allIdeas.forEach(function(idea, index) {
      if (idea.id === boxID) {
        idea.quality = changeQuality(idea, 'upvote');
      }
      localStorage.setItem('allIdeas', JSON.stringify(allIdeas));
    });

    refreshIdeaBoxes();
});

// Downvote Event
$('.box-container').on('click', '.downvote', function() {
  var boxID = parseInt($(this).closest('.box').attr('id'));
  allIdeas.forEach(function(idea, index) {
      if (idea.id === boxID) {
        idea.quality = changeQuality(idea, 'downvote');
      }
      localStorage.setItem('allIdeas', JSON.stringify(allIdeas));
    });
    refreshIdeaBoxes();
});

// Idea Title Edit
$('.box-container').on('keydown', '.idea-title', function(e) {
  e.which != 13 ? null : editIdea(this, 'title');
});

$('.box-container').on('blur', '.idea-title', function() {
  editIdea(this, 'title');
});

// Idea Body Edit
$('.box-container').on('keydown', '.idea-body', function(e) {
  e.which != 13 ? null : editIdea(this, 'body');
});

$('.box-container').on('blur', '.idea-body', function() {
  editIdea(this, 'body');
});


// =====================================
// FUNCTIONS  ==========================
// =====================================

// Search Box
function search() {
  var inputText = $('.search-box').val().toUpperCase();
  var hideArray = allIdeas.filter(function(idea){
    if (idea.title.toUpperCase().indexOf(inputText) < 0 && idea.body.toUpperCase().indexOf(inputText) < 0) {
      return idea;
    } else {
      $('#' + idea.id).closest('.box').css('display', 'block');
    }
  });

  hideArray.forEach(function(idea) {
    $('#' + idea.id).closest('.box').css('display', 'none');
  });
}

// Update Text on edit
function editIdea(reference, property) {
  var newText = $(reference).text();
  var boxID = parseInt($(reference).closest('.box').attr('id'));

  updateIdeaArray(boxID, newText, property);
  refreshIdeaBoxes();
}

function updateIdeaArray(boxID, updatedText, property){
  allIdeas.forEach(function(idea, index) {
      if (idea.id === boxID) {
        idea[property] = updatedText;
      }
  });
  localStorage.setItem('allIdeas', JSON.stringify(allIdeas));
}

function checkStorage () {
  var stringifiedArr = localStorage.getItem('allIdeas');
  allIdeas = JSON.parse(stringifiedArr) || [];
}


$('.sort-btn').on('click', function() {
  var current = $(this).children('span').text();
  if (current == '') {
    $(this).children('span').text('↓');
    sortArray('↓')
  } else if (current == '↓'){
    $(this).children('span').text('↑');
    sortArray('↑')
  } else {
    $(this).children('span').text('');
    sortArray('')
  }

  clearBoxContainer();
  allIdeasSorted.forEach(function(idea){
    buildBox(idea);
  });
});



function sortArray (direction) {
  allIdeasSorted = allIdeas.slice();
  if (direction == '↑') {
    allIdeasSorted.sort(function(a, b){
      return parseQuality(b.quality) - parseQuality(a.quality)
    });
  } else if (direction == '↓') {
    allIdeasSorted.sort(function(a, b){
      return parseQuality(a.quality) - parseQuality(b.quality)
    });
  } else {
    allIdeasSorted = allIdeas.slice()
  }
}

function parseQuality(quality){
  if (quality === 'genius') {
    return 3;
  } else if (quality === 'plausible') {
    return 2;
  } else {
    return 1;
  }
}


function addToStorage (idea) {
  checkStorage();
  allIdeas.push(idea);
  localStorage.setItem('allIdeas', JSON.stringify(allIdeas));
  checkStorage();
}

function refreshIdeaBoxes() {
  $('.sort-btn').children('span').text('');
  clearBoxContainer();
  checkStorage();
  allIdeas.forEach(function(idea){
    buildBox(idea);
  });
}

function clearBoxContainer() {
  $('.box-container').html("");
}

// Constructor Function
function ConstructIdea (title, body) {
  this.id = parseInt(Math.random() * 100000);
  this.title = title;
  this.body = body;
  this.quality = 'swill';
}

function clearInputs() {
  $('.title-input, .body-input').val('');
}

function enableSaveButton() {
  var titleText = $('.title-input').val();
  var bodyText = $('.body-input').val();
  if (titleText != "" && bodyText != "") {
    $('.save-button').attr('disabled', false);
  }
  if (titleText == "" || bodyText == ""){
    $('.save-button').attr('disabled', true);
  }
}

function changeQuality(input, className) {
  if (className === 'upvote') {
    switch (input.quality) {
      case 'swill':
        input.quality = 'plausible'
        break;
      case 'plausible':
        input.quality = 'genius'
        break;
      default:
        input.quality = 'genius'
    }
    return input.quality;
  } else {
    switch (input.quality) {
      case 'genius':
        input.quality = 'plausible'
        break;
      case 'plausible':
        input.quality = 'swill'
        break;
      default:
        input.quality = 'swill'
    }
    return input.quality;
  }
}

function buildBox (idea) {
  $('.box-container').prepend(
    '<article class="box" id=' + idea.id + '>'+
    '<div class="idea-header">' +
    '<h3 class="idea-title" contenteditable="true">' + idea.title +'</h3>' +
    '<button class="delete icon"></button>' +
    '</div>' +
    '<p class="idea-body" contenteditable="true">' +
      idea.body +
    '</p>' +
    '<div class="idea-footer">' +
    '<div class="quality-icons">' +
      '<button class="upvote icon"></button>' +
      '<button class="downvote icon"></button>' +
    '</div>' +
    '<p class="idea-quality">Quality: <span class="quality-value">' + idea.quality +'</span></p>' +
    '</div>' +
    '</article>'
  );
}
