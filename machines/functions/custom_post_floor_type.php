<?php

// REGISTER CUSTOM POST TYPE
	add_action( 'init', 'register_post_type_floor_types');
	function register_post_type_floor_types(){

		$labels = array(
			'name' => 'Floor Types',
			'singular_name' => 'Floor Type',
			'add_new' => 'Add New',
			'add_new_item' => 'Add New Floor Type',
			'edit_item' => 'Edit Floor_Type',
			'new_item' => 'New Floor_Type',
			'view_item' => 'View Floor_Type',
			'search_items' => 'Search Floor Types',
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

		register_post_type( 'floor_types', $args);

	}

// DEFINE META BOXES
	$floor_typesMetaBoxArray = array();

// ADD META BOXES
	add_action( "admin_init", "admin_init_floor_types" );
	function admin_init_floor_types(){
		global $floor_typesMetaBoxArray;
		generateMetaBoxes($floor_typesMetaBoxArray);
	}

// SAVE POST TO DATABASE
	add_action('save_post', 'save_floor_types');
	function save_floor_types(){
		global $floor_typesMetaBoxArray;
		savePostData($floor_typesMetaBoxArray, $post, $wpdb);
	}

// SORTING CUSTOM SUBMENU

	add_action('admin_menu', 'register_sortable_floor_types_submenu');

	function register_sortable_floor_types_submenu() {
		add_submenu_page('edit.php?post_type=floor_types', 'Sort Floor Types', 'Sort', 'edit_pages', 'floor_types_sort', 'sort_floor_types');
	}

	function sort_floor_types() {
		
		echo '<div class="wrap"><div id="icon-tools" class="icon32"></div>';
			echo '<h2>Sort Floor Types</h2>';
		echo '</div>';

		listFloor_Types('sort');
	}

// CUSTOM COLUMNS

	// add_action("manage_posts_custom_column",  "floor_types_custom_columns");
	// add_filter("manage_edit-floor_types_columns", "floor_types_edit_columns");

	// function floor_types_edit_columns($columns){
	// 	$columns = array(
	// 		"full_name" => "Floor_Type Name",
	// 	);

	// 	return $columns;
	// }
	// function floor_types_custom_columns($column){
	// 	global $post;

	// 	switch ($column) {
	// 		case "full_name":
	// 			$custom = get_post_custom();
	// 			echo "<a href='post.php?post=" . $post->ID . "&action=edit'>" . $custom["first_name"][0] . " " . $custom["last_name"][0] . "</a>";
	// 		break;
	// 	}
	// }

// LISTING FUNCTION
	function listFloor_Types($context, $idArray = null){
		global $post;
		global $floor_typesMetaBoxArray;
		
		switch ($context) {
			case 'sort':
				$args = array(
					'post_type'  => 'floor_types',
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
					'post_type'  => 'floor_types',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);
				returnData($args, $floor_typesMetaBoxArray, 'json', 'floor_types_data');
			break;

			case 'array':
				$args = array(
					'post_type'  => 'floor_types',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);
				return returnData($args, $floor_typesMetaBoxArray, 'array');
			break;

			case 'rest':
				$args = array(
					'post_type'  => 'floor_types',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true,
					'post__in' => $idArray
				);
				return returnData($args, $floor_typesMetaBoxArray, 'array');
			break;

			case 'checkbox':
				$args = array(
					'post_type'  => 'floor_types',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);

				$outputArray = returnData($args, $floor_typesMetaBoxArray, 'array');

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
					'post_type'  => 'floor_types',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);

				$outputArray = returnData($args, $floor_typesMetaBoxArray, 'array');

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
