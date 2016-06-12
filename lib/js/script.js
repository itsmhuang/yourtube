//Start jQuery
var points = [];
var ourLat;
var ourLong;
var ourLocation;
var map;
$(document).ready(function() {
  //Array to store lat and long
  //var points= [];
  //On search button click run function
  $("#search").click(function() {
    //Get JSON for our geo-location
    /*  $.getJSON("http://ip-api.com/json", function(data0){
        //Resets output div so only 1 ssearch will display at a time
        
        //API KEY
         });
         
         */
    $.ajax({
      async: false,
      url: "http://ip-api.com/json",
      success: function(data0) {
        ourLocation = data0.lat + "%2C" + data0.lon;
        ourLat = data0.lat;
        ourLong = data0.lon;
      }
    });
    $("#output").html("");
    var googleKey = "AIzaSyAoLEQd78ITS4e5S1QboQxeLhvC8JQljdg";
    //Distance for JSON request
    var locationRadius = $("#distance").val() + "mi";
    //Sets default distance if no distance is given
    if (locationRadius === "mi") {
      locationRadius = "25mi";
      $("#distance").val("25");
    }
    //Set geo location for url

    //  ourLat= data0.lat;
    //ourLong=data0.lon;
    //Store inputted search term
    var searchTerm = $("#searchTerm").val();
    //URL for 2nd json call
    var searchURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&location=" + ourLocation + "&locationRadius=" + locationRadius + "&maxResults=10&q=" + searchTerm + "&type=video&key=" + googleKey;
    console.log(searchURL);
    //2nd call to get videos by geo location
    $.getJSON(searchURL, function(data1) {
      //For loop that runs for as long as MaxResults param
      for (var i = 0; i < data1.items.length; i++) {
        //Variables from JSON youtube videos
        var thumbnail = data1.items[i].snippet.thumbnails.medium.url;
        var channelName = data1.items[i].snippet.channelTitle;
        var description = data1.items[i].snippet.description;
        var title = data1.items[i].snippet.title;
        var url = "http://youtu.be/" + data1.items[i].id.videoId;
        var uploadDate = data1.items[i].snippet.publishedAt;
        var videoID = data1.items[i].id.videoId;
        //3rd URL for next JSON call
        var geoURL = "https://www.googleapis.com/youtube/v3/videos?part=recordingDetails&id=" + videoID + "&key=AIzaSyAoLEQd78ITS4e5S1QboQxeLhvC8JQljdg";
        //Call to get lat and long upload location from videos
        /* $.getJSON(geoURL, function(data2){
              var lat = data2.items[0].recordingDetails.location.latitude;
             var long = data2.items[0].recordingDetails.location.longitude;
    points.push([lat,long]);
     // console.log( i + "                   "+ points);
          
   }); */
        $.ajax({
          async: false,
          url: geoURL,
          success: function(data2) {
            var lat = data2.items[0].recordingDetails.location.latitude;
            var long = data2.items[0].recordingDetails.location.longitude;
            points.push([long, lat]);
          },
          complete: function() {
            require([
              "esri/map", "esri/geometry/Point",
              "esri/symbols/SimpleMarkerSymbol", "esri/graphic",
              "dojo/_base/array", "dojo/dom-style",
              "dojo/domReady!"
            ], function(
              Map, Point,
              SimpleMarkerSymbol, Graphic,
              arrayUtils, domStyle, ColorPicker
            ) {

              map = new Map("map", {
                basemap: "streets",
                center: [ourLong, ourLat],
                zoom: 6,
                minZoom: 2
              });
              maploaded();

              function mapLoaded() {

                /* var points = [[19.82,41.33],[16.37,48.21],[18.38,43.85],[23.32,42.7],[16,45.8],[19.08,47.5],[12.48,41.9],[21.17,42.67],[21.43,42],[19.26,42.44],[26.1,44.43],[12.45,43.93],[20.47,44.82],[17.12,48.15],[14.51,46.06],[12.45,41.9]];*/
                var iconPath = "M326.67,350.408c53.968-0.221,102.652,15.983,142.169,32.629c12.429,5.904,24.861,11.809,37.291,17.713c4.971-8.079,9.944-16.16,14.916-24.239c-8.109-26.465,19.007-48.966,41.485-32.629c25.521,18.549,7.066,46.042-20.043,49.41c-13.894,25.602-25.542,49.757-30.765,85.768c-2.339,16.133,3.183,36.403-13.518,38.223c-30.085,3.279-7.181-79.79-2.797-90.895c-14.138-6.681-28.28-13.363-42.417-20.043c-36.802-15.529-77.833-25.255-126.321-28.9c-0.155,28.742-0.311,57.492-0.466,86.234c-1.843,5.253-6.456,8.196-12.585,9.322c0,9.322,0,18.646,0,27.968c65.354-0.827,189.287,11.484,198.571,60.131c4.825,25.282-20.442,37.708-35.426,44.282c-43.261,18.981-100.52,26.413-162.679,26.103c0-9.322,0-18.646,0-27.968c48.578,1.321,98.705-4.695,136.576-17.713c11.073-3.806,31.854-8.288,34.027-20.51c-21.215-37.167-201.555-44.015-270.354-28.434c-18.408,4.168-71.591,13.84-73.182,30.298c17.172,29.115,120.427,36.454,170.137,36.358c0,9.322,0,18.646,0,27.968c-62.203,0.795-123.59-6.438-165.476-27.501c-13.195-6.636-35.374-18.098-32.629-39.621c6.701-52.551,131.886-63.724,198.105-63.394c-0.156-9.477-0.311-18.957-0.466-28.434c-18.312-2.205-11.961-72.436-11.653-95.557c-66.612-0.911-126.482,19.867-168.739,45.681c2.589,10.705,30.742,99.151-1.864,94.624c-16.629-2.309-11.078-22.284-13.518-38.688c-5.209-35.026-15.365-61.231-30.764-85.302c-7.357-1.007-14.464-0.572-20.044-4.195c-20.439-13.271-12.395-46.824,11.653-50.342c16.63-2.433,28.244,10.354,30.298,22.84c-0.466,4.505-0.932,9.012-1.398,13.518c4.816,7.302,9.634,14.606,14.45,21.908c52.305-21.694,104.156-46.978,179.926-47.079c0-21.129,0-42.264,0-63.394c-21.627-11.481-14.536-46.003,8.856-50.342c31.619-5.864,42.325,39.514,18.645,49.876C326.67,307.522,326.67,328.968,326.67,350.408z";
                var initColor = "red";
                arrayUtils.forEach(points, function(point) {
                  var graphic = new Graphic(new Point(point), createSymbol(iconPath, initColor));
                  map.graphics.add(graphic);
                });

              }

              function createSymbol(path, color) {
                var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
                markerSymbol.setPath(path);
                markerSymbol.setColor(new dojo.Color(color));
                markerSymbol.setOutline(null);
                return markerSymbol;
              }

            });
          }
        });

        $("#output").prepend("<div class= 'row vids'><div class='col-md-5'><a href = " + url + " target ='blank'>" + "<img src= " + thumbnail + "></div><div class='col-md-7'><div class='title'>" + title + "</div><br/> </a><div class='cName'>" + channelName + "</div><div class='desc'>" + description + "</div></div></div>");

      }
    });
  });

});

$("#distance").keypress(function(e) {
  if (e.which == 13) {
    $("#search").click();
  }
});