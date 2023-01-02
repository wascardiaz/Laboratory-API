const db = require("../../models");
const crypto = require("crypto");
const HosCase = db.hos_case_patient;
const Op = db.Sequelize.Op;

module.exports = {
  findAll,
  getById,
  create,
  update,
  delete: _delete,
  deleteAll: deleteAll,
  findAllWithOrder,
  findAllWithoutOrder,
  getCaseWithoutLabOrders
}

async function findAll(options) {

  const settings = [
    { companyId: 0, code: 'config', key: 'config_shared', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_fraud_detection', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_meta_title', value: 'Your Store', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_session_expire', value: '3600000000', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_meta_description', value: 'My Store', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_meta_keyword', value: '', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_theme', value: 'basic', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_layout_id', value: '4', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_country_id', value: '222', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_zone_id', value: '3563', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_timezone', value: 'UTC', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_language', value: 'en-gb', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_language_admin', value: 'en-gb', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_currency', value: 'USD', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_currency_auto', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_currency_engine', value: 'ecb', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_length_class_id', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_weight_class_id', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_product_description_length', value: '100', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_pagination', value: '10', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_pagination_admin', value: '10', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_product_count', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_review_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_review_guest', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_voucher_min', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_voucher_max', value: '1000', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_cookie_id', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_gdpr_id', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_gdpr_limit', value: '180', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_tax', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_tax_default', value: 'shipping', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_tax_customer', value: 'shipping', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_customer_online', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_customer_online_expire', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_customer_activity', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_customer_search', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_customer_group_id', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_customer_group_display', value: '["1"]', serialized: '1' },
    { companyId: 0, code: 'config', key: 'config_customer_price', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_account_id', value: '3', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_invoice_prefix', value: `INV-${new Date().getFullYear()}-00`, serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_api_id', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_cart_weight', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_checkout_guest', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_checkout_id', value: '5', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_order_status_id', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_processing_status', value: '["5","1","2","12","3"]', serialized: '1' },
    { companyId: 0, code: 'config', key: 'config_complete_status', value: '["5","3"]', serialized: '1' },
    { companyId: 0, code: 'config', key: 'config_fraud_status_id', value: '8', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_subscription_status_id', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_subscription_active_status_id', value: '2', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_subscription_expired_status_id', value: '6', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_subscription_canceled_status_id', value: '4', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_subscription_failed_status_id', value: '3', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_subscription_denied_status_id', value: '5', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_stock_display', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_stock_warning', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_stock_checkout', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_affiliate_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_affiliate_approval', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_affiliate_auto', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_affiliate_commission', value: '5', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_affiliate_id', value: '4', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_return_id', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_return_status_id', value: '2', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_logo', value: 'catalog/opencart-logo.png', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_thumb_width', value: '500', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_thumb_height', value: '500', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_popup_width', value: '800', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_popup_height', value: '800', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_category_width', value: '80', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_category_height', value: '80', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_product_width', value: '250', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_product_height', value: '250', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_additional_width', value: '74', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_additional_height', value: '74', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_related_width', value: '250', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_related_height', value: '250', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_compare_width', value: '90', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_compare_height', value: '90', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_wishlist_width', value: '47', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_wishlist_height', value: '47', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_cart_height', value: '47', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_cart_width', value: '47', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_location_height', value: '50', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image_location_width', value: '268', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_comment', value: '', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_open', value: '', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_image', value: '', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_fax', value: '', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_telephone', value: '123456789', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_email', value: 'demo@opencart.com', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_geocode', value: '', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_owner', value: 'Your Name', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_address', value: 'Address 1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_name', value: 'Your Store', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_seo_url', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_file_max_size', value: '20', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_file_ext_allowed', value: 'zip\r\ntxt\r\npng\r\njpe\r\njpeg\r\nwebp\r\njpg\r\ngif\r\nbmp\r\nico\r\ntiff\r\ntif\r\nsvg\r\nsvgz\r\nzip\r\nrar\r\nmsi\r\ncab\r\nmp3\r\nmp4\r\nqt\r\nmov\r\npdf\r\npsd\r\nai\r\neps\r\nps\r\ndoc', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_file_mime_allowed', value: 'text/plain\r\nimage/png\r\nimage/webp\r\nimage/jpeg\r\nimage/gif\r\nimage/bmp\r\nimage/tiff\r\nimage/svg+xml\r\napplication/zip\r\napplication/x-zip\r\napplication/x-zip-compressed\r\napplication/rar\r\napplication/x-rar\r\napplication/x-rar-compressed\r\napplication/octet-stream\r\naudio/mpeg\r\nvideo/mp4\r\nvideo/quicktime\r\napplication/pdf', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_maintenance', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_password', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_encryption', value: '', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_compression', value: '0', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_error_display', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_error_log', value: '1', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_error_filename', value: 'error.log', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_google_analytics', value: '', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_mail_engine', value: 'mail', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_mail_parameter', value: '', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_mail_smtp_hostname', value: '', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_mail_smtp_username', value: '', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_mail_smtp_password', value: '', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_mail_smtp_port', value: '25', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_mail_smtp_timeout', value: '5', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_mail_alert_email', value: '', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_mail_alert', value: '["order"]', serialized: '1' },
    { companyId: 0, code: 'config', key: 'config_captcha', value: 'basic', serialized: '0' },
    { companyId: 0, code: 'config', key: 'config_captcha_page', value: '["review","return","contact"]', serialized: '1' },
    { companyId: 0, code: 'config', key: 'config_login_attempts', value: '5', serialized: '0' },
    { companyId: 0, code: 'developer', key: 'developer_sass', value: '1', serialized: '0' },
    { companyId: 0, code: 'currency_ecb', key: 'currency_ecb_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'payment_free_checkout', key: 'payment_free_checkout_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'payment_free_checkout', key: 'payment_free_checkout_order_status_id', value: '1', serialized: '0' },
    { companyId: 0, code: 'payment_free_checkout', key: 'payment_free_checkout_sort_order', value: '1', serialized: '0' },
    { companyId: 0, code: 'payment_cod', key: 'payment_cod_sort_order', value: '5', serialized: '0' },
    { companyId: 0, code: 'payment_cod', key: 'payment_cod_total', value: '0.01', serialized: '0' },
    { companyId: 0, code: 'payment_cod', key: 'payment_cod_order_status_id', value: '1', serialized: '0' },
    { companyId: 0, code: 'payment_cod', key: 'payment_cod_geo_zone_id', value: '0', serialized: '0' },
    { companyId: 0, code: 'payment_cod', key: 'payment_cod_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'shipping_flat', key: 'shipping_flat_sort_order', value: '1', serialized: '0' },
    { companyId: 0, code: 'shipping_flat', key: 'shipping_flat_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'shipping_flat', key: 'shipping_flat_geo_zone_id', value: '0', serialized: '0' },
    { companyId: 0, code: 'shipping_flat', key: 'shipping_flat_tax_class_id', value: '9', serialized: '0' },
    { companyId: 0, code: 'shipping_flat', key: 'shipping_flat_cost', value: '5.00', serialized: '0' },
    { companyId: 0, code: 'total_shipping', key: 'total_shipping_sort_order', value: '3', serialized: '0' },
    { companyId: 0, code: 'total_sub_total', key: 'total_sub_total_sort_order', value: '1', serialized: '0' },
    { companyId: 0, code: 'total_sub_total', key: 'total_sub_total_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'total_tax', key: 'total_tax_sort_order', value: '5', serialized: '0' },
    { companyId: 0, code: 'total_tax', key: 'total_tax_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'total_total', key: 'total_total_sort_order', value: '9', serialized: '0' },
    { companyId: 0, code: 'total_total', key: 'total_total_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'total_credit', key: 'total_credit_sort_order', value: '7', serialized: '0' },
    { companyId: 0, code: 'total_credit', key: 'total_credit_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'total_reward', key: 'total_reward_sort_order', value: '2', serialized: '0' },
    { companyId: 0, code: 'total_reward', key: 'total_reward_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'total_shipping', key: 'total_shipping_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'total_shipping', key: 'total_shipping_estimator', value: '1', serialized: '0' },
    { companyId: 0, code: 'total_coupon', key: 'total_coupon_sort_order', value: '4', serialized: '0' },
    { companyId: 0, code: 'total_coupon', key: 'total_coupon_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'total_voucher', key: 'total_voucher_sort_order', value: '8', serialized: '0' },
    { companyId: 0, code: 'total_voucher', key: 'total_voucher_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'module_category', key: 'module_category_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'module_account', key: 'module_account_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'theme_basic', key: 'theme_basic_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'dashboard_activity', key: 'dashboard_activity_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'dashboard_activity', key: 'dashboard_activity_sort_order', value: '7', serialized: '0' },
    { companyId: 0, code: 'dashboard_sale', key: 'dashboard_sale_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'dashboard_sale', key: 'dashboard_sale_width', value: '3', serialized: '0' },
    { companyId: 0, code: 'dashboard_chart', key: 'dashboard_chart_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'dashboard_chart', key: 'dashboard_chart_width', value: '6', serialized: '0' },
    { companyId: 0, code: 'dashboard_customer', key: 'dashboard_customer_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'dashboard_customer', key: 'dashboard_customer_width', value: '3', serialized: '0' },
    { companyId: 0, code: 'dashboard_map', key: 'dashboard_map_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'dashboard_map', key: 'dashboard_map_width', value: '6', serialized: '0' },
    { companyId: 0, code: 'dashboard_online', key: 'dashboard_online_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'dashboard_online', key: 'dashboard_online_width', value: '3', serialized: '0' },
    { companyId: 0, code: 'dashboard_order', key: 'dashboard_order_sort_order', value: '1', serialized: '0' },
    { companyId: 0, code: 'dashboard_order', key: 'dashboard_order_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'dashboard_order', key: 'dashboard_order_width', value: '3', serialized: '0' },
    { companyId: 0, code: 'dashboard_sale', key: 'dashboard_sale_sort_order', value: '2', serialized: '0' },
    { companyId: 0, code: 'dashboard_customer', key: 'dashboard_customer_sort_order', value: '3', serialized: '0' },
    { companyId: 0, code: 'dashboard_online', key: 'dashboard_online_sort_order', value: '4', serialized: '0' },
    { companyId: 0, code: 'dashboard_map', key: 'dashboard_map_sort_order', value: '5', serialized: '0' },
    { companyId: 0, code: 'dashboard_chart', key: 'dashboard_chart_sort_order', value: '6', serialized: '0' },
    { companyId: 0, code: 'dashboard_recent', key: 'dashboard_recent_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'dashboard_recent', key: 'dashboard_recent_sort_order', value: '8', serialized: '0' },
    { companyId: 0, code: 'dashboard_activity', key: 'dashboard_activity_width', value: '4', serialized: '0' },
    { companyId: 0, code: 'dashboard_recent', key: 'dashboard_recent_width', value: '8', serialized: '0' },
    { companyId: 0, code: 'report_customer_activity', key: 'report_customer_activity_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'report_customer_activity', key: 'report_customer_activity_sort_order', value: '1', serialized: '0' },
    { companyId: 0, code: 'report_customer_order', key: 'report_customer_order_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'report_customer_order', key: 'report_customer_order_sort_order', value: '2', serialized: '0' },
    { companyId: 0, code: 'report_customer_reward', key: 'report_customer_reward_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'report_customer_reward', key: 'report_customer_reward_sort_order', value: '3', serialized: '0' },
    { companyId: 0, code: 'report_customer_search', key: 'report_customer_search_sort_order', value: '3', serialized: '0' },
    { companyId: 0, code: 'report_customer_search', key: 'report_customer_search_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'report_customer_transaction', key: 'report_customer_transaction_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'report_customer_transaction', key: 'report_customer_transaction_status_sort_order', value: '4', serialized: '0' },
    { companyId: 0, code: 'report_sale_tax', key: 'report_sale_tax_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'report_sale_tax', key: 'report_sale_tax_sort_order', value: '5', serialized: '0' },
    { companyId: 0, code: 'report_sale_shipping', key: 'report_sale_shipping_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'report_sale_shipping', key: 'report_sale_shipping_sort_order', value: '6', serialized: '0' },
    { companyId: 0, code: 'report_sale_return', key: 'report_sale_return_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'report_sale_return', key: 'report_sale_return_sort_order', value: '7', serialized: '0' },
    { companyId: 0, code: 'report_sale_order', key: 'report_sale_order_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'report_sale_order', key: 'report_sale_order_sort_order', value: '8', serialized: '0' },
    { companyId: 0, code: 'report_sale_coupon', key: 'report_sale_coupon_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'report_sale_coupon', key: 'report_sale_coupon_sort_order', value: '9', serialized: '0' },
    { companyId: 0, code: 'report_product_viewed', key: 'report_product_viewed_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'report_product_viewed', key: 'report_product_viewed_sort_order', value: '10', serialized: '0' },
    { companyId: 0, code: 'report_product_purchased', key: 'report_product_purchased_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'report_product_purchased', key: 'report_product_purchased_sort_order', value: '11', serialized: '0' },
    { companyId: 0, code: 'report_marketing', key: 'report_marketing_status', value: '1', serialized: '0' },
    { companyId: 0, code: 'report_marketing', key: 'report_marketing_sort_order', value: '12', serialized: '0' },];

  // await db.setting.destroy({
  //   where: {
  //     [Op.and]: {
  //       // code: 'config',
  //       companyId: 0
  //     }
  //   }
  // })
  if ((await db.setting.count()) === 0) {
    settings.forEach(async element => await db.setting.create(element).catch(err => console.log(err)));
  }

  var condition = null;
  if (options.search && options.origin)
    condition = { id: { [Op.like]: `%${options.search}%` }, origenId: options.origin };
  else if (options.search)
    condition = { id: { [Op.like]: `%${options.search}%` } };
  else if (options.origin)
    condition = { origenId: options.origin }
  return await HosCase.findAndCountAll({
    where: condition,
    include: [
      { model: db.hos_patient, as: 'patient', include: db.person },
      { model: db.hos_case_origin, as: 'origin' }
    ],
    order: options.orderBy && options.orderDir ? [[options.orderBy, options.orderDir]] : [['id', 'DESC']],
    offset: options.page ? parseInt(options.page) * options.size : 1,
    limit: options.size ? parseInt(options.size) : 5,
  }).then(data => {
    return { count: data.count, records: data.rows }
  }).catch(err => {
    console.log(err);
    throw err.message || "Some error occurred while retrieving properties.";
  });
}

async function findAllWithoutOrder(options) {
  var condition = options.search ? {
    [Op.or]: [
      { id: { [Op.like]: `${options.search}` } },

      { '$patient.person.firstName$': { [Op.like]: `%${options.search}%` } },
      { '$patient.person.lastName$': { [Op.like]: `%${options.search}%` } },
      { '$patient.person.document$': { [Op.like]: `%${options.search}%` } },
      { '$patient.person.email$': { [Op.like]: `%${options.search}%` } },
      { '$patient.person.nickname$': { [Op.like]: `%${options.search}%` } },

      { '$patient.nss$': { [Op.like]: `${options.search}` } },
    ]
    // {
    //   [Op.or]: [
    //     { firstName: { [Op.like]: `%${options.search}%` } },
    //     { lastName: { [Op.like]: `%${options.search}%` } },
    //     // { document: { [Op.like]: `%${options.search}%` } }
    //   ],
    // },
    // '$hos_patient.person$':
    // {
    //   [Op.or]: [
    //     { firstName: { [Op.like]: `%${options.search}%` } },
    //     { lastName: { [Op.like]: `%${options.search}%` } },
    //     // { document: { [Op.like]: `%${options.search}%` } }
    //   ],
    // }
    // required: true
  } : null;

  return HosCase.findAndCountAll({
    where: condition,
    include: [
      {
        model: db.hos_patient, as: 'patient',
        include: {
          model: db.person/* , where: condition */,
          required: true
        },
        required: true
      },
      {
        model: db.hos_cargos_patient, as: 'cargos',
        where: { recpId: { [Op.is]: null } },
        required: true
      },
      { model: db.hos_case_origin, as: 'origin' }
    ],
    offset: options.page ? parseInt(options.page) * options.size : 1,
    limit: options.size ? parseInt(options.size) : 5,
    order: options.orderBy && options.orderDir ? [[options.orderBy, options.orderDir]] : [['id', 'DESC']],
  }).then(data => {
    return { count: data.count, records: data.rows };
  }).catch(err => {
    console.log(err)
    throw err.message || "Some error occurred while retrieving properties.";
  });
}

async function findAllWithOrder(options, user) {
  var condition = user && user.customerId && options.search ? {
    [Op.and]: [
      {
        customerId: parseInt(user.customerId)
      }
    ],
    [Op.or]: [
      { id: { [Op.like]: `${options.search}` } },
      { factNo: { [Op.like]: `${options.search}` } },

      { '$patient.person.firstName$': { [Op.like]: `%${options.search}%` } },
      { '$patient.person.lastName$': { [Op.like]: `%${options.search}%` } },
      { '$patient.person.document$': { [Op.like]: `%${options.search}%` } },
      { '$patient.person.email$': { [Op.like]: `%${options.search}%` } },
      { '$patient.person.nickname$': { [Op.like]: `%${options.search}%` } },

      { '$patient.nss$': { [Op.like]: `${options.search}` } },
    ]
  } : user && user.customerId ? {
    customerId: parseInt(user.customerId)
  } : null;;

  return await HosCase.findAndCountAll({
    where: condition,
    include: [
      {
        model: db.hos_patient, as: 'patient',
        include: {
          model: db.person/* , where: condition */,
          required: true
        },
        required: true
      },
      {
        model: db.hos_cargos_patient, as: 'cargos',
        where: { recpId: { [Op.not]: null } },
        required: true
      },
      { model: db.hos_case_origin, as: 'origin' }
    ],
    offset: options.page ? parseInt(options.page) * options.size : 1,
    limit: options.size ? parseInt(options.size) : 5,
    order: options.orderBy && options.orderDir ? [[options.orderBy, options.orderDir]] : [['id', 'DESC']],
  }).then(data => {
    return { count: data.count, records: data.rows };
  }).catch(err => {
    console.log(err)
    throw err.message || "Some error occurred while retrieving properties.";
  });
}

async function getById(id) {
  const caso = await HosCase.findByPk(id, {
    include: [
      { model: db.hos_cargos_patient, as: 'cargos' },
      { model: db.hos_patient, as: 'patient', include: [db.person, { model: db.hos_patient_to_ars, as: 'arses' }] },
      { model: db.hos_case_origin, as: 'origin' }
    ]
  })
    .catch(err => {
      console.log(err);
    });

  if (!caso) throw "No se encontro el caso con id = " + id;

  return caso;
}

async function getCaseWithoutLabOrders(id) {
  const caso = await HosCase.findByPk(id, {
    include: [
      {
        model: db.hos_cargos_patient, as: 'cargos',
        where: { recpId: { [Op.is]: null } },
        required: false
      },
      { model: db.hos_patient, as: 'patient', include: [db.person, { model: db.hos_patient_to_ars, as: 'arses' }] }
    ]
  }).catch(err => { console.log(err); });

  if (!caso) throw "No se encontro el caso con id = " + id;

  return caso;
}

async function create(params) {
  params.asegurado = params.asegurado ? '1' : '0';
  if (!params.asegurado) {
    params.seguId = null;
    params.seguPlanId = null;
    params.poliza = null;
    params.autorizacion = null;
  }
  params.facturado = params.facturado ? '1' : '0';
  params.status = params.status ? '1' : '0';
  delete params.created;

  await db.hos_case_patient.create(params).then(c => {
    params.cargos.forEach(async (element, index) => {
      element.secuencia = index + 1;
      element.caseId = c.id;
      delete element.created;
      // if (element.qty > 0)
      await db.hos_cargos_patient.create(element).catch(err => console.log(err));
    });
    // return res.status(200).json({ message: 'Caso creado satisfactoriamente.' })
  }).catch(err => {
    console.log(err);
    throw err.message || 'Error creando nuevo caso';
  });
}

async function update(id, params) {
  return await HosCase.findByPk(id).then(async data => {
    Object.assign(data, params);
    data.updated = new Date(Date.now());
    // console.log(params, data.dataValues);
    await data.save().then(c => {
      if (params.cargos) {
        db.hos_cargos_patient.destroy({ where: { caseId: c.id } }).catch(err => console.log(err));
        params.cargos.forEach(async (element, index) => {
          element.secuencia = index + 1;
          element.caseId = c.id;
          delete element.created;
          // console.log(element);
          // if (element.qty > 0)
          await db.hos_cargos_patient.create(element).catch(err => console.log(err));
        });
      }
    });
  }).catch(err => {
    console.log(err);
    throw err.message || "Error al actualizar Caso con id=" + id;
  });
}

async function _delete(id) {
  await HosCase.destroy({
    where: { id: id }
  }).then(num => {
    if (num == 1) {
      return "¡El caso fue eliminado con éxito!";
    } else {
      throw `No se pudo eliminar caso con id=${id}. ¡Quizás el caso no fue encontrado!`;
    }
  }).catch(err => {
    console.log(err);
    throw err.message || "No se pudo eliminar el caso con id=" + id;
  });
}

async function deleteAll() {
  return await HosCase.destroy({
    where: {},
    truncate: false
  }).then(nums => {
    return `¡Se eliminaron ${nums} propiedades con éxito!`;
  }).catch(err => {
    console.log(err);
    throw err.message || "Se produjo un error al eliminar todas las propiedades.";
  });
}

// // Create and Save a new HosCase
// exports.create = async (req, res) => {
//   const caseParam = req.body;

//   // let patient = caseParam.patient;
//   // let person = caseParam.patient.person;

//   // // Si la persona existe
//   // if (caseParam.patient.person.id > 0) {
//   //   // Actualizamos ambos.
//   //   person = await db.person.findOne({ where: { id: caseParam.patient.person.id } })
//   //   Object.assign(person, caseParam.patient.person);
//   //   await person.save();
//   // }
//   // // De lo contrario creamos la persona y el paciente.
//   // else {
//   //   person = await db.person.create(caseParam.patient.person);
//   //   patient.personId = person.id;
//   //   patient = await db.person.create(patient);
//   // }

//   // // Verificamos a ver si existe el Paciente
//   // patient = await db.hos_patient.findOne({ where: { personId: person.id } });
//   // // Si existe lo actualizamos, si no, lo creamos
//   // if (patient) {
//   //   Object.assign(patient, caseParam.patient);
//   //   patient.patientType = patient.patientType ? '1' : '0';
//   //   patient.fallecido = patient.fallecido ? '1' : '0';
//   //   patient.vip = patient.vip ? '1' : '0';
//   //   patient.no_grato = patient.no_grato ? '1' : '0';
//   //   patient.status = patient.status ? '1' : '0';
//   //   patient.updated = new Date(Date.now());
//   //   patient.created = new Date(Date.now());
//   //   console.log('Actualizando Paciente....', patient.dataValues);
//   //   await patient.save();
//   //   await db.hos_patient_seguros.destroy({ where: { patientId: patient.id } });
//   //   caseParam.patient.seguros.forEach(async element => {
//   //     element.patientId = patient.id;
//   //     delete element.created;
//   //     await db.hos_patient_seguros.create(element);
//   //   });
//   // }
//   // else {
//   //   delete caseParam.patient.created;
//   //   caseParam.patient.personId = person.id;
//   //   caseParam.patientType = caseParam.patientType ? '1' : '0';
//   //   caseParam.patient.fallecido = caseParam.patient.fallecido ? '1' : '0';
//   //   caseParam.patient.vip = caseParam.patient.vip ? '1' : '0';
//   //   caseParam.patient.no_grato = caseParam.no_grato ? '1' : '0';
//   //   caseParam.patient.status = caseParam.patient.status ? '1' : '0';
//   //   caseParam.patient.web_usuario = `${(person.nombres).split(' ')[0].slice(0, 1)}${(person.apellidos).split(' ')[0]}${Math.floor(Math.random() * 10)}`;
//   //   caseParam.patient.web_clave = randomString().toLowerCase();
//   //   console.log('Creando nuevo Paciente....', caseParam.patient);
//   //   patient = await db.hos_patient.create(caseParam.patient).catch(e => console.log(e));
//   //   // await db.patient_seguros.destroy({ where: { patientId: patient.id } });
//   //   caseParam.patient.seguros.forEach(async element => {
//   //     element.patientId = patient.id;
//   //     delete element.created;
//   //     await db.hos_patient_seguros.create(element);
//   //   });
//   // }

//   // Procedemos a creal el caso.
//   // caseParam.patientId = patient.id;
//   caseParam.asegurado = caseParam.asegurado ? '1' : '0';
//   if (!caseParam.asegurado) {
//     caseParam.seguId = null;
//     caseParam.seguPlanId = null;
//     caseParam.poliza = null;
//     caseParam.autorizacion = null;
//   }
//   caseParam.facturado = caseParam.facturado ? '1' : '0';
//   caseParam.status = caseParam.status ? '1' : '0';
//   delete caseParam.created;

//   await db.hos_case_patient.create(caseParam).then(c => {
//     caseParam.cargos.forEach(async (element, index) => {
//       element.secuencia = index + 1;
//       element.caseId = c.id;
//       delete element.created;
//       if (element.qty > 0)
//         await db.hos_cargos_patient.create(element).catch(err => console.log(err));
//     });
//     // return res.status(200).json({ message: 'Caso creado satisfactoriamente.' })
//   }).catch(err => console.log(err));

//   res.status(200).json({ message: 'Caso registrado correctamente.' });
//   return;
// };

// // Retrieve all Resultados from the database.
// exports.findAll = (req, res) => {
//   const origin = req.query.origin;
//   const search = req.query.search;
//   const pending = req.query.pending;
//   const done = req.query.done;

//   const options = req.query;

//   var condition = null;

//   if (search && origin)
//     condition = { id: { [Op.like]: `%${search}%` }, origenId: origin };
//   else if (search)
//     condition = { id: { [Op.like]: `%${search}%` } };
//   else if (origin)
//     condition = { origenId: origin }

//   if (pending)
//     return HosCase.findAndCountAll({
//       where: condition,
//       include: [{ model: db.hos_patient, include: db.person },
//       {
//         model: db.hos_cargos_patient,
//         where: { recpId: { [Op.is]: null } },
//         required: true
//       },
//       db.hos_case_origin],
//       offset: options.page ? parseInt(options.page) : 1,
//       limit: options.size ? parseInt(options.size) : 5,
//       order: options.orderBy && options.orderDir ? [[options.orderBy, options.orderDir]] : [['id', 'DESC']],
//     })
//       .then(data => {
//         res.send({ count: data.count, records: data.rows });
//       })
//       .catch(err => {
//         console.log(err)
//         res.status(500).send({
//           message:
//             err.message || "Some error occurred while retrieving properties."
//         });
//       });
//   if (done)
//     return HosCase.findAndCountAll({
//       where: condition,
//       include: [{ model: db.hos_patient, include: db.person },
//       {
//         model: db.hos_cargos_patient,
//         where: { recpId: { [Op.not]: null } },
//         required: true
//       },
//       db.hos_case_origin],
//       offset: options.page ? parseInt(options.page) : 1,
//       limit: options.size ? parseInt(options.size) : 5,
//       order: options.orderBy && options.orderDir ? [[options.orderBy, options.orderDir]] : [['id', 'DESC']],
//     })
//       .then(data => {
//         res.send({ count: data.count, records: data.rows });
//       })
//       .catch(err => {
//         console.log(err)
//         res.status(500).send({
//           message:
//             err.message || "Some error occurred while retrieving properties."
//         });
//       });

//   HosCase.findAndCountAll({
//     where: condition,
//     include: [
//       { model: db.hos_patient, include: db.person }, db.hos_case_origin
//     ],
//     // limit: options.size ? options.size : 5,
//     // offset: options.size ? options.size : 5,
//     order: options.orderBy && options.orderDir ? [[options.orderBy, options.orderDir]] : [['id', 'DESC']],
//     offset: options.page ? parseInt(options.page) : 1,
//     limit: options.size ? parseInt(options.size) : 5,
//   })
//     .then(data => {
//       res.send({ count: data.count, records: data.rows });
//     })
//     .catch(err => {
//       console.log(err)
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving properties."
//       });
//     });
// };

// // Find a single HosCase with an id
// exports.findOne = (req, res) => {
//   const id = req.params.id;
//   const pending = req.query.pending;
//   let condition = null;
//   if (pending) {
//     condition = {
//       include: [{
//         model: db.hos_cargos_patient,
//         where: { recpId: { [Op.is]: null } },
//         required: false
//       },
//       { model: db.hos_patient, include: [db.person, db.hos_patient_seguros] }]
//     };
//   }
//   else {
//     condition = { include: [db.hos_cargos_patient, { model: db.hos_patient, include: [db.person, db.hos_patient_seguros] }] };
//   }
//   HosCase.findByPk(id, condition)
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Error retrieving HosCase with id=" + id
//       });
//     });
// };

// // Update a HosCase by the id in the request
// exports.update = async (req, res) => {
//   const id = req.params.id;
//   const caseParam = req.body;
//   // let patient = caseParam.patient;
//   // Verificamos a ver si existe el Paciente
//   // patient = await db.hos_patient.findByPk(patient.id, { include: db.person });
//   // // Si existe lo actualizamos, si no, lo creamos
//   // if (patient) {
//   //   person = patient.person;
//   //   Object.assign(person, caseParam.patient.person);
//   //   // Actualizando Persona
//   //   await person.save();
//   //   Object.assign(patient, caseParam.patient);
//   //   patient.updated = new Date(Date.now());
//   //   // Actualizando Paciente
//   //   await patient.save();
//   //   // Eliminando Seguros del paciente
//   //   await db.hos_patient_seguros.destroy({ where: { patientId: patient.id } });
//   //   caseParam.patient.seguros.forEach(async element => {
//   //     element.patientId = patient.id;
//   //     delete element.created;
//   //     // Creando Seguros del paciente
//   //     await db.hos_patient_seguros.create(element);
//   //   });
//   // }

//   await HosCase.findByPk(id).then(async data => {
//     Object.assign(data, caseParam);
//     data.updated = new Date(Date.now());
//     // console.log(caseParam, data.dataValues);
//     await data.save().then(c => {
//       if (caseParam.cargos) {
//         db.hos_cargos_patient.destroy({ where: { caseId: c.id } }).catch(err => console.log(err));
//         caseParam.hos_cargos_patients.forEach(async (element, index) => {
//           element.secuencia = index + 1;
//           element.caseId = c.id;
//           delete element.created;
//           // console.log(element);
//           if (element.qty > 0)
//             await db.hos_cargos_patient.create(element).catch(err => console.log(err));
//         });
//       }
//       return res.send({ message: "HosCase was updated successfully." });
//     });
//   }).catch(err => {
//     return res.status(500).send({ message: "Error updating HosCase with id=" + id });
//   });

// };

// // Delete a HosCase with the specified id in the request
// exports.delete = (req, res) => {
//   const id = req.params.id;

//   HosCase.destroy({
//     where: { id: id }
//   })
//     .then(num => {
//       if (num == 1) {
//         res.send({
//           message: "HosCase was deleted successfully!"
//         });
//       } else {
//         res.send({
//           message: `Cannot delete HosCase with id=${id}. Maybe HosCase was not found!`
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Could not delete HosCase with id=" + id
//       });
//     });
// };

// // Delete all Resultados from the database.
// exports.deleteAll = (req, res) => {
//   HosCase.destroy({
//     where: {},
//     truncate: false
//   })
//     .then(nums => {
//       res.send({ message: `${nums} Properties were deleted successfully!` });
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while removing all properties."
//       });
//     });
// };

// // find all published HosCase
// exports.findAllPublished = (req, res) => {
//   HosCase.findAll({ where: { published: true } })
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving properties."
//       });
//     });
// };

// function randomString() {
//   return crypto.randomBytes(6).toString('hex');
// }