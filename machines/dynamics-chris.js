function newsFunction () {
	_.each(json_news_data, function(value){
		$('.mainContent').append(value.the_title)
		console.log(value.the_title) 
	});
}