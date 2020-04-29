// initialize WebSocket
var socket = io();
// bind to socket events
socket.on('connect', function () {
  console.log("Connected");
});
socket.on('disconnect', function () {
  console.log("Disconnect");
});

const imgDisplay = {
  HIDE: 0,
  SHOW: 1,
  ZOOM: 2,
  SUPERZOOM: 3
}

var camData = [];
var map = null;
var flagMarkers = {};
var imgMarkers = {};

socket.on('cam-data', function (cams) {
  camData = cams;
  console.log(cams);
  if (Object.keys(flagMarkers).length === 0) {
    initMarkerData(cams, map);
  }
  updateMarkerImg();
});

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: { lat: 1.35, lng: 103.8 }
  });

  var trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(map);

  map.addListener('center_changed', updateMarkerImg);

  map.addListener('zoom_changed', updateMarkerImg);
}

function initMarkerData(cams, map) {
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

  var zCounter = 0
  cams.forEach(function (cam) {
    flagMarkers[cam.CameraID] = new google.maps.Marker({
      position: { lat: cam.Latitude, lng: cam.Longitude },
      map: map,
      icon: flag,
      shape: shape,
      title: cam.CameraID,
      zIndex: zCounter++
    });

    flagMarkers[cam.CameraID].CameraID = cam.CameraID;

    google.maps.event.addListener(flagMarkers[cam.CameraID], 'click', toggleImgDisplay);

    imgMarkers[cam.CameraID] = new google.maps.Marker({
      position: { lat: cam.Latitude, lng: cam.Longitude },
      map: null,
      icon: null,
      title: cam.CameraID,
      zIndex: 99
    });
    imgMarkers[cam.CameraID].status = imgDisplay.HIDE;
  });
}

function toggleImgDisplay(marker, event) {
  console.log(marker);
  console.log(marker.rb.srcElement.title);
  var img = imgMarkers[marker.rb.srcElement.title];
  if (typeof img === 'undefined') {
    img = imgMarkers[marker.rb.srcElement.parentElement.title];
  }
  img.status = (img.status + 1) % Object.keys(imgDisplay).length;
  updateMarkerImg();
}

function showZoomedOutView() {
  var prominentCams = {
    "north": 9703,
    "south": 4799,
    "east": 7791,
    "west": 4716,
    "central": 6705
  }

  Object.values(imgMarkers).forEach(function (img) {
    if (img.status === imgDisplay.SHOW) {
      img.map = null;
    }
  });

  Object.values(prominentCams).forEach(function (camId) {
    imgMarkers[camId].setMap(map);
  });
}

function updateMarkerImg() {
  camData.forEach(function (cam) {
    var image = {
      url: cam.ImageLink,
      // This marker is 20 pixels wide by 32 pixels high.
      scaledSize: new google.maps.Size(160, 120),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(160, 120)
    };

    imgM = imgMarkers[cam.CameraID]

    if (typeof imgM === 'undefined') { console.log(cam.CameraID) }

    if (imgM.status === imgDisplay.HIDE) {
      imgM.setMap(null);
    }

    if (imgM.status === imgDisplay.SHOW) {
      imgM.setMap(map);
      imgM.setZIndex(100);
    }

    if (imgM.status === imgDisplay.ZOOM) {
      image.scaledSize = new google.maps.Size(320, 240);
      image.anchor = new google.maps.Point(320, 240);
      imgM.setMap(map);
      imgM.setZIndex(200);
    }

    if (imgM.status === imgDisplay.SUPERZOOM) {
      image.scaledSize = new google.maps.Size(640, 480);
      image.anchor = new google.maps.Point(640, 480);
      imgM.setMap(map);
      imgM.setZIndex(300);
    }

    imgM.setIcon(image);
  });
  console.log(map.zoom);
  console.log(event)

  if (map.zoom <= 12) {
    showZoomedOutView()
  }
}