const openButton = document.getElementById("openButton");
const closeButton = document.getElementById("closeButton");

const leftDoor = document.getElementById("leftDoor");
const rightDoor = document.getElementById("rightDoor");

const camera = document.getElementById("camera");

openButton.addEventListener("click", function() {

    leftDoor.classList.add("open");
    rightDoor.classList.add("open");

});

closeButton.addEventListener("click", function() {

    leftDoor.classList.remove("open");
    rightDoor.classList.remove("open");

});

// for th camera
navigator.mediaDevices.getUserMedia({
    video: true
})
.then(function(stream) {
    camera.srcObject = stream;
})
.catch(function(error) {
    console.log("turn your cam cam on!");
});