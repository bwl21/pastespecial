<?php


defined('MOODLE_INTERNAL') || die();

/**
 * Send language string to JS
 */

function atto_pastespecial_strings_for_js() {
    global $PAGE;

    $PAGE->requires->strings_for_js(array('pastehere',
                                          'pastefromword',
                                          'pastefromgdoc',
                                          'pastefromlibre',
                                          'pastefromother',
                                          'pasteunformatted',
                                          'paste'
                                         ), 'atto_pastespecial');
}

/**
 * Send parameters to JS
 * @param $elementid
 * @param $options
 * @param $foptions
 * return Array $params that contains the plugin config settings
 */

function atto_pastespecial_params_for_js($elementid, $options, $fpoptions) {
    $params = array('wordCSS' => get_config('atto_pastespecial', 'wordCSS'),
                    'gdocCSS' => get_config('atto_pastespecial', 'gdocCSS'),
                    'libreCSS' => get_config('atto_pastespecial', 'libreCSS'),
                    'otherCSS' => get_config('atto_pastespecial', 'otherCSS'));
    return $params;
}
