$(document).ready(function() {

  /*
https://www.googleapis.com/youtube/v3/search?part=snippet&location=37.42307%2C-122.08427&locationRadius=5mi&maxResults=5&q=jquery&type=video&key={YOUR_API_KEY}

https://www.googleapis.com/youtube/v3/videos?part=recordingDetails&id={VIDEO_ID}&key={YOUR_API_KEY}

  */
  $("#search").click(function() {
    $.getJSON("http://ip-api.com/json", function(data0){
      $("#output").html("");
         var googleKey = "AIzaSyAoLEQd78ITS4e5S1QboQxeLhvC8JQljdg";
    var locationRadius=$("#distance").val() + "mi";
    var location= data0.lat + "%2C" + data0.lon;
    var searchTerm = $("#searchTerm").val();
    var searchURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&location=" + location + "&locationRadius=" + locationRadius + "&maxResults=5&q=" + searchTerm + "&type=video&key=" + googleKey;
      
    $.getJSON(searchURL, function(data1) {
      for(var i=0;i<data1.items.length;i++){
        var thumbnail= data1.items[i].snippet.thumbnails.medium.url;
        var channelName = data1.items[i].snippet.channelTitle;
        var description = data1.items[i].snippet.description;
        var title = data1.items[i].snippet.title;
        var url = "http://youtu.be/"+ data1.items[i].id.videoId;
        var uploadDate= data1.items[i].snippet.publishedAt;
  
        $("#output").prepend( "<div class= 'row vids'><div class='col-md-5'><a href = "+url+" target ='blank'>"+ "<img src= "+ thumbnail+ "></div><div class='col-md-7'><div class='title'>" + title + "</div><br/> </a><div class='cName'>"+ channelName +"</div><div class='desc'>"+ description+"</div></div></div>");

      }
   
    });
    });
 
  });

});