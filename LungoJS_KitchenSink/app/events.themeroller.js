$$("#themeroller li").tap(function() {
    var link = $$("#theme-stylesheet");
    var url = link.attr("href");
    var new_url = url.split("http://lungo.tapquo.com/").slice(0, -1);
    new_url.push($$(this).attr("data-theme"));
    link.attr('href', new_url.join("http://lungo.tapquo.com/"));
});