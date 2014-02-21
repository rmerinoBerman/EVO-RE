<?php

// REGISTER CUSTOM POST TYPE
	add_action( 'init', 'register_post_type_cases');
	function register_post_type_cases(){

		$labels = array(
			'name' => 'Cases',
			'singular_name' => 'Case',
			'add_new' => 'Add New',
			'add_new_item' => 'Add New Case',
			'edit_item' => 'Edit Case',
			'new_item' => 'New Case',
			'view_item' => 'View Case',
			'search_items' => 'Search Cases',
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
			'supports' => array('title', 'editor', 'thumbnail', )
		);

		register_post_type( 'cases', $args);

	}

// DEFINE META BOXES
	$casesMetaBoxArray = array();

// ADD META BOXES
	add_action( "admin_init", "admin_init_cases" );
	function admin_init_cases(){
		global $casesMetaBoxArray;
		generateMetaBoxes($casesMetaBoxArray);
	}

// SAVE POST TO DATABASE
	add_action('save_post', 'save_cases');
	function save_cases(){
		global $casesMetaBoxArray;
		savePostData($casesMetaBoxArray, $post, $wpdb);
	}

// SORTING CUSTOM SUBMENU

	add_action('admin_menu', 'register_sortable_cases_submenu');

	function register_sortable_cases_submenu() {
		add_submenu_page('edit.php?post_type=cases', 'Sort Cases', 'Sort', 'edit_pages', 'cases_sort', 'sort_cases');
	}

	function sort_cases() {
		
		echo '<div class="wrap"><div id="icon-tools" class="icon32"></div>';
			echo '<h2>Sort Cases</h2>';
		echo '</div>';

		listCases('sort');
	}

// CUSTOM COLUMNS

	// add_action("manage_posts_custom_column",  "cases_custom_columns");
	// add_filter("manage_edit-cases_columns", "cases_edit_columns");

	// function cases_edit_columns($columns){
	// 	$columns = array(
	// 		"full_name" => "Case Name",
	// 	);

	// 	return $columns;
	// }
	// function cases_custom_columns($column){
	// 	global $post;

	// 	switch ($column) {
	// 		case "full_name":
	// 			$custom = get_post_custom();
	// 			echo "<a href='post.php?post=" . $post->ID . "&action=edit'>" . $custom["first_name"][0] . " " . $custom["last_name"][0] . "</a>";
	// 		break;
	// 	}
	// }

// LISTING FUNCTION
	function listCases($context, $idArray = null){
		global $post;
		global $casesMetaBoxArray;
		
		switch ($context) {
			case 'sort':
				$args = array(
					'post_type'  => 'cases',
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
					'post_type'  => 'cases',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);
				returnData($args, $casesMetaBoxArray, 'json', 'cases_data');
			break;

			case 'array':
				$args = array(
					'post_type'  => 'cases',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);
				return returnData($args, $casesMetaBoxArray, 'array');
			break;

			case 'rest':
				$args = array(
					'post_type'  => 'cases',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true,
					'post__in' => $idArray
				);
				return returnData($args, $casesMetaBoxArray, 'array');
			break;

			case 'checkbox':
				$args = array(
					'post_type'  => 'cases',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);

				$outputArray = returnData($args, $casesMetaBoxArray, 'array');

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
					'post_type'  => 'cases',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);

				$outputArray = returnData($args, $casesMetaBoxArray, 'array');

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
