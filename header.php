<!doctype html>
<html lang="en">
	<head>
		<meta name="fragment" content="!">
		<meta charset="UTF-8" />
		<title><?php bloginfo( 'title' ) ?></title>
		<?php wp_head(); ?>
		<link rel="stylesheet" href="<?php bloginfo( stylesheet_url ); ?>"/>

<!-- 		
		<link rel="stylesheet" type="text/css" href="<?php echo PAGEDIR; ?>/styles/styles.min.css">
 -->

		<!-- grid css -->
		<link rel="stylesheet" type="text/css" href="<?php echo PAGEDIR; ?>/machines/libraries/magnific/magnific.css">

		<link rel="stylesheet" type="text/less" href="<?php echo PAGEDIR; ?>/styles/styles.less"> 
		<script type="text/javascript" src="<?php echo PAGEDIR; ?>/machines/libraries/lessjs/less-1.4.1.min.js"></script>

		<script type="text/javascript" src="<?php echo PAGEDIR; ?>/machines/libraries/modernizr/modernizr.js"></script>
		<script type="text/javascript" src="<?php echo PAGEDIR; ?>/machines/libraries/backstretch/jquery.backstretch.min.js"></script>
		<script type="text/javascript" src="<?php echo PAGEDIR; ?>/machines/libraries/underscore/underscore-min.js"></script>
		<script type="text/javascript" src="<?php echo PAGEDIR; ?>/machines/libraries/superfish/hoverIntent.js"></script>
		<script type="text/javascript" src="<?php echo PAGEDIR; ?>/machines/libraries/superfish/superfish.js"></script>
		<script type="text/javascript" src="<?php echo PAGEDIR; ?>/machines/libraries/jcarousel/jcarousel.js"></script>
		<script type="text/javascript" src="<?php echo PAGEDIR; ?>/machines/libraries/columnizer/columnizer.js"></script>
		<script type="text/javascript" src="<?php echo PAGEDIR; ?>/machines/libraries/sticky/jquery.sticky.js"></script>
		<script type="text/javascript" src="<?php echo PAGEDIR; ?>/machines/libraries/dotdotdot/dotdotdot.min.js"></script>
		<script src="http://maps.google.com/maps/api/js?sensor=false&libraries=geometry&v=3.7"></script>
		<script type="text/javascript" src="<?php echo PAGEDIR; ?>/machines/libraries/maplace/maplace.min.js"></script>
		<script type="text/javascript" src="<?php echo PAGEDIR; ?>/machines/libraries/magnific/magnific.min.js"></script>
		
	</head>
	<body data-tempdir="<?php echo PAGEDIR; ?>" id="<?php echo get_post( $post )->post_name; ?>">
		<?php
			generatePagesJSON(get_the_ID());
			populateJavascript(get_post_field('post_content', get_the_ID()), 'post');
			listPeople('json');
			listPositions('json');
			listNews('json');
			listServices('json');
			listCases('json');
			listProperties('json');
			listProperties_types('json');
			listFloors('json');
			listFloor_Types('json');
		?>
		<header>
			<div class="container container-twelve">
				<div class="three columns">
					<div class="logo">
						<a href="<?php echo home_url(); ?>">
							<img src="<?php echo PAGEDIR; ?>/images/graphics/evo-logo.jpg" alt="">
						</a>
					</div>
				</div>
				<div class="six columns">
					<?php wp_nav_menu( array( 'theme_location' => 'header-menu' ) ); ?>
				</div>
				<div class="three columns">
					<div class="side-menu">
						<ul>
							<li><a href="#">contact</a></li>
							<li><a href="#">brochure</a></li>
						</ul>
					</div>
				</div>
			</div>
		</header>