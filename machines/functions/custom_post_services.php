<?php

// REGISTER CUSTOM POST TYPE
	add_action( 'init', 'register_post_type_services');
	function register_post_type_services(){

		$labels = array(
			'name' => 'Services',
			'singular_name' => 'Service',
			'add_new' => 'Add New',
			'add_new_item' => 'Add New Service',
			'edit_item' => 'Edit Service',
			'new_item' => 'New Service',
			'view_item' => 'View Service',
			'search_items' => 'Search Services',
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

		register_post_type( 'services', $args);

	}

// DEFINE META BOXES
	$servicesMetaBoxArray = array(
	    "services_case_meta" => array(
	    	"id" => "services_case_meta",
	        "name" => "Case Study",
	        "post_type" => "services",
	        "position" => "side",
	        "priority" => "low",
	        "callback_args" => array(
	        	"input_type" => "input_select",
	        	"input_source" => "listCases",
	        	"input_name" => "case_study"
	        )
	    ),
	);

// ADD META BOXES
	add_action( "admin_init", "admin_init_services" );
	function admin_init_services(){
		global $servicesMetaBoxArray;
		generateMetaBoxes($servicesMetaBoxArray);
	}

// SAVE POST TO DATABASE
	add_action('save_post', 'save_services');
	function save_services(){
		global $servicesMetaBoxArray;
		savePostData($servicesMetaBoxArray, $post, $wpdb);
	}

// SORTING CUSTOM SUBMENU

	add_action('admin_menu', 'register_sortable_services_submenu');

	function register_sortable_services_submenu() {
		add_submenu_page('edit.php?post_type=services', 'Sort Services', 'Sort', 'edit_pages', 'services_sort', 'sort_services');
	}

	function sort_services() {
		
		echo '<div class="wrap"><div id="icon-tools" class="icon32"></div>';
			echo '<h2>Sort Services</h2>';
		echo '</div>';

		listServices('sort');
	}

// CUSTOM COLUMNS

	// add_action("manage_posts_custom_column",  "services_custom_columns");
	// add_filter("manage_edit-services_columns", "services_edit_columns");

	// function services_edit_columns($columns){
	// 	$columns = array(
	// 		"full_name" => "Service Name",
	// 	);

	// 	return $columns;
	// }
	// function services_custom_columns($column){
	// 	global $post;

	// 	switch ($column) {
	// 		case "full_name":
	// 			$custom = get_post_custom();
	// 			echo "<a href='post.php?post=" . $post->ID . "&action=edit'>" . $custom["first_name"][0] . " " . $custom["last_name"][0] . "</a>";
	// 		break;
	// 	}
	// }

// LISTING FUNCTION
	function listServices($context, $idArray = null){
		global $post;
		global $servicesMetaBoxArray;
		
		switch ($context) {
			case 'sort':
				$args = array(
					'post_type'  => 'services',
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
					'post_type'  => 'services',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);
				returnData($args, $servicesMetaBoxArray, 'json', 'services_data');
			break;

			case 'array':
				$args = array(
					'post_type'  => 'services',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);
				return returnData($args, $servicesMetaBoxArray, 'array');
			break;

			case 'rest':
				$args = array(
					'post_type'  => 'services',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true,
					'post__in' => $idArray
				);
				return returnData($args, $servicesMetaBoxArray, 'array');
			break;

			case 'checkbox':
				$args = array(
					'post_type'  => 'services',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);

				$outputArray = returnData($args, $servicesMetaBoxArray, 'array');

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
					'post_type'  => 'services',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);

				$outputArray = returnData($args, $servicesMetaBoxArray, 'array');

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
