// Add view to views array
listingViews = { 'page_listing': 'views/page_listing.php' };
propertyView = { 'output_property': 'views/output_property.php' };

filesToVariablesArray.push(listingViews);
filesToVariablesArray.push(propertyView);

function listingFunction () {

	// Build the page
	$('section').html(php_page_listing)
	$('section').find('.page-title').text(pageID);

	// If we have data
	if(!_.isEmpty(json_properties_data)){
		
		// Loop through data
		_.each(json_properties_data, function(value, key) {
			returnObject = $(php_output_property);

			returnObject.prepend(value.type)
			returnObject.attr('id', value.post_id)
			returnObject.find('.property-title h3').append(value.the_title);
			returnObject.find('.dimenssions').append(value.sqfeet);
			returnObject.find('.details').attr('href', value.post_id);

			// Get attachments
			if ( value.attachments != null ) {
				_.each(value.attachments, function(val, k) {
					returnObject.find('.property-photo img').attr('src', val.thumb);
				});
			}

			$('.listing').append(returnObject);
		});

	}
}