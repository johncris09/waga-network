<?php

defined('BASEPATH') or exit('No direct script access allowed');


function sortByFirstname($a, $b) {
    return strcmp($a['lastname'], $b['lastname']);
}