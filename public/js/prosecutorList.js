// Handlebars

var prosecutorJsonTemplate = document.getElementById("prosecutorJsonTemplate").innerHTML;
var prosecutorMasterList = document.getElementById("prosecutorMasterList");
var url = "./data/prosecutors.json";

var allProsecutors = function (url, prosecutorJsonTemplate, prosecutorMasterList) {
  $.getJSON(url, function(data) {
    var template = $(prosecutorJsonTemplate).html();
    var stone = Handlebars.compile(template)(data);
    $(prosecutorMasterList).append(stone);
  });
};

allProsecutors('./data/prosecutors.json', '#prosecutorJsonTemplate', '#prosecutorMasterList');

// Active nav

$(".nav a").on("click", function(){
   $(".nav").find(".active").removeClass("active");
   $(this).parent().addClass("active");
});
