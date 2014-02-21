var $ = jQuery;
//(function($) { 

// ADD OBJECT.KEYS SUPPORT TO IE8
if (!Object.keys) {
    Object.keys = (function() {
        'use strict';
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({
                toString: null
            }).propertyIsEnumerable('toString'),
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
        return function(obj) {
            if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                throw new TypeError('Object.keys called on non-object');
            }
            var result = [],
                prop, i;
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
var noop = function() {};
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
var defaultPageDir = "http://evo-re.com/wp-content/themes/evo";
var pathPrefix = "http://evo-re.com/";
var RewriteBase = "/"; // if url is http://171.321.43.24/~foobar/ then the value should equal /~foobar/
var urlQueryString = "?" + Math.floor((Math.random() * 10000) + 1);
var filesToVariablesArray = [
        {'page_inner': 'views/page_inner.php'},
        {'page_listing': 'views/page_listing.php'},
        {'page_property': 'views/page_property.php'},
        {'page_listing_floors': 'views/page_listing_floors.php'},
        {'output_listing_search': 'views/output_listing_search.php'},
        {'output_property': 'views/output_property.php'},
        {'output_floor': 'views/output_floor.php'},
        {'output_contact_wrapper': 'views/output_contact_wrapper.php'},
        {'output_property_contact': 'views/output_property_contact.php'},
        {'page_news': 'views/page_news.php'},
        {'output_news_story': 'views/output_news_story.php'},
        {'page_services': 'views/page_services.php'},
        {'page_team': 'views/page_team.php'},
        {'output_team': 'views/output_team.php'},
        {'output_service_block': 'views/output_service_block.php'},
        {'page_home': 'views/page_home.php'},
        {'page_search': 'views/page_search.php'},
        {'output_search_results': 'views/output_search_results.php'},
        {'output_not_found': 'views/output_not_found.php'},
        {'text_input': 'views/input_text.php'}
    ];

if (typeof ajaxer === "undefined") {
    ajaxer = false;
}

// LOAD VIEWS
function loadView(pageID, postID) {
    prependUrl = returnPrependUrl();
    switch (pageID) {
        case defaultPage:
            returnPageData(pageID).done(function(data) {
                $('section').html(php_page_home);

                $('section').find('.content').html(data);


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

        case "contact":
            returnPageData(pageID).done(function(data) {
                $('section').html(php_page_inner);
                $('section').find('.content-entry').html(_.unescape(data));
                appendPageTitle(pageID, $('section').find('.pageInfo'));
                changePage("in");
            });
        break;

        case "legal":
            returnPageData(pageID).done(function(data) {
                $('section').html(php_page_inner);
                $('section').find('.content-entry').html(_.unescape(data));
                appendPageTitle(pageID, $('section').find('.pageInfo'));
                changePage("in");
            });
        break;

        case "listings":
            if ((postID == "") || (typeof postID === "undefined") || (postID == null)) {
                returnPageData(pageID).done(function(data) {
                    // Build the page
                    $('section').html(php_page_listing);
                    appendPageTitle(pageID, $('section').find('.pageInfo'));

                    // Populate submarket
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

                    // populate square feet
                    if (!_.isEmpty(json_properties_data)) {
                        sqfeetArr = [];

                        _.each(json_properties_data, function(value, key) {

                            sqfeetArr.push(cleanUpNumbers(value.sqfeet));

                        });

                        sqfeetArr = _.uniq(sqfeetArr);
                        sqfeetArr = sqfeetArr.sort().reverse();

                        // Ranges array
                        rangeFeetArr = [
                            {'min': 0, 'max': 1000},
                            {'min': 1000, 'max': 3000},
                            {'min': 3000, 'max': 5000},
                            {'min': 5000, 'max': 10000},
                            {'min': 10000, 'max': 25000},
                            {'min': 25000, 'max': 50000},
                            {'min': 50000, 'max': 75000},
                            {'min': 75000, 'max': 100000},
                            {'min': 100000, 'max': 'over'}
                        ];

                        _.each(rangeFeetArr, function(value, key) {
                            returnObjectOption = $('<option />');

                            if (value.max == 'over') {
                                returnObjectOption.html("Over " + value.min + " RSF");
                            } else {
                                returnObjectOption.html(value.min + ' - ' + value.max + " RSF");
                            }
                            returnObjectOption.val(value.min + '-' + value.max);

                            $('.search-properties').find('.sqfeet').append(returnObjectOption);
                        });
                    }

                    // Populate property types
                    if (!_.isEmpty(json_properties_types_data)) {

                        _.each(json_floor_types_data, function(value, key) {
                            returnObjectOption = $('<option />');

                            returnObjectOption.val(value.post_id);
                            returnObjectOption.html(_.unescape(value.the_title));

                            $('.search-properties').find('.property_type').append(returnObjectOption);

                        });

                        $('section').find('.content-entry').before(returnSearchObject);

                    }

                    // Populate rent
                    if (!_.isEmpty(json_floors_data)) {

                        rentPriceArray = [];

                        _.each(json_floors_data, function(value, key) {

                            rentPriceArray.push(value.rent);

                        });
                        rentPriceArray = _.uniq(rentPriceArray);
                        rentPriceArray = rentPriceArray.sort().reverse();

                        // ranges array
                        rentRangeArr = [
                            {'min': 10, 'max': 20},
                            {'min': 20, 'max': 30},
                            {'min': 30, 'max': 40},
                            {'min': 40, 'max': 50},
                            {'min': 50, 'max': 60},
                            {'min': 60, 'max': 70},
                            {'min': 70, 'max': 80},
                            {'min': 80, 'max': 90},
                            {'min': 90, 'max': 100}
                        ];

                        _.each(rentRangeArr, function(value, key) {
                            returnObjectOption = $('<option />');
                            returnObjectOption.val(value.min + '-' + value.max);
                            returnObjectOption.html('$' + value.min + ' - ' + '$' + value.max);

                            $('.search-properties').find('.rent').append(returnObjectOption);
                        });
                    }

                    // Build property types
                    if (!_.isEmpty(json_properties_types_data)) {

                        // sort property types
                        json_properties_types_data = _.sortBy(json_properties_types_data, function(sjptd) {
                            return Math.sin(sjptd.post_id);
                        });

                        // BUILD PROPERTIES LISTING
                        resetSearchResults();

                    };

                    // SEARCH QUERY
                    $('.search-properties form').on('submit', function(e) {
                        e.preventDefault();

                        formData = $(this).serializeArray();

                        userRequest = [];
                        _.each(formData, function(i, field) {
                            if(i.value != ""){
                                userRequest.push(i.name);
                            }
                            switch(i.name) {
                                case 'submarket':
                                    submarketField = i.value;
                                break;

                                case 'sqfeet':
                                    sqfeetField = i.value;
                                    sqfeetField = sqfeetField.split('-');
                                    if (sqfeetField[1] == 'over') {
                                        minSqFeet = parseInt(sqfeetField[0]);
                                        maxSqFeet = 'over';
                                    } else {
                                        minSqFeet = parseInt(sqfeetField[0]);
                                        maxSqFeet = parseInt(sqfeetField[1]);
                                    }
                                break;

                                case 'property_type':   
                                    typeField = i.value;
                                break;

                                case 'rent':
                                    rentField = i.value;
                                    rentField = rentField.split('-');
                                    minRent = parseInt(rentField[0]);
                                    maxRent = parseInt(rentField[1]);
                                break;
                            }
                        });

                        // Final array to search
                        finalSearchresults = []
                        
                        // BUILD SEARCH RESULTS PAGE
                        // Submarket Array
                        searchSubmarketResults = [];
                        _.each(json_properties_data, function(value, key) {
                            if (submarketField != "" && submarketField == value.submarket) {
                                searchSubmarketResults.push(value.post_id);
                            }
                        });

                        // Submarket cont...
                        results_submarket = _.filter(json_floors_data, function(results) {
                            return ( $.inArray(cleanUpNumbers(results.address), searchSubmarketResults) != -1 );
                        });

                        if($.inArray('submarket', userRequest) != -1){
                            finalSearchresults.push(results_submarket);
                        }


                        // SQ Feet
                        results_sqfeet = _.filter(json_floors_data, function(results) {
                            cleanSqFeet = cleanUpNumbers(results.sqfeet);

                            if (sqfeetField == "nolimit" ) {
                                return true;
                            } else if (maxSqFeet == 'over') {
                                return (cleanSqFeet >= minSqFeet)
                            } else {
                                return (cleanSqFeet <= maxSqFeet) && (cleanSqFeet >= minSqFeet);
                            }
                        });

                        if($.inArray('sqfeet', userRequest) != -1) {
                            finalSearchresults.push(results_sqfeet);
                        }


                        // Property type Array
                        searchTypeResults = [];
                        _.each(json_floors_data, function(value, key) {
                            _.each(value.floor_type, function(val, k) {
                                if (typeField == val) {
                                    searchTypeResults.push(value.post_id)
                                }
                            })
                        });

                        // Property Type cont...
                        results_property_type = _.filter(json_floors_data, function(results) {
                            return ($.inArray(results.post_id, searchTypeResults) != -1);
                        });


                        if($.inArray('property_type', userRequest) != -1){
                            finalSearchresults.push(results_property_type);
                        }

                        // Rent
                        // Build range array
                        if (!_.isNaN(minRent)) {
                            rentMinMaxRangeArr = _.range(minRent, maxRent + 1);
                        } else {
                            rentMinMaxRangeArr = 0;
                        }
                        results_rent = _.filter(json_floors_data, function(results) {
                            floorRent = results.rent;

                            switch(floorRent){
                                case "Upon Request":
                                    return true;
                                break;

                                case "":
                                    return false;
                                break;

                                default:
                                    // Clean up currency
                                    cleanUpRent = parseInt(floorRent.replace(/(\$)|(\.0(?![^0]).*$)/g, ""));
                                    if((cleanUpRent >= rentField[0]) && (cleanUpRent <= rentField[1])){
                                        return true;
                                    } else {
                                        return false;
                                    }
                                break;
                            }

<<<<<<< HEAD

                        });
=======
    // Rent
    // Build range array
    if (!_.isNaN(minRent)) {
        rentMinMaxRangeArr = _.range(minRent, maxRent + 1);
    } else {
        rentMinMaxRangeArr = 0;
    }
    results_rent = _.filter(json_floors_data, function(results) {
        floorRent = results.rent;

        switch(floorRent){
            case "Upon Request":
                return true;
            break;

            case "":
                return false;
            break;

            default:
                // Clean up currency
                cleanUpRent = parseInt(floorRent.replace(/(\$)|(\.0(?![^0]).*$)/g, ""));
                if((cleanUpRent >= rentField[0]) && (cleanUpRent <= rentField[1])){
                    return true;
                } else {
                    return false;
                }
            break;
        }




        // if ( _.contains(rentMinMaxRangeArr, cleanUpRent) == true) {
        //     return (_.contains(rentMinMaxRangeArr, cleanUpRent) == true)
        //     console.log('exists')
        // } else {
        //     return (_.reject(rentMinMaxRangeArr, function(num) { return (_.contains(rentMinMaxRangeArr, cleanUpRent) == true) }))
        // }

        // return (cleanUpRent >= cleanMinRent) && (cleanUpRent <= cleanMaxRent);
        // if (rentField != 'Upon Request') {
        //     return (cleanUpRent >= cleanMinRent) && (cleanUpRent <= cleanMaxRent);
        // } else if (rentField == 'Upon Request') {
        //     return results.rent == 'Upon Request';
        // } else {
        //     return results.rent == 'Upon Request';
        // }
>>>>>>> 7b188bb93c618e52d0e997fed5c87cdc985bc4ff

                        if($.inArray('rent', userRequest) != -1){
                            finalSearchresults.push(results_rent);
                        }

                        json_properties_search = _.intersection.apply(_, finalSearchresults);

                        if(_.isEmpty(userRequest)){
                            // console.log('no search, show all results')
                            resetSearchResults();
                        } else {
                            // console.log('the was a search, show search results')
                            if (!_.isEmpty(json_properties_search)) {
                                searchProperties(json_properties_search);
                            } else {
                                $('.content-entry').html(php_output_not_found);
                            }
                        }


                    });

                    $('.management-amp038-leasing .property, .inner-link').on('click', function(e) {
                        e.preventDefault();
                        if (!$(this).parent().hasClass('hyperlink')) {
                            postIDrequest = $(this).data('postid');
                            pushPageNav('listings', postIDrequest);
                        } else {
                            window.open($(this).attr('href'), '_blank');
                        }
                    });

                    changePage("in");
                });
            } else {

                // PROPERTY DETAILS
                postIDFound = false;

                _.each(json_properties_data, function(value, index) {
                    if (value.post_id == postID) {
                        postIDFound = true;

                        $('section').html(php_page_property);
                        $('section').find('.pageInfo').append('<h2>' + value.the_title + '</h2>');
                        $('section').find('.property-content').append(_.unescape(value.the_content));

                        featuredImgWrapper = $('<div class="featuredImage" />');
                        featuredImg = $('<img class="featured" />');
                        viewImages = $('<a href="#" class="view-more">View more images</a>');

                        // Get Attachments
                        if (value.attachments != null) {

                            // Set featured image
                            if (value.featured_thumb == 'Y' && value.featuredImage != null) {
                                featuredImg.attr('src', value.featuredImage);
                                featuredImgWrapper.append(featuredImg);

                                $('section').find('.single-property').prepend(featuredImgWrapper);
                            } else {
                                // $('section').find('.single-property').prepend('<img class="featured" src="' + value.attachments[0].full + '" />');
                                featuredImg.attr('src', value.attachments[0].full);
                                featuredImgWrapper.append(featuredImg);

                                $('section').find('.single-property').prepend(featuredImgWrapper);
                            }

                            // Build attachments array
                            attachmentsArr = [];
                            _.each(value.attachments, function(val, k) {
                                attachmentsArr.push(val.full);
                            });

                            if (attachmentsArr.length > 1 ) {
                                featuredImgWrapper.append(viewImages);
                            }
                        }

                        // Get website text and link
                        if (value.website_button != "" && value.website != "") {
                            $('section').find('.property-content').append('<a class="website" target="_blank" href="' + value.website + '">' + value.website_button + '<br /><small>View Website</small></a>');
                        } else if (value.website != "") {
                            $('section').find('.property-content').append('<a class="website" target="_blank" href="' + value.website + '">View Website</a>');
                        }

                        // Get property contact information
                        if (value.contact != "") {
                            returnContactWrapper = $(php_output_contact_wrapper);

                            _.each(value.contact, function(val, k) {
                                returnPropertyContact = $(php_output_property_contact);
                                _.each(json_people_data, function(l, m) {
                                    if (val == l.post_id) {
                                        returnPropertyContact.find('.first_name').html(l.first_name);
                                        returnPropertyContact.find('.last_name').html(l.last_name);
                                        returnPropertyContact.find('.phone').html(l.phone);
                                        returnPropertyContact.find('.email').find('a').html(l.email);
                                        returnPropertyContact.find('.email').find('a').attr('href', 'mailto:' + l.email);
                                    }
                                });

                                returnContactWrapper.find('.contacts').append(returnPropertyContact);
                            });

                            // APPEND CONTACTS TO DOM
                            $('section').find('.mainContent').append(returnContactWrapper);
                        }

                        // get floors list
                        if (!_.isEmpty(json_floors_data)) {

                            $('section').find('.property-content').append(php_page_listing_floors);

                            _.each(json_floors_data, function(v, i) {
                                returnObject = $(php_output_floor);

                                if (value.post_id == v.address) {
                                    returnObject.find('.floor').append(v.floor_proper);
                                    returnObject.find('.sq').append(v.sqfeet);
                                    returnObject.find('.rent').append(v.rent);
                                    returnObject.find('.comment').append(_.unescape(v.the_content));

                                    // get floor types
                                    _.each(v.floor_type, function(j, k) {
                                        _.each(json_floor_types_data, function(l, m) {
                                            if (j == l.post_id) {
                                                if (v.floor_type.length > 1 && m == 0) {
                                                    returnObject.find('.type').append(l.the_title + ' or ');  
                                                } else {
                                                    returnObject.find('.type').append(l.the_title);
                                                }                                                
                                            }
                                        });
                                    });

                                    // get attachments
                                    if (v.attachments != null) {
                                        _.each(v.attachments, function(n, o) {
                                            returnObject.find('.plan').append('<a href="' + n.full + '" target="_blank">Download</a>');
                                        });
                                    }


                                    $('.mainContent').find('tbody').append(returnObject);

                                    // stripe table
                                    $("tr:even").addClass("even");
                                }

                            });
                        }

                    }
                });

                // Initialize Shadowbox if we have more than one image
                if (attachmentsArr.length > 1) {
                    // init Shadowbox
                    Shadowbox.init({
                        skipSetup: true,
                        player: 'img'
                    });

                    // Create array of objects from urls
                    slideshowArr = Shadowbox.makeGallery(attachmentsArr);
                    _.each(slideshowArr[0], function(obj) {
                        obj['player'] = 'img'
                    });

                    // Open Shadowbox on click
                    $('.view-more').on('click', function(e) {
                        e.preventDefault();

                        Shadowbox.open(slideshowArr[0]);

                    });
                }

                if (!postIDFound) {
                    execute404();
                } else {
                    changePage("in");
                }
            }

            break;

        case "news":
            returnPageData(pageID).done(function(data) {
                // Build the page
                $('section').html(php_page_news);
                appendPageTitle(pageID, $('section').find('.pageInfo'));

                // Build property types
                if (!_.isEmpty(json_news_data)) {

                    // Sort by Publication Date
                    // json_news_data = _.sortBy(json_news_data, function(num) {
                    //     return num.publication_date;
                    // });

                    // Order Descending
                    // json_news_data.reverse();

                    _.each(json_news_data, function(value, key) {
                        returnObject = $(php_output_news_story);

                        // Date
                        pubDate = moment.unix(value.publication_date).format("MMMM DD, YYYY");

                        returnObject.find('.date span').append(pubDate);
                        returnObject.find('.publication span').append(value.publication);
                        returnObject.find('.headline span').append(_.unescape(value.the_title));

                        downloadArr = value.attachments;

                        // if is PDF
                        _.each(downloadArr, function(val, k) {
                            if (val.full.indexOf('pdf') != -1) {

                                returnObject.find('.date span').wrap('<a target="_blank" href="' + val.full + '" title="' + _.unescape(value.the_title) + '" />');
                                returnObject.find('.publication span').wrap('<a target="_blank" href="' + val.full + '" title="' + _.unescape(value.the_title) + '" />');
                                returnObject.find('.headline span').wrap('<a target="_blank" href="' + val.full + '" title="' + _.unescape(value.the_title) + '" />');
                                returnObject.find('.download').append('<a target="_blank" href="' + val.full + '" title="' + _.unescape(value.the_title) + '">Download</a>');
                                // returnObject.find('.date').prepend('<a target="_blank" href="' + val.full + '" title="' + _.unescape(value.the_title) + '">');
                            }
                        });

                        $('.mainContent').find('tbody').append(returnObject);

                        // stripe table
                        $("tr:even").addClass("even");
                    });

                };

                changePage("in");
            });
            break;

        case "services":
            if ((postID == "") || (typeof postID === "undefined") || (postID == null)) {
                returnPageData(pageID).done(function(data) {
                    // Build the page
                    $('section').html(php_page_inner);
                    appendPageTitle(pageID, $('section').find('.pageInfo'));
                    $('section').find('.page-title').text(pageID);

                    // Build services side menu
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

                    $('.inner-link').on('click', function(e) {
                        e.preventDefault();
                        if (!$(this).parent().hasClass('hyperlink')) {
                            postIDrequest = $(this).data('postid');
                            pushPageNav('services', postIDrequest);
                        } else {
                            window.open($(this).attr('href'), '_blank');
                        }
                    })

                    changePage("in");
                });
            } else {
                // Inner page
                postIDFound = false;
                _.each(json_services_data, function(value, index) {
                    if (slugify(value.the_title) == postID) {
                        postIDFound = true;

                        $('section').html(php_page_inner);
                        $('section').find('.pageInfo').append('<h2>' + _.unescape(value.the_title) + '</h2>');


                        // Get Overview
                        returnObject = $(php_output_service_block);
                        featuredImgService = $('<img class="featured" />');
                        featuredImgService.attr('src', value.featuredImage);
                        returnObject.find('.overview-button').attr('data-toggle', value.post_id);
                        returnObject.find('.overview-panel').attr('data-panel', value.post_id);
                        returnObject.find('.overview-panel').html(_.unescape(value.the_content));
                        returnObject.find('.overview-panel').prepend(featuredImgService);

                        // Get Case Studies
                        if (!_.isEmpty(json_cases_data)) {
                            _.each(json_cases_data, function(value1, index1) {
                                if (value.case_study == value1.post_id) {
                                    featuredImg = $('<img class="featured" />');
                                    featuredImg.attr('src', value1.featuredImage);

                                    returnObject.find('.case-study-button').attr('data-toggle', value1.post_id);
                                    returnObject.find('.case-study-panel').attr('data-panel', value1.post_id);
                                    returnObject.find('.case-study-panel').html(_.unescape(value1.the_content));
                                    returnObject.find('.case-study-panel').prepend(featuredImg);
                                }
                            });
                        }

                        // Remove buttons if no case study 
                        if (value.case_study == "") {
                            returnObject.find('.service-controls').remove();
                        }

                        $('section').find('.content-entry').append(returnObject);

                        // TOGGLE FUNCTION
                        $('.service-controls').on('click', 'a', function(e) {
                            e.preventDefault();
                            currentPanel = $(this).data('toggle');

                            $('.service-controls a').removeClass('active')
                            $(this).addClass('active')

                            $('.panel').animate({
                                opacity: 0
                            }, 500, function() {
                                $('.panel').css('display', 'none');
                                $('div[data-panel="' + currentPanel + '"]').css('display', 'block').animate({
                                    opacity: 1
                                });
                            });

                        });

                    }

                });

                if (!postIDFound) {
                    execute404();
                }

                // Build services side menu
                if (!_.isEmpty(json_services_data)) {

                    returnObjectList = $('<ul />');

                    _.each(json_services_data, function(value, key) {
                        returnObjectListItem = $('<li />');
                        returnObjectListItemAnchor = $('<a class="inner-link" />')
                        returnObjectListItemAnchor.data('postid', slugify(value.the_title))
                        returnObjectListItemAnchor.attr('href', slugify(value.the_title))
                        returnObjectListItemAnchor.html(_.unescape(value.the_title));

                        // Add active state
                        if (returnObjectListItemAnchor.data('postid') == postID) {
                            returnObjectListItemAnchor.addClass('currentPage');
                        }

                        returnObjectListItem.addClass('menuitem'+value.post_id);
                        returnObjectListItem.append(returnObjectListItemAnchor);

                        returnObjectList.append(returnObjectListItem);
                    });

                    $('.sideBar').append(returnObjectList);

                };

                // Hack Side Menu 
                buildManagement = $('.menuitem43').find('a');
                buildManagement.html('Building <br/> Management');
                coop = $('.menuitem57').find('a');
                coop.html('Commercial -<br />Co-op/Condo Sales');
                retail = $('.menuitem59').find('a');
                retail.html('Retail/Hospitality -<br />Leasing & Sales');

                $('.inner-link').on('click', function(e) {
                    e.preventDefault();
                    if (!$(this).parent().hasClass('hyperlink')) {
                        postIDrequest = $(this).data('postid');
                        pushPageNav('services', postIDrequest);
                    } else {
                        window.open($(this).attr('href'), '_blank');
                    }
                });

                changePage("in");

            }

            break;

        case "team":
            returnPageData(pageID).done(function(data) {
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
                        // add s to principal
                        if (value.the_title.toLowerCase().indexOf('principal') != -1) {
                            returnObjectPosition.html('Principals');
                        } else {
                            returnObjectPosition.html(_.unescape(value.the_title));
                        }
                        returnObjectPosition.attr('data-toggle', value.post_id)
                        // members
                        returnObjectMembers.attr('data-panel', value.post_id);
                        returnObjectMembers.addClass('panel');

                        returnObject.find('.team-position').append(returnObjectPosition);
                        returnObject.find('.team-members').append(returnObjectMembers);

                        // 	// If we have people
                        if (!_.isEmpty(json_people_data)) {

                            returnAllMembers = $('<ul />');

                            _.each(json_people_data, function(val, k) {
                                if (value.post_id == val.position_type) {
                                    returnSingleMember = $('<li />');
                                    returnSingleMemberAnchor = $('<a href="#" />');
                                    returnSingleMemberExtra = $('<div />');

                                    returnSingleMember.addClass(val.the_title.toLowerCase().replace(/.\ /g, '-'));

                                    returnSingleMemberAnchor.data('member', val.post_id);
                                    returnSingleMemberAnchor.addClass('member-link');
                                    returnSingleMemberAnchor.html(_.unescape(val.the_title));

                                    //titles for principals
                                    if (value.the_title.toLowerCase().indexOf('principal') != -1) {
                                        returnSingleMemberExtra.append(_.unescape(value.the_title))
                                        if (val.title) {
                                            returnSingleMemberExtra.append('/' + val.title);
                                        }
                                    } else if (value.the_title.toLowerCase().indexOf('senior') != -1) {
                                        //titles for senior
                                        returnSingleMemberExtra.append(_.unescape(val.title))
                                    }

                                    
                                    

                                    returnSingleMember.append(returnSingleMemberAnchor);
                                    returnSingleMember.append(returnSingleMemberExtra);

                                    returnAllMembers.append(returnSingleMember);

                                    returnObject.find('div[data-panel="' + val.position_type + '"]').append(returnAllMembers);
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

                                    // if (val.attachments != null) {
                                    //     _.each(val.attachments, function(o, p) {
                                    //         returnObjectMember.find('.photo').append('<img src="' + o.full + '" alt="" />')
                                    //     });
                                    // }
                                    if (val.featuredImage != "") {
                                        returnObjectMember.find('.photo').append('<img src="' + val.featuredImage + '" alt="" />')
                                    }
                                    returnObjectMember.attr('data-memberid', val.post_id);
                                    returnObjectMember.find('.name').append(_.unescape(val.first_name + ' ' + val.last_name));
                                    
                                    // Remove positions from Leasing & Sales
                                    if (value.the_title.toLowerCase().indexOf('sales') == -1) {
                                        // show positions only on principal
                                        if (value.the_title.toLowerCase().indexOf('principal') != -1) {
                                            if (val.title != "") {
                                                returnObjectMember.find('.title').append(_.unescape(value.the_title) + "/" + val.title);
                                            } else {
                                                returnObjectMember.find('.title').append(_.unescape(value.the_title));
                                            }
                                        } else {
                                            returnObjectMember.find('.title').append(_.unescape(val.title));
                                        }
                                    } else {
                                        returnObjectMember.find('.title').remove();
                                    }

                                    // Hide email and phone on Senior Management
                                    // if (value.the_title.toLowerCase().indexOf('senior') == -1) {
                                        if (val.email != '') {
                                            returnObjectMember.find('.email-phone a').attr('href', 'mailto:' + val.email).append(val.email);
                                            if (val.phone) {
                                                returnObjectMember.find('.email-phone').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + val.phone);
                                            }
                                        }
                                    // }
                                    returnObjectMember.find('.bio').append(_.unescape(val.the_content));


                                    returnObject.find('.all-members').find('div[data-panel="' + val.position_type + '"]').append(returnObjectMember);
                                }
                            });
                        }
                    });

                    // Append to page
                    $('section').find('.content-entry').parent().html(returnObject);
                    appendPageTitle(pageID, $('section').find('.pageInfo'));

                    // Add active state to fist item
                    $('.team-position').find('a:first-child').addClass('active');

                    // JUMP TO MEMBER
                    $('.team-members').on('click', 'a', function(e) {
                        e.preventDefault()

                        thisMember = $(this).data('member');

                        $('html,body').animate({
                            scrollTop: $('div[data-memberid="' + thisMember + '"]').offset().top,
            //                 scrollTop: 500,
                        }, 750, function() {
                            $('div[data-memberid="' + thisMember + '"]').find('.scrollArrow').fadeIn();
                        });
                    });

                    // Scroll to top
                    $('.scrollArrow').on('click', function(e) {
                        e.preventDefault();

                        $(this).hide();
                        $('html,body').animate({scrollTop: 0});
                    });

                    // TOGGLE FUNCTION
                    $('.team-position').on('click', 'a', function(e) {
                        e.preventDefault();
                        currentPanel = $(this).data('toggle');

                        $('.team-position a').removeClass('active');
                        $(this).addClass('active');

                        $('.panel').animate({
                            opacity: 0
                        }, 500, function() {
                            $('.panel').css('display', 'none');
                            $('div[data-panel="' + currentPanel + '"]').css('display', 'block').animate({
                                opacity: 1
                            });
                        });

                    });

                }

                changePage("in");
            });
            break;

        default:
            returnPageData(pageID).done(function(data) {
                $('section').html(php_page_inner);
                $('section').find('.content-entry').html(_.unescape(data));
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

function searchProperties(searchData) {
    $('.content-entry').html('');
    $('.content-entry').html(php_page_search);

    searchableProperties = [];
    _.each(searchData, function(value, key) {
        searchableProperties.push(value.post_id);
    });

    _.each(searchData, function(value, key) {
        returnSearchResults = $(php_output_search_results);
        addressInt = parseInt(value.address);

        // link to property
        returnSearchResults.find('.inner-link').attr('href', value.address);
        returnSearchResults.find('.inner-link').data('postid', value.address);
        // Populate rows
        returnSearchResults.find('.floor_proper').find('.inner-link').append(value.floor_proper);
        returnSearchResults.find('.sqfeet').find('.inner-link').append(value.sqfeet);
        returnSearchResults.find('.rent').find('.inner-link').append(value.rent);
        returnSearchResults.find('.the_content').find('.inner-link').append(_.unescape(value.the_content));

        _.each(json_properties_data, function(val, k) {
            // replace address id with actual address
            if (val.post_id == addressInt) {
                returnSearchResults.find('.address').find('.inner-link').append(val.address);

                // thumb
                _.each(val.attachments, function(l, m) {
                    returnSearchResults.find('.thumb .inner-link').find('img').attr('src', l.thumb);
                });
            }
        });

        // Attachments
        console.log(value.attachments)
        if (value.attachments != null) {
            _.each(value.attachments, function(n, o) {
                returnSearchResults.find('.attachments a').attr('href', n.full);
                returnSearchResults.find('.attachments a').html('Download');
            });
        } else {
            returnSearchResults.find('.attachments a').remove();
        }

        // Floor Type
        _.each(json_floor_types_data, function(val, k) {
            _.each(value.floor_type, function(valType) {
                if(val.post_id == valType) {
                    returnSearchResults.find('.floor_type').find('.inner-link').html(val.the_title);
                }
            });
        });

        $('.content-entry').find('tbody').append(returnSearchResults);

        // stripe table
        $("tr:even").addClass("even");
    });

    $('.inner-link').on('click', function(e) {
        e.preventDefault();
        if (!$(this).parent().hasClass('hyperlink')) {
            postIDrequest = $(this).data('postid');
            pushPageNav('listings', postIDrequest);
        } else {
            window.open($(this).attr('href'), '_blank');
        }
    });
    
}

function resetSearchResults() {
    $('.content-entry').html('');
    _.each(json_properties_types_data, function(value, key) {
        returnObjectPropertyTypes = $('<div class="properties-group" />');
        returnPropertyTitle = $('<h2 />');

        returnObjectPropertyTypes.attr('data-postid', value.post_id);
        returnObjectPropertyTypes.addClass(slugify(value.the_title));
        returnPropertyTitle.append(_.unescape(value.the_title))

        returnObjectPropertyTypes.html(returnPropertyTitle);

        $('.content-entry').append(returnObjectPropertyTypes);

        if (!_.isEmpty(json_properties_data)) {

            // sort properties by address
            // json_properties_data = _.sortBy(json_properties_data, function(sjpd) {
            //     return sjpd.post_id;
            // });

            // Loop properties
            _.each(json_properties_data, function(val, ky) {
                returnObject = $(php_output_property);

                returnObject.data('postid', val.post_id);
                returnObject.find('.property-title h3').append(val.the_title);
                returnObject.find('.dimensions').append(val.sqfeet);
                returnObject.find('.inner-link').attr('href', val.post_id);
                returnObject.find('.inner-link').attr('data-postid', val.post_id);

                // Get attachments
                if (val.attachments != null) {
                    _.each(val.attachments, function(v, k) {
                        returnObject.find('.property-photo img').attr('src', v.thumb);
                    });
                }

                // append in the appropriate property type
                if (val.type == value.post_id) {
                    $('.content-entry').find('div[data-postid="' + val.type + '"]').append(returnObject);
                }

                // Remove links from management
                $('.content-entry').find('div[data-postid="152"]').find('.inner-link').remove();
            })
        }
    });
}

function cleanUpNumbers(dirtyNumber) {

    dirtyNumber = dirtyNumber.replace(/[ ]*,[ ]*|[ ]+/g, '');

    dirtyNumber = parseInt(dirtyNumber);

    return dirtyNumber;
}

function colorCurrentMenu() {
    $('.menu-main-menu-container, .sideNav').find('a').each(function() {
        if ($(this).attr('href').indexOf(pageID) >= 0) {
            $(this).addClass('currentPage');
        } else {
            $(this).removeClass('currentPage');
        }
    });

    // Fix About Link Active State
    if ( pageID == "team" || pageID == "our-story" ) {
        $('.menu-main-menu-container li:first-child').find('a').addClass('currentPage');
    }
}

function searchResults(dataSource, view, target, searchInput, returnFunction, searchType) {
    // based on presumption first dataSource object has all key values
    // exact match search
    searchInput.on('keyup', function() {
        searchArray = searchInput.val().toLowerCase().split(" ");
        resultArray = [];
        _.each(searchArray, function(value0, index0) {
            _.each(Object.keys(dataSource[0]), function(value, index) {
                results = _.filter(dataSource, function(results, second, third) {
                    if (typeof results[value] === "string") {
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
    switch (searchType) {
        case defaultPage:
            returnString = $('<table class="searchResult" />');
            _.each(searchData, function(value, index) {
                viewObject = $(view);
                _.each(value, function(value1, index1) {
                    switch (index1) {
                        default: searchObject = $("<tr class='viewRow' />");
                        searchObject.append("<td class='key'>" + index1 + "</td>");
                        if (_.unescape(value1) !== "[object Object]") {
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
function changePage(transition) {
    colorCurrentMenu();
    animationTarget = getAnimationTarget('in');
    switch (transition) {
        case "in":
            animationTarget.animate({
                opacity: 1,
            }, 200, function() {
                $('html,body').animate({
                    scrollTop: 0
                }, 0, function() {
                    $('section').animate({
                        opacity: 1
                    }, 0);
                });
            });
            break;
    }
}

function getAnimationTarget(transition) {
    switch (transition) {
        case 'in':
            pageIDfound = false;
            $('.sideNav').find('a').each(function() {
                if (pageID == $(this).data('pageid')) {
                    pageIDfound = true;
                }
            });
            if (pageIDfound) {
                animationTarget = $('.mainContent');
                if (previousPage == "home") {
                    animationTarget = $('section');
                }
            } else {
                animationTarget = $('section');
            }
            break;

        case 'out':
            pageIDfound = false;
            $('.sideNav').find('a').each(function() {
                if (pageID == $(this).data('pageid')) {
                    pageIDfound = true;
                }
            });
            if (pageIDfound) {
                animationTarget = $('.mainContent');
            } else {
                animationTarget = $('section');
            }
            break
    }
    return animationTarget;
}



// ON DOCUMENT READY
$(document).ready(function() {

    setIeDocument();

    if (typeof $('body').data('tempdir') === "undefined") {
        pageDir = defaultPageDir;
    } else {
        pageDir = $('body').data('tempdir');
    }
    loadFilesToVariables(filesToVariablesArray);

    $('.rebny span').on('mouseover', function() {
        thisClass = $(this).attr('class');

        $('.rebny').find('div[id='+thisClass+']').fadeIn();
    });

    $('.rebny span').on('mouseout', function() {
        thisClass = $(this).attr('class');

        $('.rebny').find('div').hide();
    });

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
// function loadFilesToVariables(fileArray, ignoreStartUp) {
//     fileKey = Object.keys(fileArray[0]);
//     fileValue = "/" + fileArray[0][Object.keys(fileArray[0])];
//     fileType = fileValue.split(".").slice(-1)[0];
//     switch (fileType) {
//         case "json":
//             pageData = $.getJSON(pageDir + fileValue + urlQueryString, function() {});
//             break;

//         case "html":
//             pageData = $.get(pageDir + fileValue + urlQueryString, function() {});
//             break;

//         case "php":
//             pageData = $.get(pageDir + fileValue + urlQueryString, function() {});
//             break;
//     }
//     pageData.done(function(data) {
//         window[fileType + "_" + fileKey] = data;
//         if (fileArray.length > 1) {
//             fileArray.shift();
//             loadFilesToVariables(fileArray);
//         } else {
//             if (!ignoreStartUp) {
//                 startUp();
//             }
//         }
//     });
// }

var orig = filesToVariablesArray.length;
var reps = 0;
var repTracker = 1;

function loadFilesToVariables(fileArray, ignoreStartUp) {
    fileTracker = {};
    _.each(fileArray, function(value, index) {
        fileKey = Object.keys(fileArray[index]);
        fileValue = "/" + fileArray[index][Object.keys(fileArray[index])];
        fileType = fileValue.split(".").slice(-1)[0];
        fileTracker[fileKey] = {};
        fileTracker[fileKey]['fileType'] = fileType;
        fileTracker[fileKey]['fileKey'] = fileKey;

        switch (fileType) {
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

        fileTracker[fileKey]['pageData'].complete(function(data) {
            thisURL = this.url.replace(defaultPageDir + "/", '');
            thisURL = thisURL.split("?");
            thisURL = thisURL[0];
            _.each(filesToVariablesArray, function(value1, index1) {
                if (filesToVariablesArray[index1][Object.keys(filesToVariablesArray[index1])] == thisURL) {
                    window[thisURL.split(".")[1] + "_" + Object.keys(filesToVariablesArray[index1])] = data.responseText;
                    fileLoaded();
                }
            });
        });
    });
}

function fileLoaded() {
    repTracker++;
    loaderVal = 50 + (reps * repTracker);
    if (pageID != "admin") {
        // document.getElementById('loader').style.width = loaderVal + '%';
        if (repTracker == orig) {
            $('#loader').fadeOut();
            startUp();
        }
    } else {
        if (repTracker == orig) {
            startUp();
        }
    }
}

// START UP FUNCTION
function startUp() {
    setPageID(RewriteBase);
    if (pageID == "admin") {
        loadDatePicker($('.date'));
        loadSortable($(".sortable"));
        if ($('#people_sample_hidden_meta').size() != 0) {
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
        $('#menu-main-menu-1').easyListSplitter({
            colNumber: 2
        });

        loadView(pageID, postID);

        startUpRan = true;


    }
}

// FIX MENU LINKS
function fixLinks() {
    $('#menu-main-menu, .helperLinks, .infoBlock, .sideNav, .footerNav').find('a').each(function() {
        if (!($(this).parent().hasClass('hyperlink') || $(this).hasClass('hyperlink'))) {
            pageSlug = $(this).html().replace('&amp;', '')

            //fix about us link

            pageSlug = (slugify(pageSlug) == 'about-us') ? 'overview' : pageSlug;

            // Fix services
            if (slugify(pageSlug) == 'services') {
                if (!_.isEmpty(json_services_data)) {
                    $(this).attr('href', prependUrl + slugify(pageSlug) + "/" + slugify(json_services_data[0].the_title));
                    $(this).data('pageid', slugify(pageSlug));
                    $(this).data('postid', slugify(json_services_data[0].the_title));
                }
            } else {
                $(this).attr('href', prependUrl + slugify(pageSlug) + "/");
                $(this).data('pageid', slugify(pageSlug));
            }


            // Fix Services link 	
            // servicesSlug = _.first(json_services_data);
            // $('#menu-main-menu').find('.item2 a').attr('href', prependUrl + 'services/' + slugify(servicesSlug.the_title));
            // $('#menu-main-menu').find('.item2 a').data('pageid', slugify(servicesSlug.the_title));
        }
    });
}

// BUILD SIDE BAR
function buildSideMenu(target) {
    $('#menu-main-menu').find('li').each(function() {
        if (pageID == $(this).children('a').data('pageid')) {
            if (typeof $(this).parents('.menu-item-object-page').html() !== "undefined") {
                if ($(this).parents('.menu-item-object-page').size() > 1) {
                    menuObject = $(this).parents('.menu-item-object-page').eq(1).clone();
                } else {
                    menuObject = $(this).parents('.menu-item-object-page').clone();
                }
            } else {
                menuObject = $(this).clone();
            }
        }
    });
    if (typeof menuObject !== "undefined") {
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
function setPageID(pagePath, postIDpath) {
    if ($('body').hasClass("wp-admin")) {
        pageID = "admin";
    } else {
        pageIDFound = false;
        urlArray = window.location.pathname.replace(pagePath, '');
        urlArray = urlArray.split("/");
        if (urlArray[urlArray.length - 1] == "") {
            urlArray.pop();
        }
        // first array item must be pageID
        if (typeof urlArray[0] === "undefined") {
            pageIDFound = true;
            pageID = defaultPage;
        } else {
            _.each(json_pages, function(value, index) {
                if (value.pageID == urlArray[0]) {
                    pageIDFound = true;
                    pageID = value.pageID;
                }
            });
        }
        if (!pageIDFound) {
            if (!ajaxer) {
                execute404();
            }
        } else {
            // second array item must be itemID
            if (urlArray.length == 2) {
                switch (urlArray[0]) {
                    case "recent-news":
                        _.each(json_news_data, function(value, index) {
                            if (value.post_id == urlArray[1]) {
                                postIDFound = true;
                                postID = value.post_id;
                            }
                        });
                        break;

                    case "services":
                        postIDFound = true;
                        postID = urlArray[1];
                        break;

                    case "listings":
                        postIDFound = true;
                        postID = urlArray[1];
                        break;
                }
            } else {
                postID = "";
            }
            if (typeof postIDpath !== "undefined") {
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
function execute404() {
    $('section').html("<h1>This page was not found, you are being redirect to the home page</h1>");
    window.location = pathPrefix + defaultPage;
}

// LOAD JQUERY UI DATE PICKER
function loadDatePicker(target, changeCallback) {
    hiddenDate = target.siblings('input');
    target.datetimepicker();
    if (hiddenDate.val() == "") {
        var myDate = new Date();
        var prettyDate = (myDate.getMonth() + 1) + '/' + myDate.getDate() + '/' + myDate.getFullYear() + " " + myDate.getHours() + ":" + myDate.getMinutes();
        target.val(prettyDate);
        hiddenDate.val(Date.parse(prettyDate) / 1000);
    }
    target.change(function() {
        $(this).siblings('input').val(Date.parse($(this).val()) / 1000);
        dateArray = [{
            event_start: $('input[name="event_start"]').val(),
            event_end: $('input[name="event_end"]').val()
        }];
        $('#event_date_array_meta').find('.hidden_meta').val(JSON.stringify(dateArray));
        if (changeCallback) {
            updateRepeatConfig();
        }
    });
}

// LOAD JQUERY UI SORTABLE
function loadSortable(target) {
    target.sortable();
    target.disableSelection();
    target.on("sortstop", function(event, ui) {
        sortData = {};
        $(this).children('li').each(function() {
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
function returnPrependUrl() {
    pageLevel = window.location.pathname.replace(RewriteBase, "").split("/");
    if (pageLevel[pageLevel.length - 1] == "") {
        pageLevel.pop();
    }
    prependUrl = "";
    for (var i = 0; i < pageLevel.length; i++) {
        prependUrl += "../";
    };
    return prependUrl;
}

// TURN SLUG INTO STRING
function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\+/g, '') // Replace spaces with 
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

// APPEND PAGE TITLE
function appendPageTitle(pageRequest, target) {
    _.each(json_pages, function(value, index) {
        if (value.pageID == pageRequest) {
            target.prepend("<h2>" + value.pageTitle + "</h2>");
        }
    });
}

// RETURN PAGE DATA
function returnPageData(pageRequest) {
    $.each(json_pages, function(index, value) {
        if (pageRequest == value.pageID) {
            returnedPageData = $.post(pageDir + "/machines/handlers/loadPage.php", {
                pageID: value.wp_page_id
            }, function() {});
        }
    });
    return returnedPageData;
}


// LOAD EVENTS
function loadEvents(eventRequest, params) {
    switch (eventRequest) {

        case "menuClicker":
            $('.menu-main-menu-container').on('click', 'a', function(e) {
                e.preventDefault();
                if (!$(this).parent().hasClass('hyperlink')) {
                    pageIDrequest = $(this).data('pageid');

                    if (_.isUndefined($(this).data('postid'))) {
                        pushPageNav(pageIDrequest);
                    } else {
                        pushPageNav(pageIDrequest, $(this).data('postid'));
                    }

                } else {
                    window.open($(this).attr('href'), '_blank');
                }
            }); 

            break;

        case "extraMenu":

            $('.side-menu').on('click', 'a', function(e) {
                e.preventDefault();

                if (!$(this).hasClass('hyperlink')) {
                    pageIDrequest = cleanPageState($(this).attr('href'));
                    pushPageNav(pageIDrequest);
                } else {
                    window.open($(this).attr('href'), '_blank');
                }
            });
            break;

        case "footerClicker":
            $('footer').on('click', 'a', function(e) {
                e.preventDefault();
                if (!$(this).hasClass('hyperlink')) {
                    pageIDrequest = cleanPageState($(this).attr('href'));
                    pushPageNav(pageIDrequest);
                } else {
                    window.open($(this).attr('href'), '_blank');
                }
            });
            break;

        case "sideMenuClicker":
            $('.sideNav').on('click', 'a', function(e) {
                e.preventDefault();
                if (!$(this).parent().hasClass('hyperlink')) {
                    pageIDrequest = $(this).data('pageid');
                    pushPageNav(pageIDrequest);
                } else {
                    window.open($(this).attr('href'), '_blank');
                }
            });
            break;

        case "logoClicker":
            $('.logo').on('click', 'a', function(e) {
                e.preventDefault();
                pushPageNav(defaultPage);
            });
            break;

        case "linkClicker":
            $('.link').on('click', function(e) {
                e.preventDefault();
                pageIDrequest = cleanPageState($(this).attr('href'));
                pushPageNav(pageIDrequest);
            });
            break;

        case "subNavClicker":
            $('.subNav').on('click', 'a', function(e) {
                e.preventDefault();
                if (!$(this).hasClass('hyperlink')) {
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
function pushPageNav(pageIDrequest, postID) {
    if (typeof postID === "undefined") {
        postIDurl = "";
    } else {
        postIDurl = postID + "/";
    }
    if (Modernizr.history) {
        animationTarget = getAnimationTarget('out');
        animationTarget.animate({
            opacity: 0,
        }, 200, function() {
            pageLevel = window.location.pathname.replace(RewriteBase, "").split("/");
            prependPushStateUrl = returnPrependUrl()
            if ((window.location.pathname.charAt(window.location.pathname.length - 1) == "/") && (window.location.pathname != RewriteBase)) {
                newPage = prependPushStateUrl + pageIDrequest + "/" + postIDurl;
            } else {
                newPage = prependPushStateUrl + pageIDrequest + "/" + postIDurl;
            }
            var stateObj = {
                pageID: newPage
            };
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
$(window).on('popstate', function() {
    if (startUpRan) {
        previousPage = pageID;
        animationTarget = getAnimationTarget('out');
        if (history.state != null) {
            animationTarget.animate({
                opacity: 0,
            }, 200, function() {
                setPageID(RewriteBase, history.state.pageID);
                loadView(cleanPageState(history.state.pageID), postID);
            });
        } else {
            loadPage = cleanPageState(window.location.pathname.replace(RewriteBase, ""));

            postIDtest = window.location.pathname.split("/");
            if (postIDtest[postIDtest.length - 1] == "") {
                postIDtest.pop();
            }
            if ($.isNumeric(postIDtest[postIDtest.length - 1])) {
                postID = postIDtest[postIDtest.length - 1];
            }

            if (loadPage == "") {
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
function cleanPageState(historyState) {
    postIDtest = historyState.split("/");
    if (postIDtest[postIDtest.length - 1] == "") {
        postIDtest.pop();
    }
    if ($.isNumeric(postIDtest[postIDtest.length - 1])) {
        postIDtest.pop();
        historyState = postIDtest.join("/");
    }
    historyState = historyState.replace("../", "");
    historyState = historyState.replace("/", "");
    historyState = historyState.replace(/\.\.+/g, '');
    historyState = historyState.replace(/\/+/g, '');
    return historyState;
}

// PARSE URL VARIABLES
function getUrlVars() {
    var vars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function setSlider(target, value) {
    target.slider("value", value);
    target.siblings('.amount').html(value);
}


// CHECK FOR IE VERSIONS
function getIEVersion(){
    var agent = navigator.userAgent;
    var reg = /MSIE\s?(\d+)(?:\.(\d+))?/i;
    var matches = agent.match(reg);
    if (navigator !== null || navigator !== "" || navigator !== "undefined") {
        if (matches !== null) {
            return { major: matches[1], minor: matches[2] };
        }
    }

    if (navigator !== null || navigator !== "" || navigator !== "undefined") {
        return { major: "-1", minor: "-1" };
    }
}

// SET HTML FOR IE
function setIeDocument() {
    ieVersion = getIEVersion();

    switch(ieVersion.major) {
        case '10':
            $('html').addClass('ie-' + ieVersion.major);
        break;

        case '9':
            $('html').addClass('ie-' + ieVersion.major);
        break;

        case '8':
            $('html').addClass('ie-' + ieVersion.major);
        break;
    }
}
//})(jQuery, );