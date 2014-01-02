<?php

// REGISTER CUSTOM POST TYPE
	add_action( 'init', 'register_post_type_positions');
	function register_post_type_positions(){

		$labels = array(
			'name' => 'Positions',
			'singular_name' => 'Position',
			'add_new' => 'Add New',
			'add_new_item' => 'Add New Position',
			'edit_item' => 'Edit Position',
			'new_item' => 'New Position',
			'view_item' => 'View Position',
			'search_items' => 'Search Positions',
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

		register_post_type( 'positions', $args);

	}

// DEFINE META BOXES
	$positionsMetaBoxArray = array();

// ADD META BOXES
	add_action( "admin_init", "admin_init_positions" );
	function admin_init_positions(){
		global $positionsMetaBoxArray;
		generateMetaBoxes($positionsMetaBoxArray);
	}

// SAVE POST TO DATABASE
	add_action('save_post', 'save_positions');
	function save_positions(){
		global $positionsMetaBoxArray;
		savePostData($positionsMetaBoxArray, $post, $wpdb);
	}

// SORTING CUSTOM SUBMENU

	add_action('admin_menu', 'register_sortable_positions_submenu');

	function register_sortable_positions_submenu() {
		add_submenu_page('edit.php?post_type=positions', 'Sort Positions', 'Sort', 'edit_pages', 'positions_sort', 'sort_positions');
	}

	function sort_positions() {
		
		echo '<div class="wrap"><div id="icon-tools" class="icon32"></div>';
			echo '<h2>Sort Positions</h2>';
		echo '</div>';

		listPositions('sort');
	}

// CUSTOM COLUMNS

	// add_action("manage_posts_custom_column",  "positions_custom_columns");
	// add_filter("manage_edit-positions_columns", "positions_edit_columns");

	// function positions_edit_columns($columns){
	// 	$columns = array(
	// 		"full_name" => "Position Name",
	// 	);

	// 	return $columns;
	// }
	// function positions_custom_columns($column){
	// 	global $post;

	// 	switch ($column) {
	// 		case "full_name":
	// 			$custom = get_post_custom();
	// 			echo "<a href='post.php?post=" . $post->ID . "&action=edit'>" . $custom["first_name"][0] . " " . $custom["last_name"][0] . "</a>";
	// 		break;
	// 	}
	// }

// LISTING FUNCTION
	function listPositions($context, $idArray = null){
		global $post;
		global $positionsMetaBoxArray;
		
		switch ($context) {
			case 'sort':
				$args = array(
					'post_type'  => 'positions',
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
					'post_type'  => 'positions',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);
				returnData($args, $positionsMetaBoxArray, 'json', 'positions_data');
			break;

			case 'array':
				$args = array(
					'post_type'  => 'positions',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);
				return returnData($args, $positionsMetaBoxArray, 'array');
			break;

			case 'rest':
				$args = array(
					'post_type'  => 'positions',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true,
					'post__in' => $idArray
				);
				return returnData($args, $positionsMetaBoxArray, 'array');
			break;

			case 'checkbox':
				$args = array(
					'post_type'  => 'positions',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);

				$outputArray = returnData($args, $positionsMetaBoxArray, 'array');

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
					'post_type'  => 'positions',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);

				$outputArray = returnData($args, $positionsMetaBoxArray, 'array');

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
