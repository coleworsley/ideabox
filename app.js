// =====================================
// GLOBAL VARIABLE  ====================
// =====================================

var allIdeas = []

// =====================================
// EVENT LISTENERS  ====================
// =====================================

$('document').ready(refreshIdeaBoxes)

// Title & Body Input
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

// Save Button
$('.save-button').on('click', function() {
  var titleInput = $('.title-input').val();
  var bodyInput = $('.body-input').val();
  var newIdea = new ConstructIdea(titleInput, bodyInput);
  clearInputs();
  addToStorage(newIdea);
  buildBox(newIdea);
  $(this).attr('disabled', 'true');
})

// Search Box
$('.search-box').on('input', function() {
  var inputText = $(this).val();
  var hideArray = allIdeas.filter(function(idea){
    if (idea.title.search(inputText) < 0) {
      return idea
    } else {
      $('#' + idea.id).closest('.box').css('display', 'block')
    }
  });
  hideArray.forEach(function(idea) {
    $('#' + idea.id).closest('.box').css('display', 'none')
  });
});

// Delete Button
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

// Edit idea title
$('.box-container').on('blur', '.idea-title', function() {
  var newTitle = $(this).text();
  var boxID = parseInt($(this).closest('.box').attr('id'));
  allIdeas.forEach(function(idea, index) {
      if (idea.id === boxID) {
        idea.title = newTitle;
      }
      localStorage.setItem('allIdeas', JSON.stringify(allIdeas));
    });
    refreshIdeaBoxes();
})

// Edit idea body
$('.box-container').on('blur', '.idea-body', function() {
  var newBody = $(this).text();
  var boxID = parseInt($(this).closest('.box').attr('id'));
  allIdeas.forEach(function(idea, index) {
      if (idea.id === boxID) {
        idea.body = newBody;
      }
      localStorage.setItem('allIdeas', JSON.stringify(allIdeas));
    });
    refreshIdeaBoxes();
})

// =====================================
// FUNCTIONS  ==========================
// =====================================

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
  )
}

function clearInputs() {
  $('.title-input, .body-input').val('');
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
    return input.quality
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
    return input.quality
  }
}
