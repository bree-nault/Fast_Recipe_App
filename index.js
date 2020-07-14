// Global Variable for user Input
var foodType = {};

// Displays results of search
function results(contents) {
  $('.placeListUL').empty();

  $('.placeListUL').append(`<h2>Places serving ${foodType.food}:</h2>`);
  for (let i = 0; i < contents.results.length; i++) {
    $('.placeListUL').append(`<li>
      <h3>${contents.results[i].name}</h3>
      <p>${contents.results[i].vicinity}</p>
          </li>`);

  }
  $('.placeList').show();
  $('.addressInputBox').hide();
};

// Determines if there are items in the array
function determineArray2(contents) {
  if (!contents.results.length) {
    console.log('error')
    alert('Places serving ' + foodtype.food + ' were not found.')
  } else {
    results(contents)
  }
};

// finds places near users address
function getPlaces(responseJson) {

  var lat = responseJson.results[0].geometry.location.lat;
  var lng = responseJson.results[0].geometry.location.lng;

  var myHeaders = new Headers();
  myHeaders.append("Access-Control-Allow-Origin", "*");
  myHeaders.append("key", "AIzaSyCGnZ67EDIku1msVd4nZwRzzB-rDPnGAZc");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + lng + "&radius=500&types=food&keyword=" + foodType.food + "&key=AIzaSyCGnZ67EDIku1msVd4nZwRzzB-rDPnGAZc"; // site that doesn’t send Access-Control-*
  fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
    .then(response => response.json())
    .then(contents => determineArray2(contents))
    .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))

};


// get longitude and latitude
function getCoordinates(addressEntered) {

  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${addressEntered}&key=AIzaSyCGnZ67EDIku1msVd4nZwRzzB-rDPnGAZc`, requestOptions)
    .then(response => response.json())
    .then(responseJson => getPlaces(responseJson))
    .catch(error => alert('Please enter your city and state.'));

};

// Grab address from user 
function getAddress() {
  event.preventDefault();
  let addressEntered = $('input[name="locationBox"]').val().toLowerCase();

  getCoordinates(addressEntered);
};

// Displays section for food places
function placeForm() {

  $('.placeListUL').empty();
  $('.contentBox').hide();
  $('.addressInputBox').show();
  $('.placeList').show();
};

// Displays Results for Recipe
function displayResults(responseJson) {

  let recipeinfo = `
  <img src= ${responseJson.recipes[0].image} class="imgStyle" alt="Recipe Photo">
        <h2><span> ${responseJson.recipes[0].title}</span></h2>
        <p><span> Make Time: ${responseJson.recipes[0].readyInMinutes}</span></p>
  
    `
  $('.recipeScreen').html(recipeinfo)

  // Ingredient List
  $('.resultsList').empty();
  $('.resultsList').append(`<h3>Ingredient List:</h3>`);
  for (let i = 0; i < responseJson.recipes[0].extendedIngredients.length; i++) {
    $('.resultsList').append(`<li><p>${responseJson.recipes[0].extendedIngredients[i].name}</p>
        </li>`);
  }
  $('.resultsList').append(`
  <h3> Instructions: </h3>
  <p class="instructionBox">${responseJson.recipes[0].instructions}</p>`);

  //display the results section
  $('.contentBox').hide();
  $('.recipePage').show();
  $('html,body').scrollTop(0);
};

// Determines if there are items in the array
function determineArray(responseJson) {
  if (!responseJson.recipes.length) {
    console.log('error')
    alert('No recipe with that word. Try again!')
  } else {
    displayResults(responseJson)
  }
};

// gets Recipe
function getRecipe() {

  var myHeaders = new Headers();
  myHeaders.append("Cookie", "__cfduid=ddd682a376a74e135db9ba9aea36449381592783324");


  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(`https://api.spoonacular.com/recipes/random?number=1&tags=${foodType.food}&apiKey=b74ed27d7c9b401381916b81a36ee0ab`, requestOptions)
    .then(response => response.json())
    .then(responseJson => determineArray(responseJson))
    .catch(error => alert('Something went wrong. Try again later.'));
};

// Get the users input
function getFoodType() {
  event.preventDefault();
  foodType.food = $('input[name="foodType"]').val().toLowerCase();

  if (foodType.food.length == 0) {
    alert(`Please enter what you're hungry for!`)
  } else {

    getRecipe();
  };
};

// Displays sections to change user input
function moodForm() {
  $('.moodText').empty()

  $('.moodText').append(`
  <h2>My Mood Changed!</h2>

  <p>Not feeling ${foodType.food} anymore?</p>
  <p> Well, what are you in the mood for? Pizza? Tacos? Soup?!</p>`);

  $('.contentBox').hide();
  $('.homePage').show();
  $('.introText').hide();
  $(`.moodText`).show();

};

function watchForm() {
  $('.contentBox').hide();
  $('.homePage').show();
  $(`.introText`).show();
  $(`.moodText`).hide();

};
// Sets up the Homepage
$(function () {
  $(watchForm);
});

// Button Listeners
document.getElementById("foodType").addEventListener("click", getFoodType);
document.getElementById("recipeButton").addEventListener("click", getRecipe);
document.getElementById("moodButton").addEventListener("click", moodForm);
document.getElementById("placeButton").addEventListener("click", placeForm);
document.getElementById("locationSubmit").addEventListener("click", getAddress);
document.getElementById("backButton").addEventListener("click", getRecipe);
document.getElementById("mood2Button").addEventListener("click", moodForm);
document.getElementById("logoButton").addEventListener("click", watchForm);