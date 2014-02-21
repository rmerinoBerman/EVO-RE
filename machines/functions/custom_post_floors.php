<?php

// REGISTER CUSTOM POST TYPE
	add_action( 'init', 'register_post_type_floors');
	function register_post_type_floors(){

		$labels = array(
			'name' => 'Floors',
			'singular_name' => 'Floor',
			'add_new' => 'Add New',
			'add_new_item' => 'Add New Floor',
			'edit_item' => 'Edit Floor',
			'new_item' => 'New Floor',
			'view_item' => 'View Floor',
			'search_items' => 'Search Floors',
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

		register_post_type( 'floors', $args);

	}

// DEFINE META BOXES
	$floorsMetaBoxArray = array(
		"floors_floor_proper_meta" => array(
	    	"id" => "floors_floor_proper_meta",
	        "name" => "Floor",
	        "post_type" => "floors",
	        "position" => "side",
	        "priority" => "low",
	        "callback_args" => array(
	        	"input_type" => "input_text",
	        	"input_name" => "floor_proper"
	        )
	    ),
		"floors_address_meta" => array(
	    	"id" => "floors_address_meta",
	        "name" => "Address",
	        "post_type" => "floors",
	        "position" => "side",
	        "priority" => "low",
	        "callback_args" => array(
	        	"input_type" => "input_select",
	        	"input_source" => "listProperties",
	        	"input_name" => "address"
	        )
	    ),
	    "floors_sqfeet_meta" => array(
	    	"id" => "floors_sqfeet_meta",
	        "name" => "Square Feet",
	        "post_type" => "floors",
	        "position" => "side",
	        "priority" => "low",
	        "callback_args" => array(
	        	"input_type" => "input_text",
	        	"input_name" => "sqfeet"
	        )
	    ),
	    "floors_floor_type_meta" => array(
	    	"id" => "floors_floor_type_meta",
	        "name" => "Type",
	        "post_type" => "floors",
	        "position" => "side",
	        "priority" => "low",
	        "callback_args" => array(
	        	"input_type" => "input_checkbox_multi",
	        	"input_source" => "listFloor_Types",
	        	"input_name" => "floor_type"
	        )
	    ),
	    "floors_rent_meta" => array(
	    	"id" => "floors_rent_meta",
	        "name" => "Rent",
	        "post_type" => "floors",
	        "position" => "side",
	        "priority" => "low",
	        "callback_args" => array(
	        	"input_type" => "input_text",
	        	"input_name" => "rent"
	        )
	    ),
	);

// ADD META BOXES
	add_action( "admin_init", "admin_init_floors" );
	function admin_init_floors(){
		global $floorsMetaBoxArray;
		generateMetaBoxes($floorsMetaBoxArray);
	}

// SAVE POST TO DATABASE
	add_action('save_post', 'save_floors');
	function save_floors(){
		global $floorsMetaBoxArray;
		savePostData($floorsMetaBoxArray, $post, $wpdb);
	}

// SORTING CUSTOM SUBMENU

	add_action('admin_menu', 'register_sortable_floors_submenu');

	function register_sortable_floors_submenu() {
		add_submenu_page('edit.php?post_type=floors', 'Sort Floors', 'Sort', 'edit_pages', 'floors_sort', 'sort_floors');
	}

	function sort_floors() {
		
		echo '<div class="wrap"><div id="icon-tools" class="icon32"></div>';
			echo '<h2>Sort Floors</h2>';
		echo '</div>';

		listFloors('sort');
	}

// CUSTOM COLUMNS

	// add_action("manage_posts_custom_column",  "floors_custom_columns");
	// add_filter("manage_edit-floors_columns", "floors_edit_columns");

	// function floors_edit_columns($columns){
	// 	$columns = array(
	// 		"full_name" => "Floor Name",
	// 	);

	// 	return $columns;
	// }
	// function floors_custom_columns($column){
	// 	global $post;

	// 	switch ($column) {
	// 		case "full_name":
	// 			$custom = get_post_custom();
	// 			echo "<a href='post.php?post=" . $post->ID . "&action=edit'>" . $custom["first_name"][0] . " " . $custom["last_name"][0] . "</a>";
	// 		break;
	// 	}
	// }

// LISTING FUNCTION
	function listFloors($context, $idArray = null){
		global $post;
		global $floorsMetaBoxArray;
		
		switch ($context) {
			case 'sort':
				$args = array(
					'post_type'  => 'floors',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);
				$loop = new WP_Query($args);

				echo '<ul class="sortable">';
				while ($loop->have_posts()) : $loop->the_post(); 
					$output = get_the_title( $post->ID );
					// $output = get_post_meta($post->ID, 'first_name', true) . " " . get_post_meta($post->ID, 'last_name', true);
					include(get_template_directory() . '/views/item_sortable.php');
				endwhile;
				echo '</ul>';
			break;
			
			case 'json':
				$args = array(
					'post_type'  => 'floors',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);
				returnData($args, $floorsMetaBoxArray, 'json', 'floors_data');
			break;

			case 'array':
				$args = array(
					'post_type'  => 'floors',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);
				return returnData($args, $floorsMetaBoxArray, 'array');
			break;

			case 'rest':
				$args = array(
					'post_type'  => 'floors',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true,
					'post__in' => $idArray
				);
				return returnData($args, $floorsMetaBoxArray, 'array');
			break;

			case 'checkbox':
				$args = array(
					'post_type'  => 'floors',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);

				$outputArray = returnData($args, $floorsMetaBoxArray, 'array');

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
					'post_type'  => 'floors',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);

				$outputArray = returnData($args, $floorsMetaBoxArray, 'array');

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
