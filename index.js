// Global Variable for user Input
var foodType = {};


function getRecipeDetails() {

  $('.contentBox').hide();
  $('.recipeDetails').show();

}

function results(contents) {
  
  console.log(contents);
  //Finds and displays username

    $('.placeList').empty();

    $('.placeList').append(`<h2>Go get some food:</h2>`);
    for (let i = 0; i < contents.results.length; i++) {
      $('.placeList').append(`<li>
      <h3>${contents.results[i].name}</h3>
      <p>${contents.results[i].vicinity}</p>
          </li>`);

}
  $('.placeList').show();

};
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
    .then(contents => results(contents))
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

  $('.contentBox').hide();
  $('.placeList').show();

};

// Displays Results for Recipe
function displayResults(responseJson) {

  console.log(responseJson)

  //Finds and displays username
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
  <p>${responseJson.recipes[0].instructions}</p>`);

  //display the results section
  $('.contentBox').hide();
  $('.recipePage').show();
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
  foodType.food = $('input[name="foodType"]').val();
  console.log('You searched for ' + foodType.food + '.');
  getRecipe();
};

// Displays sections to change user input
function moodForm() {

  $('.contentBox').hide();
  $('.homePage').show();
  $('.introText').hide();

};

// Sets up the Homepage
$(function () {

  console.log('App loaded! Waiting for submit!');

  $('.homePage').show();

});

// Button Listeners
document.getElementById("foodType").addEventListener("click", getFoodType);
document.getElementById("recipeButton").addEventListener("click", getRecipe);
document.getElementById("moodButton").addEventListener("click", moodForm);
document.getElementById("placeButton").addEventListener("click", placeForm);
document.getElementById("locationSubmit").addEventListener("click", getAddress); 
//document.getElementById("recipeInfoButton").addEventListener("click", getRecipeDetails); 
