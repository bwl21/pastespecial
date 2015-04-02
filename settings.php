<?php
/**
 * Settings that allow configuration of the list of tex examples in the equation editor.
 *
 * @package    atto_pastespecial
 * @copyright  2015 Joseph Inhofer
 */

defined('MOODLE_INTERNAL') || die();

$ADMIN->add('editoratto', new admin_category('atto_pastespecial', new lang_string('pluginname', 'atto_pastespecial')));

$settings = new admin_settingpage('atto_pastespecial_settings', new lang_string('settings', 'atto_pastespecial'));
if ($ADMIN->fulltree) {
    // Set the CSS properties to be used in pasting from Word.
    $name = new lang_string('wordCSS', 'atto_pastespecial');
    $desc = new lang_string('wordCSS_desc', 'atto_pastespecial');
    $default = new lang_string('wordCSS_default', 'atto_pastespecial');

    $setting = new admin_setting_configtextarea('atto_pastespecial/wordCSS',
                                              $name,
                                              $desc,
                                              $default,
                                              PARAM_TEXT,
                                              '50',
                                              '10');
    $settings->add($setting);

    // Set the CSS properties to be used in pasting from Google Documents
    $name = new lang_string('gdocCSS', 'atto_pastespecial');
    $desc = new lang_string('gdocCSS_desc', 'atto_pastespecial');
    $default = new lang_string('gdocCSS_default', 'atto_pastespecial');

    $setting = new admin_setting_configtextarea('atto_pastespecial/gdocCSS',
                                              $name,
                                              $desc,
                                              $default,
                                              PARAM_TEXT,
                                              '50',
                                              '10');
    $settings->add($setting);

    // Set the CSS properties to be used in pasting from Libre
    $name = new lang_string('libreCSS', 'atto_pastespecial');
    $desc = new lang_string('libreCSS_desc', 'atto_pastespecial');
    $default = new lang_string('libreCSS_default', 'atto_pastespecial');

    $setting = new admin_setting_configtextarea('atto_pastespecial/libreCSS',
                                              $name,
                                              $desc,
                                              $default,
                                              PARAM_TEXT,
                                              '50',
                                              '10');
    $settings->add($setting);

    // Set the CSS properties to be used in pasting from Other
    $name = new lang_string('otherCSS', 'atto_pastespecial');
    $desc = new lang_string('otherCSS_desc', 'atto_pastespecial');

    $setting = new admin_setting_configtextarea('atto_pastespecial/otherCSS',
                                              $name,
                                              $desc,
                                              '',
                                              PARAM_TEXT,
                                              '50',
                                              '10');
    $settings->add($setting);
}
