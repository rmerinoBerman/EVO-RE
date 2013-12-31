<?php
/*
 * Template Name: Home
 *
 * 
 *
 */
?>

<?php
	if (strpos($_SERVER["REQUEST_URI"],'_escaped_fragment_') !== false) {
		$ajaxPageID = "";
		$pageURL = str_replace("/", "", $_SERVER["REQUEST_URI"]);
		$pageURL = str_replace("?_escaped_fragment_=", "", $pageURL);
		switch ($pageURL) {
			case "":
				$ajaxPageID = "sample-page";
			break;

			default:
				$pageURLarray = explode("/", $pageURL);
				$ajaxPageID = $pageURLarray[0];
			break;
			
		}
	    include(get_template_directory() . '/_ajax/' . $ajaxPageID . '.html');
	} else {
		get_header(); ?>
			<section></section>			
		<?php get_footer(); 
	}