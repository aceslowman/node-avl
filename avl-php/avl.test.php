<?php
//unset($_COOKIE['cmcontinue']);
require_once('avl.class.php');
$avl = new AVL;
$avl->crawlWords();
$avl->show_tables();
