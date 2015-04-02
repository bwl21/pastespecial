YUI.add('moodle-atto_pastespecial-button', function (Y, NAME) {

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
            '<div id="{{elementid}}_{{CSS.IFRAME}}" class="{{CSS.IFRAME}}"></div>' +
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

    _content: null,

    _iframe: null,

    _gdocStyle: null,

    _libreStyle: null,

    _wordStyle: null,

    _otherStyle: null,

    _currentSelection: null,

    initializer: function(params) {
        //Pull in the settings if they are not empty
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
        //Add the button
        this.addButton({
            icon: 'e/paste',
            callback: this._displayDialogue
        });
    },

    _displayDialogue: function() {
        var dialogue = this.getDialogue({
            headerContent: M.util.get_string('pluginname', COMPONENTNAME),
            focusAfterHide: true,
            focusOnShowSelector: SELECTORS.PASTEAREA
        });

        this._currentSelection = this.get('host').getSelection();

        dialogue.set('bodyContent', this._getDialogueContent());

        dialogue.show();

        this._iframe = this._addIframe(Y.one(SELECTORS.IFRAME));
    },

    _pasteContent: function(e) {
        var value,
            checked,
            host = this.get('host');

        e.preventDefault();
        this.getDialogue({
            focusAfterHide: null
        }).hide();

        value = this._iframe.one('body').getHTML();

        checked = Y.one('input[name=from]:checked');

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

            if(this._currentSelection === false) {
                this.editor.focus();
                this.editor.append(value);
            }
            else {
                host.setSelection(this._currentSelection);
                host.insertContentAtFocusPoint(value);
            }
            this.markUpdated();
        }
    },

    _getDialogueContent: function() {
        var template = Y.Handlebars.compile(TEMPLATE);

        this._content = Y.Node.create(template({
            component: COMPONENTNAME,
            CSS: CSS
        }));

        this._content.one('.submit').on('click', this._pasteContent, this);

        return this._content;
    },

    _addIframe: function(container) {
        container.setHTML('<iframe id="' + CSS.IFRAME + '" src="javascript:\'\';" frameBorder="0" style="border: 1px solid gray"></iframe>');
        var ifr = Y.one(SELECTORS.IFRAMEID);
        var doc = ifr.get('contentWindow.document');

        doc.designMode = 'on';
        doc.one('body').setAttribute('contenteditable', 'true');
        doc.one('body').focus();

        return doc;
    },

    _handleWord: function(text) {
        return this._findTags(text, 'word');
    },

    _handleGDoc: function(text) {
        return this._findTags(text, 'gdoc');
    },

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
            //Various properties will exist in style="", what do we keep?
            output += text.substring(0, first);
            if(last < second) {
                //Found the first tag, now what?
                if(text.substring(first, last+1) === '<br>'
                    || text.substring(first, last+13) === '<o:p>&nbsp;</o:p>') {
                    //A nice clean line break
                    output += '<br>';
                }
                else if(text.substring(first, last+7) === '<o:p></o:p>') {
                    //Weird thing word does for end of line, skip it
                    output = output;
                }
                else if(text.substring(first + 1, first + 5) === 'font') {
                    //Woaw, found a weird font tag, must be Libre
                    output = this._handleFont(text.substring(first, last+1), output, origin);
                }
                else if(text.substring(first + 1, first + 6) !== '/font') {
                    //It's a tag we want to handle, so let's handle it
                    output += this._handleTags(text.substring(first, last+1), origin);
                }
                text = text.substring(last+1, text.length);
            }
            else if(second !== -1){
                //Somebody put in a plain character
                output += '<';
                text = text.substring(first+1, text.length);
            }
            else {
                output += text;
                break;
            }
        }

        //Clean up that messy stuff
        output = this._cleanOutput(output);

        return output;
    },

    _handleLibre: function(text) {
        return this._findTags(text, 'libre');
    },

    _handleOther: function(text) {
        return this._findTags(text, 'other');
    },

    _handleUnformatted: function(text) {
        var output;

        output = this._stripTags(text);

        return output;
    },

    _handleFont: function(text, current, origin) {
        var output = '',
            face,
            styleStart,
            noBreaks,
            first = 0,
            second = 0;

        //Get rid of pesky spaces and line breaks
        //Only for comparison
        noBreaks = current.replace(/\s+g/, '');
        noBreaks = noBreaks.replace(/(\r\n|\n|\r)/gm,"");
        //This only ever happens in LibreOffice, so specific reference
        face = text.indexOf('face="');
        styleStart = text.indexOf('style="');

        if(styleStart !== -1) {
            output += this._handleStyle(text.substring(styleStart + 7, text.indexOf('"', styleStart + 7)), origin);
        }

        if(styleStart !== -1 && face !== -1) {
            output += ';';
        }

        if(face !== -1) {
            output += 'font-family:' + text.substring(face + 6, text.indexOf('"', face + 7));
        }

        //See if previous tag has a style attribute
        if(noBreaks[noBreaks.length-1] !== '>') {
            //Something's weird, let's alert the user and step out of this
            alert('Found inline font change. Please wrap desired font in: <span style="' + output + '">Your text here</span>');
            return current;
        }
        else if(noBreaks[noBreaks.length-2] !== '"') {
            //Empty tag preceeding, add as style
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
            //Found a previous style, let's compound on it
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

    _handleTags: function(text, origin) {
        var tag = text.substring(1, text.indexOf(' ')),
            styleStart,
            styleEnd,
            additional = '',
            output = '',
            styles = '';

        //If there are no spaces in the tag, it's a plain tag
        //But which tag?
        if(text.indexOf(' ') === -1) {
            tag = text.substring(1, text.indexOf('>'));
        }

        if(origin === 'word' && tag.substring(0, 3) === '!--') {
            return '';
        }

        //Let's see if there are any styles
        styleStart = text.indexOf('style="') + 7;
        styleEnd = text.indexOf('"', styleStart);
        if(text.indexOf(' ') !== -1) {
            styles = this._handleStyle(text.substring(styleStart, styleEnd), origin);
        }

        //Anything else?
        if(text.indexOf(' ') !== -1) {
            additional = text.substring(text.indexOf(' '), text.length-1);
            additional = this._handleAdditional(additional);
        }

        if(text.substring(0, 2) === '</') {
            //Closing tags have nothing we need to handle
            //Close the tag and be done
            return text;
        }
        //Alright, which tag is it?
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
            //What's the worst that could happen? Let's go with <p>
            output += '<p';
        }

        //Add spaces in from of styling information if present
        if(styles !== '') {
            styles = ' style="' + styles + '"';
        }
        if(additional !== '') {
            additional = ' ' + additional;
        }

        //Put it ALL together
        output += additional + styles + '>';

        return output;
    },

    _handleAdditional: function(text) {
        //Only handling:
        //align
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

    _cleanOutput: function(text) {
        var span,
            badSpan,
            front,
            end;

        while(true) {
            //Remove all spans without style
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
            //Any <tag><span style="">text</span></tag>
            //will become <tag style=""></tag>
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

    _handleStyle: function(style, origin) {
        var option,
            value,
            output = '',
            comparison,
            clean = '';

        //Where are we bringing this information in from?
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

        //Strip the spaces for the CSS options
        //Keep the spaces for the values
        clean = style.replace(/\s+/g, '');
        clean = clean.replace(/&quot;/g, '\'');
        style = style.replace(/&quot;/g, '\'');

        //Loops through the styles, and decides whether or not to keep them
        while(true) {
            option = clean.substring(0, clean.indexOf(':'));
            if(style.indexOf(';') !== -1) {
                value = style.substring(style.indexOf(':') + 1, style.indexOf(';'));
            }
            else {
                value = style.substring(style.indexOf(':') + 1, style.length);
            }
            //What options do we care about?
            if(comparison.indexOf(option) !== -1) {
                if(value !== 'initial'
                && value !== 'inherit'
                && value !== 'normal'
                && value !== 'tansparent') {
                    output += option + ':' + value + ';';
                }
            }
            if(style.indexOf(';') === -1) {
                //We just looked at the last style
                break;
            }
            style = style.substring(style.indexOf(';') + 1, style.length);
            clean = clean.substring(clean.indexOf(';') + 1, clean.length);
        }

        return output;
    },

    _stripTags: function(text) {
        var raw,
            first,
            second,
            last;

        //Start it all off with a clean p tag
        raw = '<p>';

        while(true) {
            first = text.indexOf('<');
            second = text.indexOf('<', first+1);
            last = text.indexOf('>');
            if(first === -1
                || second === -1) {
                //We found no tags, let's step out
                break;
            }
            else if(last < second) {
                //We found a tag, what's inside?
                raw += text.substring(0, first);
                if(text.substring(first, first+7) !== '</span>'
                    && text[first+1] === '/'
                    && raw.substring(raw.length-4, raw.length) !== '</p>') {
                    //It's not a span and we have an open tag
                    //Let's close out and start a new tag
                    raw += '</p><p>';
                }
                if(last === text.length-1) {
                    //We are at the end of the text
                    break;
                }
                if(text.substring(first, last+1) === '<br>') {
                    //A nice clean break
                    raw += '<br>';
                }
                text = text.substring(last+1, text.length);
            }
            else {
                //Somebody put '<' in as a character
                raw += text.substring(0, second);
                text = text.substring(second, text.length);
            }
        }

        return raw.substring(0, raw.length-3);
    }
});


}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
