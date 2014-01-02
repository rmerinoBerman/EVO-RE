<?php

// REGISTER CUSTOM POST TYPE
	add_action( 'init', 'register_post_type_properties_types');
	function register_post_type_properties_types(){

		$labels = array(
			'name' => 'Properties types',
			'singular_name' => 'Property type',
			'add_new' => 'Add New',
			'add_new_item' => 'Add New Property type',
			'edit_item' => 'Edit Property type',
			'new_item' => 'New Property type',
			'view_item' => 'View Property type',
			'search_items' => 'Search Properties types',
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

		register_post_type( 'properties_types', $args);

	}

// DEFINE META BOXES
	$properties_typesMetaBoxArray = array();

// ADD META BOXES
	add_action( "admin_init", "admin_init_properties_types" );
	function admin_init_properties_types(){
		global $properties_typesMetaBoxArray;
		generateMetaBoxes($properties_typesMetaBoxArray);
	}

// SAVE POST TO DATABASE
	add_action('save_post', 'save_properties_types');
	function save_properties_types(){
		global $properties_typesMetaBoxArray;
		savePostData($properties_typesMetaBoxArray, $post, $wpdb);
	}

// SORTING CUSTOM SUBMENU

	add_action('admin_menu', 'register_sortable_properties_types_submenu');

	function register_sortable_properties_types_submenu() {
		add_submenu_page('edit.php?post_type=properties_types', 'Sort Properties_types', 'Sort', 'edit_pages', 'properties_types_sort', 'sort_properties_types');
	}

	function sort_properties_types() {
		
		echo '<div class="wrap"><div id="icon-tools" class="icon32"></div>';
			echo '<h2>Sort Properties_types</h2>';
		echo '</div>';

		listProperties_types('sort');
	}

// CUSTOM COLUMNS

	// add_action("manage_posts_custom_column",  "properties_types_custom_columns");
	// add_filter("manage_edit-properties_types_columns", "properties_types_edit_columns");

	// function properties_types_edit_columns($columns){
	// 	$columns = array(
	// 		"full_name" => "Property_type Name",
	// 	);

	// 	return $columns;
	// }
	// function properties_types_custom_columns($column){
	// 	global $post;

	// 	switch ($column) {
	// 		case "full_name":
	// 			$custom = get_post_custom();
	// 			echo "<a href='post.php?post=" . $post->ID . "&action=edit'>" . $custom["first_name"][0] . " " . $custom["last_name"][0] . "</a>";
	// 		break;
	// 	}
	// }

// LISTING FUNCTION
	function listProperties_types($context, $idArray = null){
		global $post;
		global $properties_typesMetaBoxArray;
		
		switch ($context) {
			case 'sort':
				$args = array(
					'post_type'  => 'properties_types',
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
					'post_type'  => 'properties_types',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);
				returnData($args, $properties_typesMetaBoxArray, 'json', 'properties_types_data');
			break;

			case 'array':
				$args = array(
					'post_type'  => 'properties_types',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);
				return returnData($args, $properties_typesMetaBoxArray, 'array');
			break;

			case 'rest':
				$args = array(
					'post_type'  => 'properties_types',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true,
					'post__in' => $idArray
				);
				return returnData($args, $properties_typesMetaBoxArray, 'array');
			break;

			case 'checkbox':
				$args = array(
					'post_type'  => 'properties_types',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);

				$outputArray = returnData($args, $properties_typesMetaBoxArray, 'array');

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
					'post_type'  => 'properties_types',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);

				$outputArray = returnData($args, $properties_typesMetaBoxArray, 'array');

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
