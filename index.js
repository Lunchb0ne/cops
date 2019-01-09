// let firebase = require("firebase");
// Set the configuration for your app
// TODO: Replace with your project's config object
let config = {
    apiKey: "AIzaSyCgF3hZPWqNTuKicY3pSSXv08Y5m_mDxaY",
    authDomain: "cops-e4ffe.firebaseapp.com",
    databaseURL: "https://cops-e4ffe.firebaseio.com",
    storageBucket: "cops-e4ffe.appspot.com" //DL4CAF4943
};
firebase.initializeApp(config);
getLocation();

let car_1 = "DL4CAF4943";
let car_2 = "HR26DK8337";
let car_3 = "MH12DE1122";
let numPlate = car_1;
var lat;
var long;
var acc;
let database = firebase.database();
$("#car-1").click(function (e) {
    e.preventDefault();
    numPlate = car_1;
    disableall();
    $(this).attr("class", "text-indigo-lighter lg:text-indigo-darker font-medium flex justify-between items-center hover:cursor-pointer transition-normal ml-1 border-l border-grey-dark pl-4 mobile-home-trigger");
    loader();
});
$("#car-2").click(function (e) {
    e.preventDefault();
    numPlate = car_2;
    disableall();
    $(this).attr("class", "text-indigo-lighter lg:text-indigo-darker font-medium flex justify-between items-center hover:cursor-pointer transition-normal ml-1 border-l border-grey-dark pl-4 mobile-home-trigger");
    loader();
});
$("#car-3").click(function (e) {
    e.preventDefault();
    numPlate = car_3;
    disableall();
    $(this).attr("class", "text-indigo-lighter lg:text-indigo-darker font-medium flex justify-between items-center hover:cursor-pointer transition-normal ml-1 border-l border-grey-dark pl-4 mobile-home-trigger");
    loader();
});

function disableall() {
    $("#car-1").attr("class", "hover:text-indigo-dark hover:cursor-pointer transition-normal ml-1 border-l border-grey-dark pl-4");
    $("#car-2").attr("class", "hover:text-indigo-dark hover:cursor-pointer transition-normal ml-1 border-l border-grey-dark pl-4");
    $("#car-3").attr("class", "hover:text-indigo-dark hover:cursor-pointer transition-normal ml-1 border-l border-grey-dark pl-4");
}
class User {
    constructor(User) {
        this.item1 = User.DateTime;
        this.item2 = User.Location;
    }
    sayit() {
        console.log(this.item1, this.item2);
        $("#platNfo").html(numPlate);
        $('#dateTime').html(this.item1);
        $('#lati').html(this.item2[0]);
        $('#longi').html(this.item2[1]);
        if (Math.abs(lat - this.item2[0]) > (0.3) || Math.abs(long - this.item2[1]) > (0.3)) {
            // $('#YOU').html("ERROR WRONG LOCATION");
            alert("LOCATION MISMATCH ERROR");
        }
    }
}
console.log(numPlate);
var stuff;

function loader() {
    firebase.database().ref('/CarsLog/\"' + numPlate + '\"').on('value', function (snap) {
        let object = snap.val();
        console.log(object);
        console.log();
        stuff = new User(object[Object.entries(object)[(Object.entries(object).length - 1)][0]]);
        getLocation();
        stuff.sayit();
    });
}
loader();


//var x = document.getElementById("lati");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
    //     x.innerHTML = "Latitude: " + position.coords.latitude +
    //         "<br>Longitude: " + position.coords.longitude;
}