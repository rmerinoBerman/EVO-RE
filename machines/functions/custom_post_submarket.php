<?php

// REGISTER CUSTOM POST TYPE
	add_action( 'init', 'register_post_type_submarkets');
	function register_post_type_submarkets(){

		$labels = array(
			'name' => 'Submarkets',
			'singular_name' => 'Submarket',
			'add_new' => 'Add New',
			'add_new_item' => 'Add New Submarket',
			'edit_item' => 'Edit Submarket',
			'new_item' => 'New Submarket',
			'view_item' => 'View Submarket',
			'search_items' => 'Search Submarkets',
			'not_found' => 'Nothing found',
			'not_found_in_trash' => 'Nothing found in trash',
			'parent_item_colon' => ''
		);

		$args = array(
			'labels' => $labels,
			'public' => true,
			'publicly_queryable' => true,
			'show_ui' => true,
			'query_var' => true,
			'rewrite' => true,
			'capability_type' => 'post',
			'hierarchical' => false,
			'menu_position' => null,
			'supports' => array('title', 'editor')
		);

		register_post_type( 'submarkets', $args);

	}

// DEFINE META BOXES
	$submarketsMetaBoxArray = array();

// ADD META BOXES
	add_action( "admin_init", "admin_init_submarkets" );
	function admin_init_submarkets(){
		global $submarketsMetaBoxArray;
		generateMetaBoxes($submarketsMetaBoxArray);
	}

// SAVE POST TO DATABASE
	add_action('save_post', 'save_submarkets');
	function save_submarkets(){
		global $submarketsMetaBoxArray;
		savePostData($submarketsMetaBoxArray, $post, $wpdb);
	}

// SORTING CUSTOM SUBMENU

	add_action('admin_menu', 'register_sortable_submarkets_submenu');

	function register_sortable_submarkets_submenu() {
		add_submenu_page('edit.php?post_type=submarkets', 'Sort Submarkets', 'Sort', 'edit_pages', 'submarkets_sort', 'sort_submarkets');
	}

	function sort_submarkets() {
		
		echo '<div class="wrap"><div id="icon-tools" class="icon32"></div>';
			echo '<h2>Sort Submarkets</h2>';
		echo '</div>';

		listSubmarkets('sort');
	}

// CUSTOM COLUMNS

	// add_action("manage_posts_custom_column",  "submarkets_custom_columns");
	// add_filter("manage_edit-submarkets_columns", "submarkets_edit_columns");

	// function submarkets_edit_columns($columns){
	// 	$columns = array(
	// 		"full_name" => "Submarket Name",
	// 	);

	// 	return $columns;
	// }
	// function submarkets_custom_columns($column){
	// 	global $post;

	// 	switch ($column) {
	// 		case "full_name":
	// 			$custom = get_post_custom();
	// 			echo "<a href='post.php?post=" . $post->ID . "&action=edit'>" . $custom["first_name"][0] . " " . $custom["last_name"][0] . "</a>";
	// 		break;
	// 	}
	// }

// LISTING FUNCTION
	function listSubmarkets($context, $idArray = null){
		global $post;
		global $submarketsMetaBoxArray;
		
		switch ($context) {
			case 'sort':
				$args = array(
					'post_type'  => 'submarkets',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);
				$loop = new WP_Query($args);

				echo '<ul class="sortable">';
				while ($loop->have_posts()) : $loop->the_post(); 
					$output = get_post_meta($post->ID, 'first_name', true) . " " . get_post_meta($post->ID, 'last_name', true);
					include(get_template_directory() . '/views/item_sortable.php');
				endwhile;
				echo '</ul>';
			break;
			
			case 'json':
				$args = array(
					'post_type'  => 'submarkets',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);
				returnData($args, $submarketsMetaBoxArray, 'json', 'submarkets_data');
			break;

			case 'array':
				$args = array(
					'post_type'  => 'submarkets',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);
				return returnData($args, $submarketsMetaBoxArray, 'array');
			break;

			case 'rest':
				$args = array(
					'post_type'  => 'submarkets',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true,
					'post__in' => $idArray
				);
				return returnData($args, $submarketsMetaBoxArray, 'array');
			break;

			case 'checkbox':
				$args = array(
					'post_type'  => 'submarkets',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);

				$outputArray = returnData($args, $submarketsMetaBoxArray, 'array');

				$field_options = array();
				foreach ($outputArray as $key => $value) {
					$checkBoxOption = array(
						"id" => $value['post_id'],
						"name" => $value['the_title'],
					);
					$field_options[] = $checkBoxOption;
				}

				return $field_options;

			break;

			case 'select':
				$args = array(
					'post_type'  => 'submarkets',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);

				$outputArray = returnData($args, $submarketsMetaBoxArray, 'array');

				$field_options = array();
				foreach ($outputArray as $key => $value) {
					$checkBoxOption = array(
						"id" => $value['post_id'],
						"name" => html_entity_decode($value['the_title'])
					);
					$field_options[] = $checkBoxOption;
				}

				return $field_options;

			break;
		}
	}

?>
