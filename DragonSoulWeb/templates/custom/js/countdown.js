(function (factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    } else {
        factory(jQuery);
    }
})(function ($) {

    "use strict";

    var Countdown = function (element, options) {
        this.$element = $(element);
        this.defaults = $.extend({}, Countdown.defaults, this.$element.data(), $.isPlainObject(options) ? options : {});
        this.init();
    };

    Countdown.prototype = {
        constructor: Countdown,

        init: function () {
            var content = this.$element.html(),
                date = new Date(this.defaults.date || content);

            if (date.getTime()) {
                this.content = content;
                this.date = date;
                this.find();

                if (this.defaults.autoStart) {
                    this.start();
                }
            }
        },

        find: function () {
            var $element = this.$element;

            this.$days = $element.find("[data-days]");
            this.$hours = $element.find("[data-hours]");
            this.$minutes = $element.find("[data-minutes]");
            this.$seconds = $element.find("[data-seconds]");
            this.$daysLabel = $element.find("[data-days-label]");
            this.$hoursLabel = $element.find("[data-hours-label]");

            this.found = (this.$days.length + this.$hours.length + this.$minutes.length + this.$seconds.length) > 0;
        },

        reset: function () {
            if (this.found) {
                this.output("days");
                this.output(this.hours < 10 ? "hours10" : "hours");
                this.output(this.minutes < 10 ? "minutes10" : "minutes");
                this.output(this.seconds < 10 ? "seconds10" : "seconds");

                this.output(this.days === 1 ? "daysLabel1" : "daysLabel");
                this.output(this.hours === 1 ? "hoursLabel1" : "hoursLabel");
            } else {
                this.output();
            }
        },

        ready: function () {
            var date = this.date,
                decisecond = 100,
                second = 1000,
                minute = 60000,
                hour = 3600000,
                day = 86400000,
                remainder = {},
                diff;

            if (!date) {
                return false;
            }

            diff = date.getTime() - new Date().getTime();

            if (diff <= 0) {
                this.end();
                return false;
            }

            remainder.days = diff;
            remainder.hours = remainder.days % day;
            remainder.minutes = remainder.hours % hour;
            remainder.seconds = remainder.minutes % minute;
            remainder.milliseconds = remainder.seconds % second;

            this.days = Math.floor(remainder.days / day);
            this.hours = Math.floor(remainder.hours / hour);
            this.minutes = Math.floor(remainder.minutes / minute);
            this.seconds = Math.floor(remainder.seconds / second);
            this.deciseconds = Math.floor(remainder.milliseconds / decisecond);

            return true;
        },

        start: function () {
            if (!this.active && this.ready()) {
                this.active = true;
                this.reset();
                this.autoUpdate = this.defaults.fast ?
                    setInterval($.proxy(this.fastUpdate, this), 100) :
                    setInterval($.proxy(this.update, this), 1000);
            }
        },

        stop: function () {
            if (this.active) {
                this.active = false;
                clearInterval(this.autoUpdate);
            }
        },

        end: function () {
            if (!this.date) {
                return;
            }

            this.stop();

            this.days = 0;
            this.hours = 0;
            this.minutes = 0;
            this.seconds = 0;
            this.deciseconds = 0;
            this.reset();
            this.defaults.end();

            $(".logo").fireworks();
        },

        destroy: function () {
            if (!this.date) {
                return;
            }

            this.stop();

            this.$days = null;
            this.$hours = null;
            this.$minutes = null;
            this.$seconds = null;
            this.$daysLabel = null;
            this.$hoursLabel = null;

            this.$element.empty().html(this.content);
            this.$element.removeData("countdown");
        },

        fastUpdate: function () {
            if (--this.deciseconds >= 0) {
                this.output("deciseconds");
            } else {
                this.deciseconds = 9;
                this.update();
            }
        },

        update: function () {
            if (--this.seconds >= 0) {
                this.output(this.seconds < 10 ? "seconds10" : "seconds");
            } else {
                this.seconds = 59;
                this.output("seconds");
                if (--this.minutes >= 0) {
                    this.output(this.minutes < 10 ? "minutes10" : "minutes");
                } else {
                    this.minutes = 59;
                    this.output("minutes");
                    if (--this.hours >= 0) {
                        this.output(this.hours < 10 ? "hours10" : "hours");
                    } else {
                        this.hours = 23;
                        this.output("hours");
                        if (--this.days >= 0) {
                            this.output("days");
                        } else {
                            this.end();
                        }
                    }
                }
            }

            this.output(this.hours === 1 ? "hoursLabel1" : "hoursLabel");
            this.output(this.days === 1 ? "daysLabel1" : "daysLabel");
        },

        output: function (type) {
            if (!this.found) {
                this.$element.empty().html(this.template());
                return;
            }

            switch (type) {
                case "deciseconds":
                    this.$seconds.text(this.getSecondsText());
                    break;
                case "seconds10":
                    this.$seconds.text("0" + this.seconds);
                    break;
                case "seconds":
                    this.$seconds.text(this.seconds);
                    break;
                case "minutes10":
                    this.$minutes.text("0" + this.minutes);
                    break;
                case "minutes":
                    this.$minutes.text(this.minutes);
                    break;
                case "hours10":
                    this.$hours.text("0" + this.hours);
                    break;
                case "hours":
                    this.$hours.text(this.hours);
                    break;
                case "days":
                    this.$days.text(this.days);
                    break;
                case "daysLabel1":
                    this.$daysLabel.text("DAY");
                    break;
                case "daysLabel":
                    this.$daysLabel.text("DAYS");
                    break;
                case "hoursLabel1":
                    this.$hoursLabel.text("HOUR");
                    break;
                case "hoursLabel":
                    this.$hoursLabel.text("HOURS");
                    break;
            }
        },

        template: function () {
            return this.defaults.text
                .replace("%s", this.days)
                .replace("%s", this.hours)
                .replace("%s", this.minutes)
                .replace("%s", this.getSecondsText());
        },

        getSecondsText: function () {
            return this.active && this.defaults.fast ? (this.seconds + "." + this.deciseconds) : this.seconds;
        }
    };

    Countdown.defaults = {
        autoStart: true,
        date: null,
        fast: false,
        end: $.noop,
        text: "%s days, %s hours, %s minutes, %s seconds"
    };

    Countdown.setDefaults = function (options) {
        $.extend(Countdown.defaults, options);
    };

    $.fn.countdown = function (options) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data("countdown");

            if (!data) {
                $this.data("countdown", (data = new Countdown(this, options)));
            }

            if (typeof options === "string" && $.isFunction(data[options])) {
                data[options]();
            }
        });
    };

    $.fn.countdown.constructor = Countdown;
    $.fn.countdown.setDefaults = Countdown.setDefaults;

    $(function () {
        $("[countdown]").countdown();
    });

    document.addEventListener("DOMContentLoaded", function () {
        const countdownContainer = document.querySelector('.countdown-container');
        const endDate = new Date(countdownContainer.getAttribute('data-date')).getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = endDate - now;

            if (distance < 0) {
                countdownContainer.innerHTML = "<div style='font-size: 22px; color: #f4b7fb;'>Countdown Finished!</div>";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownContainer.querySelector('[data-days]').textContent = days;
            countdownContainer.querySelector('[data-hours]').textContent = hours < 10 ? '0' + hours : hours;
            countdownContainer.querySelector('[data-minutes]').textContent = minutes < 10 ? '0' + minutes : minutes;
            countdownContainer.querySelector('[data-seconds]').textContent = seconds < 10 ? '0' + seconds : seconds;
        };

        setInterval(updateCountdown, 1000);
    });

});
