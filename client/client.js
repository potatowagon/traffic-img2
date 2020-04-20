// initialize WebSocket
var socket = io();
// bind to socket events
socket.on('connect', function () {
  console.log("Connected");
});
socket.on('disconnect', function () {
  console.log("Disconnect");
});

var camData = [];
var map = null;
var flagMarkers = {};
var imgMarkers = {};

socket.on('cam-data', function (cams) {
  camData = cams;
  console.log(cams);
  if (Object.keys(flagMarkers).length === 0){
    initMarkerData(cams);
  }
  else {
    updateMarkerImg(cams);
  }
});

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: { lat: 1.35, lng: 103.8 }
  });
}

function initMarkerData(cams){
  var flag = {
    url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(20, 32),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(0, 32)
  };

  // Shapes define the clickable region of the icon. The type defines an HTML
  // <area> element 'poly' which traces out a polygon as a series of X,Y points.
  // The final coordinate closes the poly by connecting to the first coordinate.
  var shape = {
    coords: [1, 1, 1, 20, 18, 20, 18, 1],
    type: 'poly'
  };

  zCounter = 0
  cams.forEach(function(cam){
    flagMarkers[cam.CameraID] = new google.maps.Marker({
      position: { lat: cam.Latitude, lng: cam.Longitude },
      map: map,
      icon: flag,
      shape: shape,
      title: cam.CameraID,
      zIndex: zCounter ++
    });

    var image = {
      url: cam.ImageLink,
      // This marker is 20 pixels wide by 32 pixels high.
      size: new google.maps.Size(32, 24),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(0, 0)
    };

    imgMarkers[cam.CameraID] = new google.maps.Marker({
      position: { lat: cam.Latitude, lng: cam.Longitude },
      map: null,
      icon: image,
      title: cam.CameraID,
      zIndex: zCounter ++
    });
  });
}

function updateMarkerImg(cams){
  cams.forEach(function(cam){
    imgMarkers[cam.CameraID].setIcon(cam.ImageLink);
  });
}


function setMarkers(map) {
  // Adds markers to the map.

  // Marker sizes are expressed as a Size of X,Y where the origin of the image
  // (0,0) is located in the top left of the image.

  // Origins, anchor positions and coordinates of the marker increase in the X
  // direction to the right and in the Y direction down.

  for (var i = 0; i < camData.length; i++) {
    var cam = camData[i];
    var image = {
      url: cam.ImageLink,
      // This marker is 20 pixels wide by 32 pixels high.
      size: new google.maps.Size(32, 24),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(0, 0)
    };
    zCounter = 0
    var marker = new google.maps.Marker({
      position: { lat: cam.Latitude, lng: cam.Longitude },
      map: map,
      icon: image,
      shape: shape,
      title: cam.CameraID,
      zIndex: zCounter ++
    });

    var marker = new google.maps.Marker({
      position: { lat: cam.Latitude, lng: cam.Longitude },
      map: map,
      icon: flag,
      shape: shape,
      title: cam.CameraID,
      zIndex: zCounter ++
    });
  }
}
