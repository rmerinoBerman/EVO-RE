<?php

// REGISTER CUSTOM POST TYPE
	add_action( 'init', 'register_post_type_properties');
	function register_post_type_properties(){

		$labels = array(
			'name' => 'Properties',
			'singular_name' => 'Property',
			'add_new' => 'Add New',
			'add_new_item' => 'Add New Property',
			'edit_item' => 'Edit Property',
			'new_item' => 'New Property',
			'view_item' => 'View Property',
			'search_items' => 'Search Properties',
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

		register_post_type( 'properties', $args);

	}

// DEFINE META BOXES
	$propertiesMetaBoxArray = array(
		"properties_type_meta" => array(
	    	"id" => "properties_type_meta",
	        "name" => "Type",
	        "post_type" => "properties",
	        "position" => "side",
	        "priority" => "low",
	        "callback_args" => array(
	        	"input_type" => "input_select",
	        	"input_source" => "listProperties_types",
	        	"input_name" => "type"
	        )
	    ),
	    "properties_address_meta" => array(
	    	"id" => "properties_address_meta",
	        "name" => "Address",
	        "post_type" => "properties",
	        "position" => "side",
	        "priority" => "low",
	        "callback_args" => array(
	        	"input_type" => "input_text",
	        	"input_name" => "address"
	        )
	    ),
	    "properties_sqfeet_meta" => array(
	    	"id" => "properties_sqfeet_meta",
	        "name" => "Square Feet",
	        "post_type" => "properties",
	        "position" => "side",
	        "priority" => "low",
	        "callback_args" => array(
	        	"input_type" => "input_text",
	        	"input_name" => "sqfeet"
	        )
	    ),
	    "properties_submarket_meta" => array(
	    	"id" => "properties_submarket_meta",
	        "name" => "Submarket",
	        "post_type" => "properties",
	        "position" => "side",
	        "priority" => "low",
	        "callback_args" => array(
	        	"input_type" => "input_select",
	        	"input_source" => "listSubmarkets",
	        	"input_name" => "submarket"
	        )
	    ),
	    "properties_website_meta" => array(
	    	"id" => "properties_website_meta",
	        "name" => "Website",
	        "post_type" => "properties",
	        "position" => "side",
	        "priority" => "low",
	        "callback_args" => array(
	        	"input_type" => "input_text",
	        	"input_name" => "website"
	        )
	    ),
	);

// ADD META BOXES
	add_action( "admin_init", "admin_init_properties" );
	function admin_init_properties(){
		global $propertiesMetaBoxArray;
		generateMetaBoxes($propertiesMetaBoxArray);
	}

// SAVE POST TO DATABASE
	add_action('save_post', 'save_properties');
	function save_properties(){
		global $propertiesMetaBoxArray;
		savePostData($propertiesMetaBoxArray, $post, $wpdb);
	}

// SORTING CUSTOM SUBMENU

	add_action('admin_menu', 'register_sortable_properties_submenu');

	function register_sortable_properties_submenu() {
		add_submenu_page('edit.php?post_type=properties', 'Sort Properties', 'Sort', 'edit_pages', 'properties_sort', 'sort_properties');
	}

	function sort_properties() {
		
		echo '<div class="wrap"><div id="icon-tools" class="icon32"></div>';
			echo '<h2>Sort Properties</h2>';
		echo '</div>';

		listProperties('sort');
	}

// CUSTOM COLUMNS

	// add_action("manage_posts_custom_column",  "properties_custom_columns");
	// add_filter("manage_edit-properties_columns", "properties_edit_columns");

	// function properties_edit_columns($columns){
	// 	$columns = array(
	// 		"full_name" => "Property Name",
	// 	);

	// 	return $columns;
	// }
	// function properties_custom_columns($column){
	// 	global $post;

	// 	switch ($column) {
	// 		case "full_name":
	// 			$custom = get_post_custom();
	// 			echo "<a href='post.php?post=" . $post->ID . "&action=edit'>" . $custom["first_name"][0] . " " . $custom["last_name"][0] . "</a>";
	// 		break;
	// 	}
	// }

// LISTING FUNCTION
	function listProperties($context, $idArray = null){
		global $post;
		global $propertiesMetaBoxArray;
		
		switch ($context) {
			case 'sort':
				$args = array(
					'post_type'  => 'properties',
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
					'post_type'  => 'properties',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);
				returnData($args, $propertiesMetaBoxArray, 'json', 'properties_data');
			break;

			case 'array':
				$args = array(
					'post_type'  => 'properties',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);
				return returnData($args, $propertiesMetaBoxArray, 'array');
			break;

			case 'rest':
				$args = array(
					'post_type'  => 'properties',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true,
					'post__in' => $idArray
				);
				return returnData($args, $propertiesMetaBoxArray, 'array');
			break;

			case 'checkbox':
				$args = array(
					'post_type'  => 'properties',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);

				$outputArray = returnData($args, $propertiesMetaBoxArray, 'array');

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
					'post_type'  => 'properties',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);

				$outputArray = returnData($args, $propertiesMetaBoxArray, 'array');

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
