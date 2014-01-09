var $ = jQuery;
//(function($) { 

// ADD OBJECT.KEYS SUPPORT TO IE8
    if (!Object.keys) {
        Object.keys = (function () {
            'use strict';
            var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
            dontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
            ],
            dontEnumsLength = dontEnums.length;
            return function (obj) {
                if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                    throw new TypeError('Object.keys called on non-object');
                }
                var result = [], prop, i;
                for (prop in obj) {
                    if (hasOwnProperty.call(obj, prop)) {
                        result.push(prop);
                    }
                }
                if (hasDontEnumBug) {
                    for (i = 0; i < dontEnumsLength; i++) {
                        if (hasOwnProperty.call(obj, dontEnums[i])) {
                            result.push(dontEnums[i]);
                        }
                    }
                }
                return result;
            };
        }());
    }

// ADD CONSOLE SUPPORT TO IE8
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});
    while (length--) {
        method = methods[length];
        if (!console[method]) {
            console[method] = noop;
        }
    }

// DEFINE STARTUP VARIABLES
	var imageIncrement = 50;
	var imageTracker;
	var previousPage;
	var prependUrl;
	var pageID;
	var postID;
	var startUpRan = false;
	var pageDir;
	var debug0;
	var defaultPage = "home";
	var defaultPageDir = "http://174.136.12.85/~evore/wp-content/themes/evo";
	var pathPrefix = "http://174.136.12.85/~evore/";
	var RewriteBase = "/~evore/"; // if url is http://171.321.43.24/~foobar/ then the value should equal /~foobar/
	var urlQueryString = "?" + Math.floor((Math.random()*10000)+1);
	var filesToVariablesArray = [
		{'page_inner': 'views/page_inner.php'},
		{ 'page_listing': 'views/page_listing.php' },
		{ 'page_listing_floors': 'views/page_listing_floors.php' },
		{ 'output_listing_search': 'views/output_listing_search.php' },
		{ 'output_property': 'views/output_property.php' },
		{ 'output_floor': 'views/output_floor.php' },
		{ 'page_news': 'views/page_news.php' },
		{ 'output_news_story': 'views/output_news_story.php' },
		{ 'page_services': 'views/page_services.php' },
		{ 'page_team': 'views/page_team.php' },
		{ 'output_team': 'views/output_team.php' },
		{ 'output_service_block': 'views/output_service_block.php' },
		{'text_input': 'views/input_text.php'}
	];

	if(typeof ajaxer === "undefined"){
		ajaxer = false;
	}



// LOAD VIEWS
	function loadView(pageID, postID){
		prependUrl = returnPrependUrl();
		switch(pageID){
			case defaultPage:
				returnPageData(pageID).done(function(data){
					// $('section').html(php_page_inner);
					// $('section').find('.mainContent').html( _.unescape(data) );
					// $('section').find('.mainContent').prepend("search results:<div class='searchExample' />")
					// // buildSideMenu($('section').find('.sideNav'));
					// appendPageTitle(pageID, $('section').find('.pageInfo'));

					// if(!_.isEmpty(json_people_data)){
					// 	$('section').find('.search').css('display', 'block');
					// 	returnSearchData(json_people_data, "<div class='viewParent' />", $('section').find('.searchExample'), pageID);
					// 	searchResults(json_people_data, "<div class='viewParent' />", $('section').find('.searchExample'), $('.search').find('input'), returnSearchData, pageID)
					// }

					changePage("in");
				});
			break;

			case "listing":
				if((postID == "") || (typeof postID === "undefined")){
					returnPageData(pageID).done(function(data){
						// Build the page
						$('section').html(php_page_listing);
						appendPageTitle(pageID, $('section').find('.pageInfo'));

						// Build Search
						if (!_.isEmpty(json_submarkets_data)) {
							returnSearchObject = $(php_output_listing_search);

							_.each(json_submarkets_data, function(value, key) {
								returnObjectOption = $('<option />');

								returnObjectOption.val(value.post_id);
								returnObjectOption.html(_.unescape(value.the_title));

								returnSearchObject.find('.submarket').append(returnObjectOption);
								
							});

							$('section').find('.content-entry').before(returnSearchObject);

						}

						// Build property types
						if (!_.isEmpty(json_properties_types_data)) {

							// sort property types
							json_properties_types_data = _.sortBy(json_properties_types_data, function(sjptd){ return Math.sin(sjptd.post_id); });

							// Loop property types
							searchProperties(json_properties_data)
						};

						$('.search-properties form').on('submit', function(e) {
							e. preventDefault();

							formData = $(this).serializeArray();
							_.each(formData, function(i, field) {
								submarketField = i.value; 
							});

							json_properties_search = _.filter(json_properties_data, function(results, second, third){
								return results.submarket == submarketField;
							});

							if (submarketField == "") {
								json_properties_search = json_properties_data;
							}

							searchProperties(json_properties_search)

							console.log($(this).serializeArray())
						});

						$('.inner-link').on('click', function(e){
							e.preventDefault();
							if(!$(this).parent().hasClass('hyperlink')){
								postIDrequest = $(this).data('postid');
								pushPageNav('listing', postIDrequest);
							} else {
								window.open($(this).attr('href'), '_blank');
							}
						});

						changePage("in");
					});
				} else {

					postIDFound = false;

					_.each(json_properties_data, function(value, index) {
						if (value.post_id == postID) {
							postIDFound = true;

							$('section').html(php_page_listing);
							$('section').find('.pageInfo').append('<h2>' + value.the_title + '</h2>');
							$('section').find('.content-entry').append(_.unescape(value.the_content));

							// Get Attachments
							if (value.attachments != null) {
								_.each(value.attachments, function(val, k) {
									$('section').find('.content-entry').append('<img src="'+ val.thumb +'" />');
								});
							}

							// Get website
							if (value.website != null) {
								$('section').find('.content-entry').append('<a href="'+value.website+'">View Website</a>');
							}

							// get floors list
							if ( !_.isEmpty(json_floors_data) ) {

								$('section').find('.content-entry').append(php_page_listing_floors);

								_.each(json_floors_data, function(v, i) {
									returnObject = $(php_output_floor);

									if ( value.post_id == v.address ) {
										returnObject.find('.floor').append(v.floor_proper);
										returnObject.find('.sq').append(v.sqfeet);
										returnObject.find('.rent').append(v.rent);
										returnObject.find('.comment').append(_.unescape(v.the_content));

										// get floor types
										_.each(v.floor_type, function(j, k) {
											_.each(json_floor_types_data, function(l, m) {
												if (j == l.post_id) {
													returnObject.find('.type').append(l.the_title);
												}
											});
										});

										// get attachments
										if (v.attachments != null) {
											_.each(v.attachments, function(n, o) {
												returnObject.find('.plan').append('<a href="'+n.full+'">Download</a>');
											});
										}


										$('.mainContent').find('tbody').append(returnObject);
									}

								});
							}
						}
					});

					if (!postIDFound) {
						execute404();
					} else {
						changePage("in");
					}
				}

			break;

			case "news":
				returnPageData(pageID).done(function(data){
					// Build the page
					$('section').html(php_page_news);
					appendPageTitle(pageID, $('section').find('.pageInfo'));

					// Build property types
					if (!_.isEmpty(json_news_data)) {

						_.each(json_news_data, function(value, key) {
							returnObject = $(php_output_news_story);

							// Date
							pubDate = moment.unix(value.publication_date).format("MMMM DD YYYY");

							returnObject.find('.date').append(pubDate);
							returnObject.find('.publication').append(value.publication);
							returnObject.find('.headline').append(_.unescape(value.the_title));

							downloadArr = value.attachments;

							// if is PDF
							_.each(downloadArr, function(val, k) {
								if ( val.full.indexOf('pdf') != -1) {
									returnObject.find('.download').append('<a href="' + val.full + '">Download</a>');
								}
							});

							$('.mainContent').find('tbody').append(returnObject);
						});
						
					};

					changePage("in");
				});
			break;

			case "services":
				if((postID == "") || (typeof postID === "undefined")){
					returnPageData(pageID).done(function(data){
						// Build the page
						$('section').html(php_page_inner);
						appendPageTitle(pageID, $('section').find('.pageInfo'));
						$('section').find('.page-title').text(pageID);

						// // Build services 
						if (!_.isEmpty(json_services_data)) {

							returnObjectList = $('<ul />');

							_.each(json_services_data, function(value, key) {
								returnObjectListItem = $('<li />');
								returnObjectListItemAnchor = $('<a class="inner-link" />')
								returnObjectListItemAnchor.data('postid', slugify(value.the_title))
								returnObjectListItemAnchor.attr('href', slugify(value.the_title))
								returnObjectListItemAnchor.html(value.the_title)

								returnObjectListItem.append(returnObjectListItemAnchor);

								returnObjectList.append(returnObjectListItem);
							});

							$('.sideBar').append(returnObjectList);
							
						};

						$('.inner-link').on('click', function(e){
							e.preventDefault();
							if(!$(this).parent().hasClass('hyperlink')){
			                    postIDrequest = $(this).data('postid');
			                    pushPageNav('services', postIDrequest);
							} else {
								window.open($(this).attr('href'), '_blank');
							}
						})

						changePage("in");
					});
				} else {
					postIDFound = false;
					_.each(json_services_data, function(value, index){
						if(slugify(value.the_title) == postID){
							postIDFound = true;

							$('section').html(php_page_inner);
							$('section').find('.pageInfo').append('<h2>' + value.the_title + '</h2>');

							returnObject = $(php_output_service_block);
							returnObject.find('.overview-button').attr('data-toggle', value.post_id);
							returnObject.find('.overview-panel').attr('data-panel', value.post_id);
							returnObject.find('.overview-panel').html(_.unescape(value.the_content));

							if ( value.attachments != null ) {
								_.each(value.attachments, function(val, k) {
									returnObject.find('.overview-panel').append('<img src="'+val.thumb+'" />')
								});
							}

							// Get Case Studies
							if (!_.isEmpty(json_cases_data)) {
								_.each(json_cases_data, function(value1, index1) {
									if (value.case_study == value1.post_id) {
										returnObject.find('.case-study-button').attr('data-toggle', value1.post_id)
										returnObject.find('.case-study-panel').attr('data-panel', value1.post_id)
										returnObject.find('.case-study-panel').html(_.unescape(value1.the_content))

										if ( value1.attachments != null ) {
											_.each(value1.attachments, function(val1, k1) {
												returnObject.find('.case-study-panel').append('<img src="'+val1.thumb+'" />');
											});
										}
									}
								});
							}

							$('section').find('.content-entry').append(returnObject);

							// TOGGLE FUNCTION
							$('.service-controls').on('click', 'a', function(e) {
								e.preventDefault();
								currentPanel = $(this).data('toggle');

								$('.panel').animate({
									opacity: 0
								}, 500, function() {
									$('.panel').css('display', 'none');
									$('div[data-panel="'+currentPanel+'"]').css('display', 'block').animate({opacity: 1});
								});

							});

						}

					});

					if(!postIDFound){
						execute404();
					}

					changePage("in");

				}
				
			break;

			case "team":
				returnPageData(pageID).done(function(data){
					// Build the page
					$('section').html(php_page_inner);
					buildSideMenu($('section').find('.sideNav'));

					// Build positions toggle
					if (!_.isEmpty(json_positions_data)) {

						returnObject = $(php_page_team);

						// Loop positions
						_.each(json_positions_data, function(value, key) {
							returnObjectPosition = $('<a href="#" />');
							returnObjectMembers = $('<div />');

								// positions
								returnObjectPosition.html(_.unescape(value.the_title));
								returnObjectPosition.attr('data-toggle', value.post_id)
								// members
								returnObjectMembers.attr('data-panel', value.post_id);
								returnObjectMembers.addClass('panel');

							returnObject.find('.team-position').append(returnObjectPosition);
							returnObject.find('.team-members').append(returnObjectMembers);

							// 	// If we have people
							if ( !_.isEmpty(json_people_data)) {

								returnAllMembers = $('<ul />');

								_.each(json_people_data, function(val, k) {
									if (value.post_id == val.position_type) {
										returnSingleMember = $('<li />');
										returnSingleMemberAnchor = $('<a />');

										returnSingleMemberAnchor.html(_.unescape(val.the_title));

										returnSingleMember.append(returnSingleMemberAnchor);

										returnAllMembers.append(returnSingleMember);

										returnObject.find('div[data-panel="'+val.position_type+'"]').append(returnAllMembers);
									}
								});

							}

						});

						// // Build members
						_.each(json_positions_data, function(value, key) {
							returnMemberPanel = $('<div />');

							returnMemberPanel.attr('data-panel', value.post_id);
							returnMemberPanel.addClass('panel');

							returnObject.find('.all-members').append(returnMemberPanel);

								// If we have people
							if (!_.isEmpty(json_people_data)) {

								_.each(json_people_data, function(val, k) {
									returnObjectMember = $(php_output_team);

									if (value.post_id == val.position_type) {

										if (val.attachments != null) {
											_.each(val.attachments, function(o, p) {
												returnObjectMember.find('.photo').append('<img src="'+ o.thumb +'" alt="" />')
											});
										}
										returnObjectMember.find('.name').append(_.unescape(val.first_name+' '+val.last_name));
										returnObjectMember.find('small').append(_.unescape(value.the_title) + "/" + val.title);
										returnObjectMember.find('.email-phone a').attr('href', 'mailto:' + val.email).append(val.email);
										returnObjectMember.find('.email-phone').append(' | ' + val.phone);
										returnObjectMember.find('.bio').append(_.unescape(val.the_content));


										returnObject.find('.all-members').find('div[data-panel="' + val.position_type + '"]').append(returnObjectMember);
									}
								});
							}
						});

						$('section').find('.content-entry').parent().html(returnObject);
						appendPageTitle(pageID, $('section').find('.pageInfo'));

						// TOGGLE FUNCTION
						$('.team-position').on('click', 'a', function(e) {
							e.preventDefault();
							currentPanel = $(this).data('toggle');

							$('.panel').animate({
								opacity: 0
							}, 500, function() {
								$('.panel').css('display', 'none');
								$('div[data-panel="'+currentPanel+'"]').css('display', 'block').animate({opacity: 1});
							});

						});
						
					}

					changePage("in");
				});
			break;

			default:
				returnPageData(pageID).done(function(data){
					$('section').html(php_page_inner);
					$('section').find('.content-entry').html( _.unescape(data) );
					buildSideMenu($('section').find('.sideNav'));
					appendPageTitle(pageID, $('section').find('.pageInfo'));
					changePage("in");
				});
			break;

		}

		pageAttrID = ($.isNumeric(pageID.charAt(0))) ? "_" + pageID : pageID;
		$('body').data('pageid', pageID);
		$('body').attr('id', pageAttrID);
		fixLinks();
		loadEvents('linkClicker');
		loadEvents('eventClicker');
	}


	function searchProperties(searchData){
		$('.content-entry').html('')
		_.each(json_properties_types_data, function(value, key) {
			returnObjectPropertyTypes = $('<h2 />');

			returnObjectPropertyTypes.attr('data-postid', value.post_id);
			returnObjectPropertyTypes.html(_.unescape(value.the_title));

			$('.content-entry').append(returnObjectPropertyTypes);

			if (!_.isEmpty(searchData)) {

				// sort properties by address
				searchData = _.sortBy(searchData, function(sjpd){ return sjpd.post_id; });
				
				// Loop properties
				_.each(searchData, function(val, ky) {
					returnObject = $(php_output_property);

					returnObject.find('.property-title h3').append(val.the_title);
					returnObject.find('.dimensions').append(val.sqfeet);
					returnObject.find('.inner-link').attr('href', val.post_id);
					returnObject.find('.inner-link').attr('data-postid', val.post_id);


						// Get attachments
						if ( val.attachments != null ) {
							_.each(val.attachments, function(v, k) {
								returnObject.find('.property-photo img').attr('src', v.thumb);
							});
						}

					// append in the appropriate property type
					if ( val.type == value.post_id ) {
						$('.content-entry').find('h2[data-postid="' + val.type + '"]').after(returnObject);
					}
				})
			}
		});
	}

	function colorCurrentMenu(){
		$('.menu-main-menu-container, .sideNav').find('a').each(function(){
			if($(this).attr('href').indexOf(pageID) >= 0){
				$(this).addClass('currentPage');
			} else {
				$(this).removeClass('currentPage');
			}
		});
	}

	function searchResults(dataSource, view, target, searchInput, returnFunction, searchType){
		// based on presumption first dataSource object has all key values
		// exact match search
		searchInput.on('keyup', function(){
			searchArray = searchInput.val().toLowerCase().split(" ");
			resultArray = [];
			_.each(searchArray, function(value0, index0){
				_.each(Object.keys(dataSource[0]), function(value, index){
					results = _.filter(dataSource, function(results, second, third){
						if(typeof results[value] === "string"){
							return (results[value].toLowerCase()).indexOf(value0) >= 0;
						}
					});
					resultArray.push(results);
				});
			});
			resultArray = _.union(resultArray);
			resultArray = _.flatten(resultArray);
			resultArray = _.union(resultArray);
			returnFunction(resultArray, view, target, searchType);
		});

	}

	function returnSearchData(searchData, view, target, searchType) {
		switch(searchType){
			case defaultPage:
				returnString = $('<table class="searchResult" />');
				_.each(searchData, function(value, index){
					viewObject = $(view);
					_.each(value, function(value1, index1){
						switch(index1){
							default:
								searchObject = $("<tr class='viewRow' />");
								searchObject.append("<td class='key'>" + index1 + "</td>");
								if(_.unescape(value1) !== "[object Object]"){
									searchObject.append("<td class='value'>" + _.unescape(value1) + "</td>");
								} else {
									searchObject.append("<td class='value'><pre>" + JSON.stringify(value1, null, 4) + "</pre></td>");
								}
								viewObject.append(searchObject);
							break;
						}
					});
					returnString.append(viewObject);
				});
				target.html(returnString);
			break;
		}
	}



// CHANGE PAGE ANIMATION
	function changePage(transition){
		colorCurrentMenu();
		animationTarget = getAnimationTarget('in');
		switch(transition){
			case "in":
				animationTarget.animate({
					opacity: 1,
				}, 200, function() {
					$('html,body').animate({ scrollTop: 0 }, 0, function() {
						$('section').animate({opacity: 1}, 0);
					});
				});
			break;
		}
	}

	function getAnimationTarget(transition) {
		switch(transition){
			case 'in':
				pageIDfound = false;
				$('.sideNav').find('a').each(function(){
					if(pageID == $(this).data('pageid')){
						pageIDfound = true;
					}
				});
				if(pageIDfound){
					animationTarget = $('.mainContent');
					if(previousPage == "home"){
						animationTarget = $('section');
					}
				} else {
					animationTarget = $('section');
				}
			break;

			case 'out':
				pageIDfound = false;
				$('.sideNav').find('a').each(function(){
					if(pageID == $(this).data('pageid')){
						pageIDfound = true;
					}
				});
				if(pageIDfound){
					animationTarget = $('.mainContent');
				} else {
					animationTarget = $('section');
				}
			break
		}
		return animationTarget;
	}



// ON DOCUMENT READY
	$(document).ready(function(){
		if(typeof $('body').data('tempdir') === "undefined"){
			pageDir = defaultPageDir;
		} else {
			pageDir = $('body').data('tempdir');
		}
		loadFilesToVariables(filesToVariablesArray);

		// var config = {
		// 	kitId: 'INSET TYPEKIT ID AND DELETE ABOVE LINE AND UNCOMMENT THIS ;)',
		// 	scriptTimeout: 1000,
		// 	loading: function() {
		// 	// JavaScript to execute when fonts start loading
		// 	},
		// 	active: function() {
		// 		loadFilesToVariables(filesToVariablesArray);
		// 	},
		// 	inactive: function() {
		// 		loadFilesToVariables(filesToVariablesArray);
		// 	}
		// };
		// var h=document.getElementsByTagName("html")[0];h.className+=" wf-loading";var t=setTimeout(function(){h.className=h.className.replace(/(\s|^)wf-loading(\s|$)/g," ");h.className+=" wf-inactive"},config.scriptTimeout);var tk=document.createElement("script"),d=false;tk.src='//use.typekit.net/'+config.kitId+'.js';tk.type="text/javascript";tk.async="true";tk.onload=tk.onreadystatechange=function(){var a=this.readyState;if(d||a&&a!="complete"&&a!="loaded")return;d=true;clearTimeout(t);try{Typekit.load(config)}catch(b){}};var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(tk,s)

	});

// LOAD FILES TO VARIABLES
	function loadFilesToVariables(fileArray, ignoreStartUp){
		fileKey = Object.keys(fileArray[0]);
		fileValue = "/" + fileArray[0][Object.keys(fileArray[0])];
		fileType = fileValue.split(".").slice(-1)[0];
		switch(fileType){
			case "json":
				pageData = $.getJSON(pageDir + fileValue + urlQueryString, function() {});
			break;

			case "html":
				pageData = $.get(pageDir + fileValue + urlQueryString, function() {});
			break;

			case "php":
				pageData = $.get(pageDir + fileValue + urlQueryString, function() {});
			break;
		}
		pageData.done(function(data){
			window[fileType + "_" + fileKey] = data;
			if(fileArray.length > 1){
				fileArray.shift();
				loadFilesToVariables(fileArray);
			} else{
				if(!ignoreStartUp){
					startUp();
				}
			}
		});
	}

	var orig = filesToVariablesArray.length;
	var reps = 0;
	var repTracker = 1;

	function loadFilesToVariables(fileArray, ignoreStartUp){
		fileTracker = {};
		_.each(fileArray, function(value, index){
			fileKey = Object.keys(fileArray[index]);
			fileValue = "/" + fileArray[index][Object.keys(fileArray[index])];
			fileType = fileValue.split(".").slice(-1)[0];
			fileTracker[fileKey] = {};
			fileTracker[fileKey]['fileType'] = fileType;
			fileTracker[fileKey]['fileKey'] = fileKey;

			switch(fileType){
				case "json":
				fileTracker[fileKey]['pageData'] = $.getJSON(pageDir + fileValue + urlQueryString, function() {});
				break;

				case "html":
				fileTracker[fileKey]['pageData'] = $.get(pageDir + fileValue + urlQueryString, function() {});
				break;

				case "php":
				fileTracker[fileKey]['pageData'] = $.get(pageDir + fileValue + urlQueryString, function() {});
				break;
			}

			fileTracker[fileKey]['pageData'].complete(function(data){
				thisURL = this.url.replace(defaultPageDir + "/", '');
				thisURL = thisURL.split("?");
				thisURL = thisURL[0];
				_.each(filesToVariablesArray, function(value1, index1){
					if(filesToVariablesArray[index1][Object.keys(filesToVariablesArray[index1])] == thisURL){
						window[thisURL.split(".")[1] + "_" + Object.keys(filesToVariablesArray[index1])] = data.responseText;
						fileLoaded();
					}
				});
			});
		});
}

function fileLoaded(){
	repTracker++;
	loaderVal = 50 + (reps * repTracker);
	if(pageID != "admin"){
		// document.getElementById('loader').style.width = loaderVal + '%';
		if(repTracker == orig){
			$('#loader').fadeOut();
			startUp();
		}
	} else {
		if(repTracker == orig){
			startUp();
		}
	}
}

// START UP FUNCTION
	function startUp(){
		setPageID(RewriteBase);
		if(pageID == "admin"){
			loadDatePicker($('.date'));
			loadSortable($(".sortable"));
			if($('#people_sample_hidden_meta').size() != 0){
				$('#people_sample_hidden_meta').find('.hidden_meta').val('I was generated dynamically')
			}
			$('head').append('<link rel="stylesheet" id="jquery-style-css" href="' + pageDir + '/styles/admin-styles.min.css" type="text/css" media="all">');
		} else {
			prependUrl = returnPrependUrl();
			fixLinks();
			$('#menu-main-menu').superfish({
				delay: 600,
				speed: 300
			});
			loadEvents("menuClicker");
			loadEvents("logoClicker");
			loadEvents("subNavClicker");
			loadEvents('extraMenu');

			loadEvents("footerClicker");
			$('#menu-main-menu-1').easyListSplitter({ colNumber: 2 });

			loadView(pageID, postID);
			startUpRan = true;
		}
	}

// FIX MENU LINKS
function fixLinks(){
	$('#menu-main-menu, .helperLinks, .infoBlock, .sideNav, .footerNav').find('a').each(function(){
		if(!($(this).parent().hasClass('hyperlink') || $(this).hasClass('hyperlink'))){
			pageSlug = $(this).html().replace('&amp;', '')
			$(this).attr('href', prependUrl + slugify(pageSlug) + "/");
			$(this).data('pageid', slugify(pageSlug));
		}
	});
}

// BUILD SIDE BAR
	function buildSideMenu(target){
		$('#menu-main-menu').find('li').each(function(){
			if(pageID == $(this).children('a').data('pageid')){
				if(typeof $(this).parents('.menu-item-object-page').html() !== "undefined"){
					if($(this).parents('.menu-item-object-page').size() > 1){
						menuObject = $(this).parents('.menu-item-object-page').eq(1).clone();
					} else {
						menuObject = $(this).parents('.menu-item-object-page').clone();
					}
				} else {
					menuObject = $(this).clone();
				}
			}
		});
		if(typeof menuObject !== "undefined"){
			menuObject.find('ul').attr('style', '');

			target.html(menuObject);
			loadEvents('sideMenuClicker');
			fixLinks();
			// stickySideBar();
		}
	}

	function stickySideBar() {

		$(".sideBar").sticky({
			topSpacing: 50,
			bottomSpacing: 475,
			wrapperClassName: 'sideBarSticky'
		});
		$('.sideBarSticky').css('position', 'absolute');
	}

// SET PAGE ID
	function setPageID(pagePath, postIDpath){
		if($('body').hasClass("wp-admin")){
			pageID = "admin";
		}
		else {
			pageIDFound = false;
			urlArray = window.location.pathname.replace(pagePath, '');
			urlArray = urlArray.split("/");
			if(urlArray[urlArray.length-1] == ""){
				urlArray.pop();
			}
		// first array item must be pageID
			if(typeof urlArray[0] === "undefined"){
				pageIDFound = true;
				pageID = defaultPage;
			} else {
				_.each(json_pages, function(value, index){
					if(value.pageID == urlArray[0]){
						pageIDFound = true;
						pageID = value.pageID;
					}
				});
			}
			if(!pageIDFound){
				if(!ajaxer){
					execute404();
				}
			} else {
			// second array item must be itemID
				if(urlArray.length == 2){
					switch(urlArray[0]){
						case "recent-news":
							_.each(json_news_data, function(value, index){
								if(value.post_id == urlArray[1]){
									postIDFound = true;
									postID = value.post_id;
								}
							});
						break;

						case "services":
							postIDFound = true;
							postID = urlArray[1];
						break;

						case "listing":
							postIDFound = true;
							postID = urlArray[1];
						break;
					}
				} else {
					postID = "";
				}
				if(typeof postIDpath !== "undefined"){
					postIDFound = false;
					postIDpath = postIDpath.split("/");
					// _.each(json_events_data, function(value, index){
					// 	if(value.post_id == postIDpath[postIDpath.length-1]){
					// 		postIDFound = true;
					// 		postID = value.post_id;
					// 	}
					// });
				}
			}
		}
	}

// EXECUTE 404
	function execute404(){
		$('section').html("<h1>This page was not found, you are being redirect to the home page</h1>");
		window.location = pathPrefix + defaultPage;
	}

// LOAD JQUERY UI DATE PICKER
	function loadDatePicker(target, changeCallback){
		hiddenDate = target.siblings('input');
		target.datetimepicker();
		if(hiddenDate.val() == ""){
			var myDate = new Date();
			var prettyDate =(myDate.getMonth()+1) + '/' + myDate.getDate() + '/' + myDate.getFullYear() + " " + myDate.getHours() + ":" + myDate.getMinutes();
			target.val(prettyDate);
			hiddenDate.val(Date.parse(prettyDate)/1000);
		}
		target.change(function() {
			$(this).siblings('input').val(Date.parse($(this).val())/1000);
			dateArray = [{event_start: $('input[name="event_start"]').val(), event_end: $('input[name="event_end"]').val()}];
			$('#event_date_array_meta').find('.hidden_meta').val(JSON.stringify(dateArray));
			if(changeCallback){
				updateRepeatConfig();
			}
		});
	}

// LOAD JQUERY UI SORTABLE
	function loadSortable(target){
		target.sortable();
		target.disableSelection();
		target.on( "sortstop", function( event, ui ) {
			sortData = {};
			$(this).children('li').each(function(){
				sortData[$(this).data('id')] = $(this).index();
			});
			var data = {
				action: 'update_sort',
				sort_data: sortData
			};
			$.post(ajaxurl, data, function(response) {
				console.log('Got this from the server: ' + response);
			});					
		});
	}

// GET PREPEND URL STRING
	function returnPrependUrl(){
		pageLevel = window.location.pathname.replace(RewriteBase, "").split("/");
		if(pageLevel[pageLevel.length-1] == ""){
			pageLevel.pop();
		}
		prependUrl = "";
		for (var i = 0; i < pageLevel.length; i++) {
			prependUrl += "../";
		};
		return prependUrl;
	}

// TURN SLUG INTO STRING
	function slugify(text){
	  return text.toString().toLowerCase()
	    .replace(/\+/g, '')           // Replace spaces with 
	    .replace(/\s+/g, '-')           // Replace spaces with -
	    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
	    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
	    .replace(/^-+/, '')             // Trim - from start of text
	    .replace(/-+$/, '');            // Trim - from end of text
	}

// APPEND PAGE TITLE
	function appendPageTitle(pageRequest, target){
		_.each(json_pages, function(value, index){
			if(value.pageID == pageRequest){
				target.prepend("<h2>" + value.pageTitle + "</h2>");
			}
		});
	}

// RETURN PAGE DATA
	function returnPageData(pageRequest){
		$.each(json_pages, function(index, value){
			if(pageRequest == value.pageID){
				returnedPageData = $.post(pageDir + "/machines/handlers/loadPage.php", { pageID: value.wp_page_id}, function() {});
			}
		});
		return returnedPageData;
	}


// LOAD EVENTS
    function loadEvents(eventRequest, params){
        switch(eventRequest){

            case "menuClicker":
                $('.menu-main-menu-container').on('click', 'a', function(e){
                    e.preventDefault();
					if(!$(this).parent().hasClass('hyperlink')){
	                    pageIDrequest = $(this).data('pageid');
	                    pushPageNav(pageIDrequest);
					} else {
						window.open($(this).attr('href'), '_blank');
					}
                });
            break;

            case "extraMenu":
                $('.side-menu').on('click', 'a', function(e){
                    e.preventDefault();
					
					pageIDrequest = cleanPageState($(this).attr('href'));
					pushPageNav(pageIDrequest);
                });
            break;

            case "footerClicker":
                $('footer').on('click', 'a', function(e){
                    e.preventDefault();
					if(!$(this).hasClass('hyperlink')){
	                    pageIDrequest = cleanPageState($(this).attr('href'));
	                    pushPageNav(pageIDrequest);
					} else {
						window.open($(this).attr('href'), '_blank');
					}
                });
            break;

            case "sideMenuClicker":
                $('.sideNav').on('click', 'a', function(e){
                    e.preventDefault();
					if(!$(this).parent().hasClass('hyperlink')){
	                    pageIDrequest = $(this).data('pageid');
	                    pushPageNav(pageIDrequest);
					} else {
						window.open($(this).attr('href'), '_blank');
					}
                });
            break;

            case "logoClicker":
                $('.logo').on('click', 'a', function(e){
                    e.preventDefault();
                    pushPageNav(defaultPage);
                });
            break;

            case "linkClicker":
                $('.link').on('click', function(e){
                    e.preventDefault();
                    pageIDrequest = cleanPageState($(this).attr('href'));
                    pushPageNav(pageIDrequest);
                });
            break;

            case "subNavClicker":
                $('.subNav').on('click', 'a', function(e){
                    e.preventDefault();
					if(!$(this).hasClass('hyperlink')){
	                    pageIDrequest = cleanPageState($(this).attr('href'));
	                    pushPageNav(pageIDrequest);
	                } else {
						window.open($(this).attr('href'), '_blank');
					}
				});
            break;

        }
    }

// HISTORY PUSH STATE
    function pushPageNav(pageIDrequest, postID){
    	if(typeof postID === "undefined"){
    		postIDurl = "";
    	} else {
    		postIDurl = postID + "/";
    	}
        if (Modernizr.history){
			animationTarget = getAnimationTarget('out');
			animationTarget.animate({
				opacity: 0,
			}, 200, function() {
				pageLevel = window.location.pathname.replace(RewriteBase, "").split("/");
				prependPushStateUrl = returnPrependUrl()
                if((window.location.pathname.charAt(window.location.pathname.length-1) == "/") && (window.location.pathname != RewriteBase)){
                	newPage = prependPushStateUrl + pageIDrequest + "/" + postIDurl;
                } else {
                	newPage = prependPushStateUrl + pageIDrequest + "/" + postIDurl;
                }
			    var stateObj = { pageID: newPage};
				history.pushState(stateObj, null, newPage);
				previousPage = pageID;
				pageID = pageIDrequest;
			    loadView(pageIDrequest, postID);
			});
        } else {
			window.location = pathPrefix + pageIDrequest + "/" + postIDurl;
        }
    }

// HISTORY POP STATE
    $(window).on('popstate',function(){
		if(startUpRan){
			previousPage = pageID;
			animationTarget = getAnimationTarget('out');
	    	if(history.state != null){
				animationTarget.animate({
					opacity: 0,
				}, 200, function() {
					setPageID(RewriteBase, history.state.pageID);
		    		loadView(cleanPageState(history.state.pageID), postID);
				});
	    	} else {
    			loadPage = cleanPageState(window.location.pathname.replace(RewriteBase, ""));

    			postIDtest = window.location.pathname.split("/");
    			if(postIDtest[postIDtest.length-1] == ""){
    				postIDtest.pop();
    			}
    			if($.isNumeric(postIDtest[postIDtest.length-1])){
    				postID = postIDtest[postIDtest.length-1];
    			}

    			if(loadPage == ""){
    				loadPage = defaultPage;
    			}
    			pageID = loadPage;
				animationTarget.animate({
					opacity: 0,
				}, 200, function() {
	    			loadView(loadPage, postID);	
				});
	    	}
	    }
    });

// STRIP PAGE URL TO SLUG
    function cleanPageState(historyState){
    	postIDtest = historyState.split("/");
    	if(postIDtest[postIDtest.length-1] == ""){
    		postIDtest.pop();
    	}
    	if($.isNumeric(postIDtest[postIDtest.length-1])){
    		postIDtest.pop();
    		historyState = postIDtest.join("/");
    	}
		historyState = historyState.replace("../","");
		historyState = historyState.replace("/","");
	    historyState = historyState.replace(/\.\.+/g, '');
	    historyState = historyState.replace(/\/+/g, '');
		return historyState;
    }

// PARSE URL VARIABLES
	function getUrlVars(){
	    var vars = [], hash;
	    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	    for(var i = 0; i < hashes.length; i++){
	        hash = hashes[i].split('=');
	        vars.push(hash[0]);
	        vars[hash[0]] = hash[1];
	    }
	    return vars;
	}

	function setSlider(target, value){
		target.slider("value", value);
		target.siblings('.amount').html( value );
	}

//})(jQuery, );