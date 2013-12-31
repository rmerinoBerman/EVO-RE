<?php

// REGISTER CUSTOM POST TYPE
	add_action( 'init', 'register_post_type_news');
	function register_post_type_news(){

		$labels = array(
			'name' => 'News',
			'singular_name' => 'Story',
			'add_new' => 'Add New',
			'add_new_item' => 'Add New Story',
			'edit_item' => 'Edit Story',
			'new_item' => 'New Story',
			'view_item' => 'View Story',
			'search_items' => 'Search News',
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

		register_post_type( 'news', $args);

	}

// DEFINE META BOXES
	$newsMetaBoxArray = array(
	    "news_sample_text_meta" => array(
	    	"id" => "news_sample_text_meta",
	        "name" => "Sample Text",
	        "post_type" => "news",
	        "position" => "side",
	        "priority" => "low",
	        "callback_args" => array(
	        	"input_type" => "input_text",
	        	"input_name" => "sample_text"
	        )
	    ),
	    "news_sample_date_meta" => array(
	    	"id" => "news_sample_date_meta",
	        "name" => "Sample Date",
	        "post_type" => "news",
	        "position" => "side",
	        "priority" => "low",
	        "callback_args" => array(
	        	"input_type" => "input_date",
	        	"input_name" => "sample_date"
	        )
	    ),
	    "news_sample_color_meta" => array(
	    	"id" => "news_sample_color_meta",
	        "name" => "Sample Color",
	        "post_type" => "news",
	        "position" => "side",
	        "priority" => "low",
	        "callback_args" => array(
	        	"input_type" => "input_colorpicker",
	        	"input_name" => "sample_color",
	        	"input_palette" => array(
	        		'rgb(0, 59, 168);',
	        		'rgb(102, 153, 51);',
					'rgb(53, 109, 211);',
					'rgb(95, 136, 211);',
	        	)
	        )
	    ),
	    "news_sample_editor_meta" => array(
	    	"id" => "news_sample_editor_meta",
	        "name" => "Sample Editor",
	        "post_type" => "news",
	        "position" => "side",
	        "priority" => "low",
	        "callback_args" => array(
	        	"input_type" => "input_editor",
	        	"input_name" => "sample_editor"
	        )
	    ),
	    "news_sample_checkbox_multi_meta" => array(
	    	"id" => "news_sample_checkbox_multi_meta",
	        "name" => "Sample Checkbox Multi",
	        "post_type" => "news",
	        "position" => "side",
	        "priority" => "low",
	        "callback_args" => array(
	        	"input_type" => "input_checkbox_multi",
	        	"input_source" => "listPeople",
	        	"input_name" => "sample_checkbox_multi"
	        )
	    ),
	    "news_sample_select_meta" => array(
	    	"id" => "news_sample_select_meta",
	        "name" => "Sample Select",
	        "post_type" => "news",
	        "position" => "side",
	        "priority" => "low",
	        "callback_args" => array(
	        	"input_type" => "input_select",
	        	"input_source" => "listPeople",
	        	"input_name" => "sample_select"
	        )
	    ),
	    "news_sample_checkbox_single_meta" => array(
	    	"id" => "news_sample_checkbox_single_meta",
	        "name" => "Sample Checkbox Single",
	        "post_type" => "news",
	        "position" => "side",
	        "priority" => "low",
	        "callback_args" => array(
	        	"input_type" => "input_checkbox_single",
	        	"input_name" => "news_sample_checkbox_single",
	        	"input_text" => "Sample Option"
	        )
	    ),
	    "news_sample_hidden_meta" => array(
	    	"id" => "news_sample_hidden_meta",
	        "name" => "Sample Hidden",
	        "post_type" => "news",
	        "position" => "side",
	        "priority" => "low",
	        "callback_args" => array(
	        	"input_type" => "input_hidden",
	        	"input_name" => "news_sample_hidden"
	        )
	    ),


	);

// ADD META BOXES
	add_action( "admin_init", "admin_init_news" );
	function admin_init_news(){
		global $newsMetaBoxArray;
		generateMetaBoxes($newsMetaBoxArray);
	}

// SAVE POST TO DATABASE
	add_action('save_post', 'save_news');
	function save_news(){
		global $newsMetaBoxArray;
		savePostData($newsMetaBoxArray, $post, $wpdb);
	}

// SORTING CUSTOM SUBMENU

	add_action('admin_menu', 'register_sortable_news_submenu');

	function register_sortable_news_submenu() {
		add_submenu_page('edit.php?post_type=news', 'Sort News', 'Sort', 'edit_pages', 'news_sort', 'sort_news');
	}

	function sort_news() {
		
		echo '<div class="wrap"><div id="icon-tools" class="icon32"></div>';
			echo '<h2>Sort News</h2>';
		echo '</div>';

		listNews('sort');
	}

// CUSTOM COLUMNS

	// add_action("manage_posts_custom_column",  "news_custom_columns");
	// add_filter("manage_edit-news_columns", "news_edit_columns");

	// function news_edit_columns($columns){
	// 	$columns = array(
	// 		"full_name" => "Story Name",
	// 	);

	// 	return $columns;
	// }
	// function news_custom_columns($column){
	// 	global $post;

	// 	switch ($column) {
	// 		case "full_name":
	// 			$custom = get_post_custom();
	// 			echo "<a href='post.php?post=" . $post->ID . "&action=edit'>" . $custom["first_name"][0] . " " . $custom["last_name"][0] . "</a>";
	// 		break;
	// 	}
	// }

// LISTING FUNCTION
	function listNews($context, $idArray = null){
		global $post;
		global $newsMetaBoxArray;
		
		switch ($context) {
			case 'sort':
				$args = array(
					'post_type'  => 'news',
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
					'post_type'  => 'news',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);
				returnData($args, $newsMetaBoxArray, 'json', 'news_data');
			break;

			case 'array':
				$args = array(
					'post_type'  => 'news',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);
				return returnData($args, $newsMetaBoxArray, 'array');
			break;

			case 'rest':
				$args = array(
					'post_type'  => 'news',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true,
					'post__in' => $idArray
				);
				return returnData($args, $newsMetaBoxArray, 'array');
			break;

			case 'checkbox':
				$args = array(
					'post_type'  => 'news',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);

				$outputArray = returnData($args, $newsMetaBoxArray, 'array');

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
					'post_type'  => 'news',
					'order'   => 'ASC',
					'meta_key'  => 'custom_order',
					'orderby'  => 'meta_value_num',
					'nopaging' => true
				);

				$outputArray = returnData($args, $newsMetaBoxArray, 'array');

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
