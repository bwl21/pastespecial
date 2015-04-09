/** Here we go
 *
 * @package     atto_pastespecial
 * @copyright   2015 Joseph Inhofer <jinhofer@umn.edu>
 *
 * @module  moodl-atto_pastespecial-button
 *
 * Atto text editor pastespecial plugin
 *
 * @namespace M.atto_pastespecial
 * @class button
 * @extends M.editor_atto.EditorPlugin
 */

var COMPONENTNAME = 'atto_pastespecial',
    CSS = {
        PASTEAREA: 'atto_pastespecial_pastearea',
        PASTEFROMWORD: 'atto_pastespecial_pastefromword',
        PASTEFROMGDOC: 'atto_pastespecial_pastefromgdoc',
        PASTEFROMLIBRE: 'atto_pastespecial_pastefromlibre',
        PASTEFROMOTHER: 'atto_pastespecial_pastefromother',
        PASTEUNFORMATTED: 'atto_pastespecial_pasteunformatted',
        IFRAME: 'atto_pastespecial_iframe'
    },
    SELECTORS = {
        PASTEAREA: '.atto_pastespecial_pastearea',
        PASTEFROMWORD: '.atto_pastespecial_pastefromword',
        PASTEFROMGDOC: '.atto_pastespecial_pastefromgdoc',
        PASTEFROMLIBRE: '.atto_pastespecial_pastefromlibre',
        PASTEFROMOTHER: '.atto_pastespecial_pastefromother',
        PASTEUNFORMATTED: '.atto_pastespecial_pasteunformatted',
        IFRAME: '.atto_pastespecial_iframe',
        IFRAMEID: '#atto_pastespecial_iframe'
    },
    STYLES = {
        GDOC: ['background-color',
               'color',
               'font-family',
               'font-size',
               'font-weight',
               'font-style',
               'text-decoration',
               'list-style-type',
               'text-align'],
        LIBRE: ['background',
                'color',
                'font-size'],
        WORD: ['font-family',
               'font-size',
               'background',
               'color',
               'background-color']
    },
    TEMPLATE = '' +
        '<form class="atto_form">' +
            '<div>' +
            '{{get_string "pastehere" component}}' +
            '</div>' +
            '<div id="{{elementid}}_{{CSS.IFRAME}}" class="{{CSS.IFRAME}}" contentEditable="true"' +
            'style="width:100%;height:200px;overflow-y:scroll;border: 1px solid grey"></div>' +
            '<input type="radio" class="{{CSS.PASTEFROMWORD}}" name="from" id="{{elementid}}_{{CSS.PASTEFROMWORD}}" checked>' +
            '<label for="{{elementid}}_{{CSS.PASTEFROMWORD}}">{{get_string "pastefromword" component}}</label>' +
            '<br>' +
            '<input type="radio" class="{{CSS.PASTEFROMGDOC}}" name="from" id="{{elementid}}_{{CSS.PASTEFROMGDOC}}"/>' +
            '<label for="{{elementid}}_{{CSS.PASTEFROMGDOC}}">{{get_string "pastefromgdoc" component}}</label>' +
            '<br>' +
            '<input type="radio" class="{{CSS.PASTEFROMLIBRE}}" name="from" id="{{elementid}}_{{CSS.PASTEFROMLIBRE}}"/>' +
            '<label for="{{elementid}}_{{CSS.PASTEFROMLIBRE}}">{{get_string "pastefromlibre" component}}</label>' +
            '<br>' +
            '<input type="radio" class="{{CSS.PASTEFROMOTHER}}" name="from" id="{{elementid}}_{{CSS.PASTEFROMOTHER}}"/>' +
            '<label for="{{elementid}}_{{CSS.PASTEFROMOTHER}}">{{get_string "pastefromother" component}}</label>' +
            '<br>' +
            '<input type="radio" class="{{CSS.PASTEUNFORMATTED}}" name="from" id="{{elementid}}_{{CSS.PASTEUNFORMATTED}}"/>' +
            '<label for="{{elementid}}_{{CSS.PASTEUNFORMATTED}}">{{get_string "pasteunformatted" component}}</label>' +
            '<div class="mdl-align">' +
                '<br>' +
                '<button type="submit" class="submit">{{get_string "paste" component}}</button>' +
            '</div>' +
        '</form>';
Y.namespace('M.atto_pastespecial').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {

    // Will become the content to be loaded.
    _content: null,

    // Will point to the iframe where the information will be pasted.
    _iframe: null,

    // Will be a string that contains the CSS properties to be used with Google Docs.
    _gdocStyle: null,

    // Will be a string that contains the CSS properties to be used with Libre
    _libreStyle: null,

    // Will be a string that contains the CSS properties to be used with Word
    _wordStyle: null,

    // Will be a string that contains the CSS properties to be used with Other
    _otherStyle: null,

    // Will point to and hold the current selection when we handle pasting.
    _currentSelection: null,

    initializer: function(params) {
        // Pull in the settings if they are not empty
        // If they are empty, set to the default above
        if(params.wordCSS !== '') {
            this._wordStyle = params.wordCSS;
        }
        else {
            this._wordStyle = STYLES.WORD;
        }
        if(params.gdocCSS !== '') {
            this._gdocStyle = params.gdocCSS;
        }
        else {
            this._gdocStyle = STYLES.GDOC;
        }
        if(params.libreCSS !== '') {
            this._libreStyle = params.libreCSS;
        }
        else {
            this._libreStyle = STYLES.LIBRE;
        }
        if(params.otherCSS !== '') {
            this.otherStyle = params.otherCSS;
        }
        else {
            this.otherStyle = STYLES.GDOC + STYLES.LIBRE + STYLES.WORD;
        }

        // Add the button
        this.addButton({
            icon: 'e/paste',
            callback: this._displayDialogue
        });
    },

    /**
     * Display the paste dialogue
     *
     * @method _displayDialogue
     * @private
     */
    _displayDialogue: function() {
        // Set the HTML of the dialogue to be loaded
        var dialogue = this.getDialogue({
            headerContent: M.util.get_string('pluginname', COMPONENTNAME),
            focusAfterHide: true,
            focusOnShowSelector: SELECTORS.PASTEAREA
        });

        // Save the current selection of the editor.
        this._currentSelection = this.get('host').getSelection();

        // Send the dialogue to the page.
        dialogue.set('bodyContent', this._getDialogueContent());

        // Show the dialogue.
        dialogue.show();

        // Set the iframe target for later use.
        this._iframe = Y.one(SELECTORS.IFRAME);
        this._iframe.focus();
    },

    /**
     * Handle the pasted information when the user clicks paste
     *
     * @method _pasteContent
     * @param e Sent click
     *
     */
    _pasteContent: function(e) {
        var value,
            checked,
            host = this.get('host');

        // Prevent anything else from being done and hide our dialogue.
        e.preventDefault();
        this.getDialogue({
            focusAfterHide: null
        }).hide();

        // Obtain the pasted content.
        value = this._iframe.getHTML();

        // Figure out which option is checked.
        checked = Y.one('input[name=from]:checked');

        // If they put something in there, let's handle it based on where it's from.
        if (value !== '') {
            if(checked.hasClass(CSS.PASTEFROMWORD)) {
                value = this._handleWord(value);
            }
            else if(checked.hasClass(CSS.PASTEFROMGDOC)) {
                value = this._handleGDoc(value);
            }
            else if(checked.hasClass(CSS.PASTEFROMLIBRE)) {
                value = this._handleLibre(value);
            }
            else if(checked.hasClass(CSS.PASTEFROMOTHER)) {
                value = this._handleOther(value);
            }
            else {
                value = this._handleUnformatted(value);
            }

            // If they had not selected anything in the editor, paste the content at their cursor.
            if(this._currentSelection === false) {
                this.editor.focus();
                this.editor.append(value);
            }
            // Instead, replace the selected content.
            else {
                host.setSelection(this._currentSelection);
                host.insertContentAtFocusPoint(value);
            }
            this.markUpdated();
        }
    },

    /**
     * Obtain the HTML for the Dialogue and prepare handlers
     *
     * @method _getDialogueContent
     * @return HTML dialogue box
     */
    _getDialogueContent: function() {
        var template = Y.Handlebars.compile(TEMPLATE);

        // Set the HTML content.
        this._content = Y.Node.create(template({
            component: COMPONENTNAME,
            CSS: CSS
        }));

        // Set the click handler for the submit button.
        this._content.one('.submit').on('click', this._pasteContent, this);

        // Return the HTML of the dialogue box.
        return this._content;
    },

    /**
     * Handle the text coming from Microsoft Word
     *
     * @method _handleWord
     * @param String text The text pasted in the iframe
     * @return String handled text to paste
     */
    _handleWord: function(text) {
        return this._findTags(text, 'word');
    },

    /**
     * Handle the text coming from Google Documents
     *
     * @method _handleGDoc
     * @param String text The text pasted in the iframe
     * @return String handled text to paste
     */
    _handleGDoc: function(text) {
        return this._findTags(text, 'gdoc');
    },

    /**
     * Handle the tags of the pasted text
     *
     * @method _findTags
     * @param String text The text pasted in the iframe
     * @param String origin From where the text was pasted
     * @return String Cleaned HTML text
     */
    _findTags: function(text, origin) {
        var output = '',
            first,
            second,
            last;

        while(true) {
            if(text === '') {
                break;
            }
            first = text.indexOf('<');
            second = text.indexOf('<', first+1);
            last = text.indexOf('>');
            // Make sure that there is no inline < added.
            output += text.substring(0, first);
            if(last < second) {
                // Found the first tag, now what?
                if(text.substring(first, last+1) === '<br>'
                    || text.substring(first, last+13) === '<o:p>&nbsp;</o:p>') {
                    // A nice clean line break.
                    output += '<br>';
                    text = text.substring(last+1, text.length);
                }
                else if(text.substring(first, last+7) === '<o:p></o:p>'
                        || text.substring(first + 1, first + 6) === '/font') {
                    // Weird thing word does for end of line, skip it.
                    output = output;
                    text = text.substring(last+1, text.length);
                }
                else if(text.substring(first + 1, first + 5) === 'font') {
                    // Woaw, found a weird font tag, must be Libre.
                    output = this._handleFont(text.substring(first, last+1), output, text, origin);
                    text = text.substring(text.indexOf('</font>') + 7, text.length);
                }
                else {
                    // It's a tag we want to handle, so let's handle it.
                    output += this._handleTags(text.substring(first, last+1), origin);
                    text = text.substring(last+1, text.length);
                }
            }
            else if(second !== -1){
                // Somebody put in a plain character.
                output += '<';
                text = text.substring(first+1, text.length);
            }
            else {
                // No more tags, let's step out.
                output += text;
                break;
            }
        }

        // Clean up that messy stuff.
        output = this._cleanOutput(output);

        return output;
    },

    /**
     * Handle the text imported from Libre
     *
     * @method _handleLibre
     * @param String text The text from the iframe
     * @return String The cleaned up text to be imported
     */
    _handleLibre: function(text) {
        return this._findTags(text, 'libre');
    },

    /**
     * Handle the text imported from Other
     *
     * @method _handleLibre
     * @param String text The text from the iframe
     * @return String The cleaned up text to be imported
     */
    _handleOther: function(text) {
        return this._findTags(text, 'other');
    },

    /**
     * Handle the text imported from anywhere
     *
     * @method _handleUnformatted
     * @param String text The text to be cleaned
     * @return String The text that has been stripped of tags
     */
    _handleUnformatted: function(text) {
        var output;

        output = this._stripTags(text);

        return output;
    },

    /**
     * Handle the <font> tags from Libre
     *
     * @method _handleFont
     * @param String text The content within the font tag
     * @param String current The current handled text to be output
     * @param String incoming The text that we are still handling
     * @param String origin From where the text was pasted
     * @return String Formatted text
     */
     _handleFont: function(text, current, incoming, origin) {
        var output = '',
            face,
            styleStart,
            noBreaks,
            first = 0,
            second = 0,
            tagStart,
            tagEnd;

        tagStart = incoming.indexOf('<font');
        tagEnd = incoming.indexOf('>', tagStart);

        // Get rid of pesky spaces and line breaks.
        // Only for comparison.
        noBreaks = current.replace(/\s+g/, '');
        noBreaks = noBreaks.replace(/(\r\n|\n|\r)/gm,"");
        // This only ever happens in LibreOffice, so specific reference.
        face = text.indexOf('face="');
        styleStart = text.indexOf('style="');

        // Check to see if the tag has style within it, handle appropriately.
        if(styleStart !== -1) {
            output += this._handleStyle(text.substring(styleStart + 7, text.indexOf('"', styleStart + 7)), origin);
        }

        // If there is styling AND font-face, add semicolon between styles.
        if(styleStart !== -1 && face !== -1) {
            output += ';';
        }

        // If there is font-face in the tag, add it to the styling to be output.
        if(face !== -1) {
            output += 'font-family:' + text.substring(face + 6, text.indexOf('"', face + 7));
        }

        // See if previous tag has a style attribute.
        if(noBreaks[noBreaks.length-1] !== '>') {
            // Something's weird, let's alert the user and step out of this.
            current = '<span style="' + output + '">' + incoming.substring(tagEnd + 1, incoming.indexOf('</font>')) + '</span>';
            return current;
        }
        else if(noBreaks[noBreaks.length-2] !== '"') {
            // Empty tag preceeding, add as style.
            while(true) {
                first = current.indexOf('>', second + 1);
                second = current.indexOf('>', first + 1);
                if(second === -1) {
                    break;
                }
            }
            newString = current.substring(0, first) + ' style="' + output + '">';
        }
        else if(noBreaks[noBreaks.length-2] === '"') {
            // Found a previous style, let's compound on it.
            while(true) {
                first = current.indexOf('">', second + 1);
                second = current.indexOf('">', first + 1);
                if(second === -1) {
                    break;
                }
            }
            newString = current.substring(0, first) + ';' + output + '">';
        }

        return newString;
    },

    /**
     * Handle the content within the tags
     *
     * @method _handleTags
     * @param String text The text contained within the HTML tags
     * @param String origin From where the text is being pasted
     * @return String Properly formatted tag for importing
     */
    _handleTags: function(text, origin) {
        var tag = text.substring(1, text.indexOf(' ')),
            styleStart,
            styleEnd,
            additional = '',
            output = '',
            styles = '';

        // If there are no spaces in the tag, it's a plain tag.
        if(text.indexOf(' ') === -1) {
            tag = text.substring(1, text.indexOf('>'));
        }

        // Weird hack for Microsoft Word.
        if(origin === 'word' && tag.substring(0, 3) === '!--') {
            return '';
        }

        // Let's see if there are any styles.
        styleStart = text.indexOf('style="') + 7;
        styleEnd = text.indexOf('"', styleStart);
        if(text.indexOf(' ') !== -1) {
            styles = this._handleStyle(text.substring(styleStart, styleEnd), origin);
        }

        // Anything else?
        if(text.indexOf(' ') !== -1) {
            additional = text.substring(text.indexOf(' '), text.length-1);
            additional = this._handleAdditional(additional);
        }

        if(text.substring(0, 2) === '</') {
            // Closing tags have nothing we need to handle.
            // Close the tag and be done.
            return text;
        }
        // Alright, which tag is it?
        else if(tag === 'span') {
            output += '<span';
        }
        else if(tag.substring(0, 1) === 'h') {
            output += '<h' + tag[1];
        }
        else if(tag === 'div') {
            output += '<div';
        }
        else if(tag === 'ul') {
            output += '<ul';
        }
        else if(tag === 'ol') {
            output += '<ol';
        }
        else if(tag === 'li') {
            output += '<li';
        }
        else if(tag === 'b') {
            output += '<b';
        }
        else if(tag === 'i') {
            output += '<i';
        }
        else if(tag === 'u') {
            output += '<u';
        }
        else {
            // What's the worst that could happen? Let's go with <p>.
            output += '<p';
        }

        // Add spaces in from of styling information if present.
        if(styles !== '') {
            styles = ' style="' + styles + '"';
        }
        if(additional !== '') {
            additional = ' ' + additional;
        }

        // Put it ALL together.
        output += additional + styles + '>';

        return output;
    },

    /**
     * Handle additional information in the HTML tags
     *
     * @param String text The additional information within the tag
     * @return String formatted and handled version of the string
     */
    _handleAdditional: function(text) {
        // Only handling:
        // align
        var output = '',
            start,
            end;

        start = text.indexOf('align="');
        end = text.indexOf('"', start + 8);

        if(start !== -1) {
            output = text.substring(start, end + 1);
        }

        return output;
    },

    /**
     * Clean the HTML tags of the output
     *
     * @param String text The text to clean prior to output
     * @return String Cleaned text to be output
     */
    _cleanOutput: function(text) {
        var span,
            badSpan,
            front,
            end;

        while(true) {
            // Remove all spans without style.
            span = text.indexOf('<span>');
            if(span !== -1) {
                front = text.substring(0, span);
                end = text.substring(span + 6, text.length);
                end.replace('</span>', '');
                text = front + end;
            }
            else {
                break;
            }
            // Any <tag><span style="">text</span></tag>
            // will become <tag style=""></tag>.
            badSpan = text.indexOf('><span');
            if (text.substring(badSpan - 6, 7) !== '</span>') {
                front = text.substring(0, badSpan);
                end = text.substring(badSpan + 6, text.length);
                end.replace('</span>', '');
                if(front[front.length-1] === '"'
                    && end.substring(0, 8) === ' style="') {
                    text = front.substring(0, front.length-1) + end.substring(8, end.length);
                }
                else {
                    text = front + end;
                }
            }
        }

        return text;
    },

    /**
     * Handles the information within the style of an HTML tag
     *
     * @param String style The text within the style informaiton
     * @param String origin From where the text was pasted
     * @return String The style information that we desire to keep
     */
    _handleStyle: function(style, origin) {
        var option,
            value,
            output = '',
            comparison,
            clean = '';

        // Where are we bringing this information in from?
        if(origin === 'gdoc') {
            comparison = this._gdocStyle;
        }
        else if(origin === 'libre') {
            comparison = this._libreStyle;
        }
        else if(origin === 'word') {
            comparison = this._wordStyle;
        }
        else {
            comparison = this._otherStyle;
        }

        // Strip the spaces for the CSS options.
        // Keep the spaces for the values.
        clean = style.replace(/\s+/g, '');
        clean = clean.replace(/&quot;/g, '\'');
        style = style.replace(/&quot;/g, '\'');

        // Loops through the styles, and decides whether or not to keep them.
        while(true) {
            // Obtain the property to evaluate
            option = clean.substring(0, clean.indexOf(':'));
            if(style.indexOf(';') !== -1) {
                value = style.substring(style.indexOf(':') + 1, style.indexOf(';'));
            }
            else {
                // We are at the last CSS entry, and it does not end with ;
                // For SHAME!
                value = style.substring(style.indexOf(':') + 1, style.length);
            }
            // What options do we care about?
            if(comparison.indexOf(option) !== -1) {
                if(value !== 'initial'
                && value !== 'inherit'
                && value !== 'normal'
                && value !== 'tansparent') {
                    output += option + ':' + value + ';';
                }
            }
            if(style.indexOf(';') === -1) {
                // We just looked at the last style
                break;
            }
            style = style.substring(style.indexOf(';') + 1, style.length);
            clean = clean.substring(clean.indexOf(';') + 1, clean.length);
        }

        return output;
    },

    /**
     * Strips all of the HTML tags and replaces them with <p>
     *
     * @param String text The HTML text to be stripped
     * @return String Text that contains only <p> tags
     */
    _stripTags: function(text) {
        var raw,
            first,
            second,
            last;

        // Start it all off with a clean p tag
        raw = '<p>';

        while(true) {
            first = text.indexOf('<');
            second = text.indexOf('<', first+1);
            last = text.indexOf('>');
            if(first === -1
                || second === -1) {
                // We found no tags, let's step out
                break;
            }
            else if(last < second) {
                // We found a tag, what's inside?
                raw += text.substring(0, first);
                if(text.substring(first, first+7) !== '</span>'
                    && text[first+1] === '/'
                    && raw.substring(raw.length-4, raw.length) !== '</p>') {
                    // It's not a span and we have an open tag
                    // Let's close out and start a new tag
                    raw += '</p><p>';
                }
                if(last === text.length-1) {
                    // We are at the end of the text
                    break;
                }
                if(text.substring(first, last+1) === '<br>') {
                    // A nice clean break
                    raw += '<br>';
                }
                text = text.substring(last+1, text.length);
            }
            else {
                // Somebody put '<' in as a character
                raw += text.substring(0, second);
                text = text.substring(second, text.length);
            }
        }
        if(raw.substring(raw.length-3, raw.length) === '<p>') {
            return raw.substring(0, raw.length-3);
        }
        else {
            return raw;
        }
    }
});
