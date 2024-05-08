<?php
defined('BASEPATH') or exit('No direct script access allowed');




$route['default_controller']   = 'welcome';
$route['404_override']         = '';
$route['translate_uri_dashes'] = FALSE;
$route['api/demo']             = 'api/ApiDemoController/index';



  // User
$route['user']                     = 'User/index';
$route['user/register']            = 'User/register';
$route['total_user']               = 'User/get_total';
$route['login']                    = 'User/login';
$route['user/find/(:any)']         = 'User/find/$1';
$route['user/update_login_status'] = 'User/update_login_status';
$route['user/update/(:any)']       = 'User/update/$1';
$route['user/delete/(:any)']       = 'User/delete/$1';


  // Reseller
$route['reseller']                     = 'Reseller/index';
$route['reseller/insert_credit']       = 'Reseller/insert_credit';
$route['reseller/(:any)']              = 'Reseller/get/$1';
$route['total_reseller']               = 'Reseller/get_total';
$route['reseller/get_credit/(:any)']   = 'Reseller/get_credit/$1';
$route['reseller/get_code/(:any)']     = 'Reseller/get_code/$1';
$route['reseller/get_purchase/(:any)'] = 'Reseller/get_purchase/$1';
$route['reseller/get_voucher/(:any)']  = 'Reseller/get_voucher/$1';




  // Search
$route['advance_search'] = 'AdvanceSearch/find';


  // Credit
$route['credit/get_reseller_available_code']        = 'Credit/get_reseller_available_code';
$route['credit/get_reseller_net_credit_get/(:any)'] = 'Credit/get_reseller_net_credit_get/$1';
$route['credit/update/(:any)']                      = 'Credit/update/$1';


  // Code
$route['code/update/(:any)']               = 'Code/update/$1';
$route['code/get_reseller_available_code'] = 'Code/get_reseller_available_code';


  // Voucher
$route['voucher']               = 'Voucher/index';
$route['voucher/insert']        = 'Voucher/insert';
$route['voucher/update/(:any)'] = 'Voucher/update/$1';
$route['voucher/delete/(:any)'] = 'Voucher/delete/$1';


  // Purhcase
$route['purchase']                        = 'Purchase/index';
$route['purchase/insert']                 = 'Purchase/insert';
$route['purchase/find/(:any)']            = 'Purchase/find/$1';
$route['purchase/update/(:any)']          = 'Purchase/update/$1';
$route['purchase/delete/(:any)']          = 'Purchase/delete/$1';
$route['get_sales_by_address_by_voucher'] = 'Purchase/get_sales_by_address_by_voucher';


