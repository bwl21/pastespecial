<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Strings for component 'atto_pastespecial', language 'en'.
 *
 * @package    atto_pastespecial
 * @copyright  2015 Joseph Inhofer
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

$string['pluginname'] = 'Paste special';
$string['pastehere'] = '1. Content to be pasted:';
$string['pastefromword'] = 'Paste from Microsoft Word';
$string['pastefromgdoc'] = 'Paste from Google Document';
$string['pastefromlibre'] = 'Paste from LibreWriter';
$string['pastefromother'] = 'Paste from Other';
$string['pastefrommoodle'] = 'Paste from Moodle';
$string['pastestraight'] = 'Paste the text without cleaning HTML';
$string['pasteunformatted'] = 'Paste as unformatted text';
$string['paste'] = 'Complete paste (Ctrl+Shift+Enter)';
$string['settings'] = 'Paste special settings';
$string['wordCSS_desc'] = 'Allowed CSS properties for pasting from Microsoft Word. See default for format.';
$string['gdocCSS_desc'] = 'Allowed CSS properties for pasting from Google Documents. See default for format.';
$string['libreCSS_desc'] = 'Allowed CSS properties for pasting from LibreWriter. See default for format.';
$string['otherCSS_desc'] = 'Allowed CSS properties for pasting from Other. See default of Word CSS for format.';
$string['wordCSS'] = 'Word CSS properties';
$string['gdocCSS'] = 'Google Document CSS properties';
$string['libreCSS'] = 'LibreWriter CSS properties';
$string['otherCSS'] = 'Other CSS properties';
$string['wordCSS_default'] = 'font-family,font-size,background,color,background-color';
$string['gdocCSS_default'] = 'background-color,color,font-family,font-size,font-weight,font-style,text-decoration,list-style-type,text-align';
$string['libreCSS_default'] = 'background,color,font-size';
$string['default'] = 'Set as default';
$string['default_desc'] = 'Set this plugin to handle pasting by keyboard instead of automatically pasting';
$string['pasteview'] = '3. Paste preview:';
$string['straight'] = 'Paste text straight';
$string['straight_desc'] = 'Allows the user to paste text through pastespecial without cleaning HTML';
$string['help'] = 'Help';
$string['help_text'] = 'Follow the itemized steps to paste your text into Atto. This plugin will clean the messy HTML pasted from your source and place a cleaned version into Atto. If you want to keep your formatting (aesthetics), select the radio option based off of where you formatted this text. If you don\'t want to keep your formatting, select the radio option for "unformatted". To hide this text, click "'.$string['help'].'" again.';
$string['cancel'] = 'Cancel';
$string['clickthebutton'] = '4. Click the "'.$string['paste'].'" button';
$string['height'] = 'Height';
$string['height_desc'] = 'Sets the height of the popup, in %';
$string['width'] = 'Width';
$string['width_desc'] = 'Sets the width of the popup, in %';
$string['step2'] = '2. Select from where the text was formatted';
