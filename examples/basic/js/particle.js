/**
 * Basic Aysnc form validation example.
 * Particle Editor.
 *
 * @author Derek Cuevas
 */

(function () {
    'use strict';

    var particles = document.getElementById('particles');
    var preview;

    var validateSize = function (size, min, max, name) {
        var ret = {};

        if (!size) {
            ret.valid = false;
            ret.message = 'The ' + name + ' is required.';
        } else if (size <= min) {
            ret.valid = false;
            ret.message = 'The ' + name + ' must be greater than ' + min + '.';
        } else if (size >= max) {
            ret.valid = false;
            ret.message = 'The ' + name + ' must be less than the current window size.';
        } else {
            ret.valid = true;
            ret.message = 'The ' + name + ' looks good.';
        }
        return ret;
    };

    var particle = new Validation({
        name: 'particle',
        on: 'input',
        templates: {
            success: 'template.success',
            error: 'template.error'
        }
    });

    particle.delegate({
        color: {
            init: function (input) {
                input.focus();

                // we can use the lifecycle object to cache DOM nodes
                this.color = input;
                this.colorPreview = document.getElementById('color-preview');

                this.color.style.width = '100%';
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
                this.color.style.width = '85%';
                this.colorPreview.style.display = 'inline';
                this.colorPreview.style.backgroundColor = color;
            },
            whenInvalid: function () {
                this.color.style.width = '100%';
                this.colorPreview.style.display = 'none';
            },
            transform: function (color) {
                if (color.indexOf('#') !== 0) {
                    return '#' + color;
                }
                return color;
            }
        },

        // FIXME: document.width / document.height no support in chrome
        radius: {
            validate: function (radius, callback) {
                var valid = validateSize(radius, 0, document.width / 2, 'radius');
                callback(valid.valid, valid.message);
            }
        },
        x: {
            validate: function (x, callback) {
                var valid = validateSize(x, -1, document.width, 'x position');
                callback(valid.valid, valid.message);
            }
        },
        y: {
            validate: function (y, callback) {
                var valid = validateSize(y, -1, document.height, 'y position');
                callback(valid.valid, valid.message);
            }
        }
    });

    var pixelize = function (size) {
        return size + 'px';
    };

    var draw = function (p) {
        var newParticle = document.createElement('div');

        newParticle.style.position = 'absolute';
        newParticle.style.borderRadius = pixelize(p.radius);

        newParticle.style.width = pixelize(p.radius * 2);
        newParticle.style.height = pixelize(p.radius * 2);

        newParticle.style.left = pixelize(p.x);
        newParticle.style.top = pixelize(p.y);
        newParticle.style.background = p.color;

        particles.appendChild(newParticle);
        return newParticle;
    };

    particle.on('change', function () {
        var valid = particle.isValid();
        var p = particle.values();

        if (valid) {
            if (preview) {
                particles.removeChild(preview);
            }
            preview = draw(p);
        }
    });

    particle.on('submit', function (e) {
        e.preventDefault();

        particle.validateAll(function (valid) {
            var p = particle.values();
            if (valid) {
                draw(p);
                particle.reset(true);
            }
        });
    });

    particle.on('reset', function () {
        if (preview) {
            particles.removeChild(preview);
            preview = undefined;
        }
        particle.reset();
    });
}());
