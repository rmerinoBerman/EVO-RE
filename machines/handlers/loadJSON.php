<?php

	require_once realpath(dirname(__FILE__).'/../../../../..').'/wp-load.php';

	if(isset($_POST['args']['query'])){
		foreach ($_POST['args']['query'] as $key => $value) {
			switch ($key) {
				case 'category':
					$arrayList = listCategories('array');
					$categoryID;
					foreach ($arrayList as $key1 => $value1) {
						if($value == strtolower($value1['the_title'])){
							$categoryID = $value1['post_id'];
						}
					}
					$imageList = listImages('array');

					$returnArray = array();
					foreach ($imageList as $key1 => $value1) {
						if($categoryID == $value1['category']){
							$returnArray[] = $value1['post_id'];
						}
					}
					echo json_encode($returnArray);
				break;

				case 'idArrayRequest':
					$jsonList = call_user_func($_POST['jsonRequest'], 'array');

					$returnArray = array();
					foreach ($jsonList as $key1 => $value1) {
						$returnArray[] = $value1['post_id'];
					}
					echo json_encode($returnArray);
				break;

			}
		}
	} else {
		echo json_encode(call_user_func($_POST['jsonRequest'], 'rest', $_POST['args']['idArray']));
	}

?>
