// creates prosecutor profile link
Handlebars.registerHelper('link', function(){
    return this.name.replace(/ +/g, '-').toLowerCase();
});

Handlebars.registerHelper('news', function(googleLink){
    var newsName = this.name.replace(/ +/g, '+').toLowerCase(),
        newsState = this.state.replace(/ +/g, '+').toLowerCase(),
        newsRole = this.role.replace(/ +/g, '+').toLowerCase();

    return "https://www.google.com/search?q=" + newsName + "+" + newsState +  "+" + newsRole + "&tbm=nws";
});
