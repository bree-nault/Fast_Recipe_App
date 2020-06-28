// Global Variable for user Input
var foodType = {};


function getPlaces(responseJson) {

  let lat = responseJson.results[0].geometry.location.lat;
  let lng = responseJson.results[0].geometry.location.lng;

var myHeaders = new Headers();
myHeaders.append("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
myHeaders.append("key", "AIzaSyCGnZ67EDIku1msVd4nZwRzzB-rDPnGAZc");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&types=food&keyword=soup&key=AIzaSyCGnZ67EDIku1msVd4nZwRzzB-rDPnGAZc", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

  console.log(responseJson)

  console.log(responseJson.results[0].geometry.location.lat);
  console.log(responseJson.results[0].geometry.location.lng);
};

// get longitude and latitude
function getCoordinates(addressEntered) {

  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + addressEntered + "&key=AIzaSyCGnZ67EDIku1msVd4nZwRzzB-rDPnGAZc", requestOptions)
    .then(response => response.json())
    .then(responseJson => getPlaces(responseJson))
    .catch(error => alert('Something went wrong. Try again later.'));

};

// Grab address from user 
function getAddress() {
  event.preventDefault();
  let addressEntered = $('input[name="locationBox"]').val();
  console.log('Your address is ' + addressEntered + '.');
  getCoordinates(addressEntered);
};

// Displays section for food places
function placeForm() {

  console.log('Place Section Displayed!');
  $('.homePage').hide();
  $('.recipePage').hide();
  $('.recipeDetails').hide();
  $('.moodPage').hide();
  $('.placeList').show();

};

// Displays sections to change user input
function moodForm() {

  console.log('Mood Section Displayed!');
  $('.homePage').hide();
  $('.recipePage').hide();
  $('.recipeDetails').hide();
  $('.moodPage').show();
  $('.placeList').hide();
};


// Displays Results for Recipe
function displayResults(responseJson) {

  console.log(responseJson)

  //Finds and displays username
  let recipeinfo = `
        <h2><span> Recipe: ${responseJson.recipes[0].title}</span></h2>
        <p><span> Summary: ${responseJson.recipes[0].summary}</span></p>
    `

  $('.recipeScreen').html(recipeinfo)

  //display the results section

  $('.homePage').hide();
  $('.recipePage').show();
  $('.recipeDetails').hide();
  $('.moodPage').hide();
  $('.placeList').hide();
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
// Can these two functions be consolidated?
function getFoodType() {
  event.preventDefault();
  foodType.food = $('input[name="foodType"]').val();
  console.log('You searched for ' + foodType.food + '.');
  getRecipe();
};

function getNewFood() {
  event.preventDefault();
  foodType.food = $('input[name="newType"]').val();
  console.log('You searched for ' + foodType.food + '.');
  getRecipe();
};

// Sets up the Homepage
$(function () {

  console.log('App loaded! Waiting for submit!');
  $('.homePage').show();
  $('.recipePage').hide();
  $('.recipeDetails').hide();
  $('.moodPage').hide();
  $('.placeList').hide();

});

// Button Listeners
document.getElementById("foodType").addEventListener("click", getFoodType);
document.getElementById("recipeButton").addEventListener("click", getRecipe);
document.getElementById("moodButton").addEventListener("click", moodForm);
document.getElementById("placeButton").addEventListener("click", placeForm);
document.getElementById("newType").addEventListener("click", getNewFood);
document.getElementById("locationSubmit").addEventListener("click", getAddress); 