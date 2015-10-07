# Validation
Super lightweight zero dependency optionally asynchronous JavaScript form validation framework (phew!).

A lot of JavaScript form validation frameworks aim to validate any and every possible set of input data. For example, all types of numeric input (ranges, phone numbers), string input (email addresses), ect.

This framework does not take that approach, rather it aims at separating common form based events (input, blur, change, submit, ...) from functions that validate input data along with functions to process side effects on that data.

An arbitrary number of form inputs can be validated that require asynchronous validation (ex. AJAX) while avoiding race conditions and callback hell.

The API is 100% js based, DOM attributes are not used to validate data. There is support for rendering validation messages against form inputs with templates (see examples).

More documentation can be found in the doc/ directory. Work in Progress (see Todo).

## Setup
Clone or 'npm install' this repository.

```sh
git clone https://github.com/DerekCuevas/Validation.git
```

```sh
npm install git+https://github.com/DerekCuevas/Validation.git
```

Require with commonJS (Node / browserify) or include directly via a script tag.

```javascript
var Validation = require('Validation');
```

```html
<script src="Validation.js"></script>
```

## Basic use

```javascript

// create a new instance
var particle = new Validation({
    name: 'particle',
    on: 'input',
    templates: {
        success: '<p class="success">{{status}}</p>',
        error: '<p class="error">{{status}}</p>'
    }
});

// attach a delegate
particle.delegate({

    // specify a lifecycle object for each input in the form
    color: {
        init: function (input) {
            input.focus();

            // using the lifecycle object to cache DOM nodes
            this.input = input;
            this.colorPreview = document.getElementById('color-preview');

            this.input.style.width = '100%';
            this.colorPreview.style.display = 'none';
        },
        validate: function (color, callback) {
            var valid = /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(color);

            if (color.length === 0) {
                callback(false, 'The color is required.');
            } else if (!valid) {
                callback(false, 'The color entered is an invalid hex color.');
            } else {
                callback(true, 'The color looks good.');
            }
        },
        whenValid: function (color) {
            this.input.style.width = '85%';
            this.colorPreview.style.display = 'inline';
            this.colorPreview.style.backgroundColor = color;
        },
        whenInvalid: function () {
            this.input.style.width = '100%';
            this.colorPreview.style.display = 'none';
        },
        transform: function (color) {
            if (color.length === 0) {
                return color;
            }
            if (color.indexOf('#') !== 0) {
                return '#' + color;
            }
            return color;
        }
    },
    ...
});

particle.on('submit', function (e) {
    e.preventDefault();

    particle.validateAll(function (valid) {
        if (valid) {
            draw(particle.values());
        }
    });
});
```

## Examples
Examples of the form validation can be found in /examples. There are two examples, a particle editor (/particle) and a sign up form (/signup).

## To do
- documentation work
- consider rewriting in es6 w/babel
- make rendering templates optional
- better status-message support / cache status-message ref (re-work this)
- add getState / setState methods

## Ideas
- allow multiple placeholder values on templates

template: '<div>{{msg}}{{status}}{{other}}</div>'
callback({
    valid: true/false,
    render: {
        msg: '',
        status: '',
        other: '',
        ...
    }
});
