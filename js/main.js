"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw a.code = "MODULE_NOT_FOUND", a;
        }

        var p = n[i] = {
          exports: {}
        };
        e[i][0].call(p.exports, function (r) {
          var n = e[i][1][r];
          return o(n || r);
        }, p, p.exports, r, e, n, t);
      }

      return n[i].exports;
    }

    for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
      o(t[i]);
    }

    return o;
  }

  return r;
})()({
  1: [function (require, module, exports) {
    // src/esmjs/carousel3d.js
    var noop = function noop() {};

    module.exports = {
      name: 'carousel3d',
      props: {
        count: {
          type: [Number, String],
          default: 0
        },
        perspective: {
          type: [Number, String],
          default: 35
        },
        display: {
          type: [Number, String],
          default: 3
        },
        loop: {
          type: Boolean,
          default: true
        },
        animationSpeed: {
          type: [Number, String],
          default: 500
        },
        dir: {
          type: String,
          default: 'rtl'
        },
        width: {
          type: [Number, String],
          default: 360
        },
        height: {
          type: [Number, String],
          default: 270
        },
        border: {
          type: [Number, String],
          default: 1
        },
        space: {
          type: [Number, String],
          default: 'auto'
        },
        startIndex: {
          type: [Number, String],
          default: 0
        },
        clickable: {
          type: Boolean,
          default: true
        },
        disable3d: {
          type: Boolean,
          default: false
        },
        minSwipeDistance: {
          type: Number,
          default: 10
        },
        inverseScaling: {
          type: [Number, String],
          default: 300
        },
        controlsVisible: {
          type: Boolean,
          default: false
        },
        controlsPrevHtml: {
          type: String,
          default: '&lsaquo;'
        },
        controlsNextHtml: {
          type: String,
          default: '&rsaquo;'
        },
        controlsWidth: {
          type: [String, Number],
          default: 50
        },
        controlsHeight: {
          type: [String, Number],
          default: 50
        },
        onLastSlide: {
          type: Function,
          default: noop
        },
        onSlideChange: {
          type: Function,
          default: noop
        },
        bias: {
          type: String,
          default: 'left'
        },
        onMainSlideClick: {
          type: Function,
          default: noop
        }
      },
      data: function data() {
        return {
          viewport: 0,
          currentIndex: 0,
          total: 0,
          dragOffset: 0,
          dragStartX: 0,
          mousedown: false,
          zIndex: 998
        };
      },
      computed: {
        isLastSlide: function isLastSlide() {
          return this.currentIndex === this.total - 1;
        },
        isFirstSlide: function isFirstSlide() {
          return this.currentIndex === 0;
        },
        isNextPossible: function isNextPossible() {
          return !(!this.loop && this.isLastSlide);
        },
        isPrevPossible: function isPrevPossible() {
          return !(!this.loop && this.isFirstSlide);
        },
        slideWidth: function slideWidth() {
          var vw = this.viewport;
          var sw = parseInt(this.width) + parseInt(this.border, 10) * 2;
          return vw < sw ? vw : sw;
        },
        slideHeight: function slideHeight() {
          var sw = parseInt(this.width, 10) + parseInt(this.border, 10) * 2;
          var sh = parseInt(parseInt(this.height) + this.border * 2, 10);
          var ar = this.calculateAspectRatio(sw, sh);
          return this.slideWidth / ar;
        },
        visible: function visible() {
          var v = this.display > this.total ? this.total : this.display;
          return v;
        },
        hasHiddenSlides: function hasHiddenSlides() {
          return this.total > this.visible;
        },
        leftIndices: function leftIndices() {
          var n = (this.visible - 1) / 2;
          n = this.bias.toLowerCase() === 'left' ? Math.ceil(n) : Math.floor(n);
          var indices = [];

          for (var m = 1; m <= n; m++) {
            indices.push(this.dir === 'ltr' ? (this.currentIndex + m) % this.total : (this.currentIndex - m) % this.total);
          }

          return indices;
        },
        rightIndices: function rightIndices() {
          var n = (this.visible - 1) / 2;
          n = this.bias.toLowerCase() === 'right' ? Math.ceil(n) : Math.floor(n);
          var indices = [];

          for (var m = 1; m <= n; m++) {
            indices.push(this.dir === 'ltr' ? (this.currentIndex - m) % this.total : (this.currentIndex + m) % this.total);
          }

          return indices;
        },
        leftOutIndex: function leftOutIndex() {
          var n = (this.visible - 1) / 2;
          n = this.bias.toLowerCase() === 'left' ? Math.ceil(n) : Math.floor(n);
          n++;

          if (this.dir === 'ltr') {
            return this.total - this.currentIndex - n <= 0 ? -parseInt(this.total - this.currentIndex - n) : this.currentIndex + n;
          } else {
            return this.currentIndex - n;
          }
        },
        rightOutIndex: function rightOutIndex() {
          var n = (this.visible - 1) / 2;
          n = this.bias.toLowerCase() === 'right' ? Math.ceil(n) : Math.floor(n);
          n++;

          if (this.dir === 'ltr') {
            return this.currentIndex - n;
          } else {
            return this.total - this.currentIndex - n <= 0 ? -parseInt(this.total - this.currentIndex - n, 10) : this.currentIndex + n;
          }
        }
      },
      methods: {
        /**
         * Go to next slide
         */
        goNext: function goNext() {
          if (this.isNextPossible) {
            this.isLastSlide ? this.goSlide(0) : this.goSlide(this.currentIndex + 1);
          }
        },

        /**
         * Go to previous slide
         */
        goPrev: function goPrev() {
          if (this.isPrevPossible) {
            this.isFirstSlide ? this.goSlide(this.total - 1) : this.goSlide(this.currentIndex - 1);
          }
        },

        /**
         * Go to slide
         * @param  {String} index of slide where to go
         */
        goSlide: function goSlide(index) {
          var _this = this;

          this.currentIndex = index < 0 || index > this.total - 1 ? 0 : index;

          if (this.isLastSlide) {
            if (this.onLastSlide !== noop) {
              console.warn('onLastSlide deprecated, please use @last-slide');
            }

            this.onLastSlide(this.currentIndex);
            this.$emit('last-slide', this.currentIndex);
          }

          this.$emit('before-slide-change', this.currentIndex);
          setTimeout(function () {
            return _this.animationEnd();
          }, this.animationSpeed);
        },

        /**
         * Go to slide far slide
         */
        goFar: function goFar(index) {
          var _this2 = this;

          var diff = index === this.total - 1 && this.isFirstSlide ? -1 : index - this.currentIndex;

          if (this.isLastSlide && index === 0) {
            diff = 1;
          }

          var diff2 = diff < 0 ? -diff : diff;
          var timeBuff = 0;
          var i = 0;

          while (i < diff2) {
            i += 1;
            var timeout = diff2 === 1 ? 0 : timeBuff;
            setTimeout(function () {
              return diff < 0 ? _this2.goPrev(diff2) : _this2.goNext(diff2);
            }, timeout);
            timeBuff += this.animationSpeed / diff2;
          }
        },

        /**
         * Trigger actions when animation ends
         */
        animationEnd: function animationEnd() {
          if (this.onSlideChange !== noop) {
            console.warn('onSlideChange deprecated, please use @after-slide-change');
          }

          this.onSlideChange(this.currentIndex);
          this.$emit('after-slide-change', this.currentIndex);
        },

        /**
         * Trigger actions when mouse is released
         * @param  {Object} e The event object
         */
        handleMouseup: function handleMouseup() {
          this.mousedown = false;
          this.dragOffset = 0;
        },

        /**
         * Trigger actions when mouse is pressed
         * @param  {Object} e The event object
         */
        handleMousedown: function handleMousedown(e) {
          if (!e.touches) {
            e.preventDefault();
          }

          this.mousedown = true;
          this.dragStartX = 'ontouchstart' in window ? e.touches[0].clientX : e.clientX;
        },

        /**
         * Trigger actions when mouse is pressed and then moved (mouse drag)
         * @param  {Object} e The event object
         */
        handleMousemove: function handleMousemove(e) {
          if (!this.mousedown) {
            return;
          }

          var eventPosX = 'ontouchstart' in window ? e.touches[0].clientX : e.clientX;
          var deltaX = this.dragStartX - eventPosX;
          this.dragOffset = deltaX;

          if (this.dragOffset > this.minSwipeDistance) {
            this.handleMouseup();
            this.goPrev();
          } else if (this.dragOffset < -this.minSwipeDistance) {
            this.handleMouseup();
            this.goNext();
          }
        },

        /**
         * A mutation observer is used to detect changes to the containing node
         * in order to keep the magnet container in sync with the height its reference node.
         */
        attachMutationObserver: function attachMutationObserver() {
          var _this3 = this;

          var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

          if (MutationObserver) {
            var config = {
              attributes: true,
              childList: true,
              characterData: true
            };
            this.mutationObserver = new MutationObserver(function () {
              _this3.$nextTick(function () {
                _this3.computeData();
              });
            });

            if (this.$el) {
              this.mutationObserver.observe(this.$el, config);
            }
          }
        },

        /**
         * Stop listening to mutation changes
         */
        detachMutationObserver: function detachMutationObserver() {
          if (this.mutationObserver) {
            this.mutationObserver.disconnect();
          }
        },

        /**
         * Get the number of slides
         * @return {Number} Number of slides
         */
        getSlideCount: function getSlideCount() {
          if (this.$slots.default !== undefined) {
            return this.$slots.default.filter(function (value) {
              return value.tag !== void 0;
            }).length;
          }

          return 0;
        },

        /**
         * Calculate slide with and keep defined aspect ratio
         * @return {Number} Aspect ratio number
         */
        calculateAspectRatio: function calculateAspectRatio(width, height) {
          return Math.min(width / height);
        },

        /**
         * Re-compute the number of slides and current slide
         */
        computeData: function computeData(firstRun) {
          this.total = this.getSlideCount();

          if (firstRun || this.currentIndex >= this.total) {
            this.currentIndex = parseInt(this.startIndex) > this.total - 1 ? this.total - 1 : parseInt(this.startIndex);
          }

          this.viewport = this.$el.clientWidth;
        },
        setSize: function setSize() {
          this.$el.style.cssText += 'height:' + this.slideHeight + 'px;';
          this.$el.childNodes[0].style.cssText += 'width:' + this.slideWidth + 'px;' + ' height:' + this.slideHeight + 'px;';
        }
      },
      mounted: function mounted() {
        this.computeData(true);
        this.attachMutationObserver();

        if (!this.$isServer) {
          window.addEventListener('resize', this.setSize);

          if ('ontouchstart' in window) {
            this.$el.addEventListener('touchstart', this.handleMousedown);
            this.$el.addEventListener('touchend', this.handleMouseup);
            this.$el.addEventListener('touchmove', this.handleMousemove);
          } else {
            this.$el.addEventListener('mousedown', this.handleMousedown);
            this.$el.addEventListener('mouseup', this.handleMouseup);
            this.$el.addEventListener('mousemove', this.handleMousemove);
          }
        }
      },
      beforeDestroy: function beforeDestroy() {
        if (!this.$isServer) {
          this.detachMutationObserver();

          if ('ontouchstart' in window) {
            this.$el.removeEventListener('touchmove', this.handleMousemove);
          } else {
            this.$el.removeEventListener('mousemove', this.handleMousemove);
          }

          window.removeEventListener('resize', this.setSize);
        }
      },
      template: "\n    <div class=\"carousel-3d-container\" v-bind:style=\"{height: this.slideHeight + 'px'}\">\n      <div class=\"carousel-3d-slider\" v-bind:style=\"{width: this.slideWidth + 'px', height: this.slideHeight + 'px'}\">\n        <slot></slot>\n      </div>\n      <!-- slider controls -->\n      <div class=\"slider-controls text-center\">\n        <a class=\"button round-lemon-arr arr-prev js-prev-partner\" @click=\"goNext\">Prev</a>\n        <a class=\"button round-lemon-arr arr-next js-next-partner\" @click=\"goPrev\">Next</a>\n      </div>\n    </div>\n  "
    };
  }, {}],
  2: [function (require, module, exports) {
    // src/esmjs/main.js
    var partners = require('./partners.json');

    var Carousel3d = require('./carousel3d');

    var Slide = require('./slide');

    Vue.component('carousel3d', Carousel3d);
    Vue.component('slide', Slide);
    var states = {
      1160: {
        width: 330,
        height: 210,
        display: 3,
        space: 400
      },
      940: {
        width: 276,
        height: 176,
        display: 3,
        space: 323
      },
      520: {
        width: 330,
        height: 210,
        display: 1,
        space: 400
      },
      default: {
        width: 276,
        height: 176,
        display: 1,
        space: 323
      }
    };
    var partnersApp = new Vue({
      el: '#partners-carousel',
      data: {
        sizeParam: {
          width: 0,
          height: 0,
          display: 1,
          space: 0
        },
        partners: partners
      },
      methods: {
        setSize: function setSize() {
          console.log('switch size');
          var cw = this.$el.clientWidth;
          var curState = states[cw];

          _extends(this.sizeParam, curState || states.default);
        }
      },
      mounted: function mounted() {
        this.setSize();
        window.addEventListener('resize', this.setSize);
      },
      beforeDestroy: function beforeDestroy() {
        window.removeEventListener('resize', this.setSize);
      }
    });
  }, {
    "./carousel3d": 1,
    "./partners.json": 3,
    "./slide": 4
  }],
  3: [function (require, module, exports) {
    module.exports = [{
      "title": "Nord Gym",
      "subtitle": "Фитнесс-клуб",
      "discount": "45",
      "image": "images/clients/nord-gym.jpg"
    }, {
      "title": "BrainPro",
      "subtitle": "Клиника",
      "discount": "30",
      "image": "images/clients/brain-pro.jpg"
    }, {
      "title": "Sport",
      "subtitle": "Магазин спортивных товаров",
      "discount": "10",
      "image": "images/clients/sport.jpg"
    }, {
      "title": "Nord Gym",
      "subtitle": "Фитнесс-клуб",
      "discount": "45",
      "image": "images/clients/nord-gym.jpg"
    }, {
      "title": "BrainPro",
      "subtitle": "Клиника",
      "discount": "30",
      "image": "images/clients/brain-pro.jpg"
    }, {
      "title": "Sport",
      "subtitle": "Магазин спортивных товаров",
      "discount": "10",
      "image": "images/clients/sport.jpg"
    }];
  }, {}],
  4: [function (require, module, exports) {
    // src/esmjs/slide.js
    module.exports = {
      name: 'slide',
      props: {
        index: {
          type: Number,
          required: true
        }
      },
      data: function data() {
        return {
          parent: this.$parent,
          styles: {},
          zIndex: 999
        };
      },
      computed: {
        isCurrent: function isCurrent() {
          return this.index === this.parent.currentIndex;
        },
        leftIndex: function leftIndex() {
          return this.getSideIndex(this.parent.leftIndices);
        },
        rightIndex: function rightIndex() {
          return this.getSideIndex(this.parent.rightIndices);
        },
        slideStyle: function slideStyle() {
          var styles = {};

          if (!this.isCurrent) {
            var rIndex = this.leftIndex;
            var lIndex = this.rightIndex;

            if (rIndex >= 0 || lIndex >= 0) {
              styles = rIndex >= 0 ? this.calculatePosition(rIndex, true, this.zIndex) : this.calculatePosition(lIndex, false, this.zIndex);
              styles.opacity = 1;
              styles.visibility = 'visible';
            }

            if (this.parent.hasHiddenSlides) {
              if (this.matchIndex(this.parent.leftOutIndex)) {
                styles = this.calculatePosition(this.parent.leftIndices.length - 1, true, this.zIndex, 'hidden');
              } else if (this.matchIndex(this.parent.rightOutIndex)) {
                styles = this.calculatePosition(this.parent.rightIndices.length - 1, false, this.zIndex, 'hidden');
              }
            }
          }

          return _extends(styles, {
            'border-width': "".concat(this.parent.border, "px"),
            'width': "".concat(this.parent.slideWidth, "px"),
            'height': "".concat(this.parent.slideHeight, "px"),
            'transition': "\n          transform ".concat(this.parent.animationSpeed, "ms,\n          opacity ").concat(this.parent.animationSpeed, "ms,\n          visibility ").concat(this.parent.animationSpeed, "ms\n        ")
          });
        },
        computedClasses: function computedClasses() {
          var _ref;

          return _ref = {}, _defineProperty(_ref, "left-".concat(this.leftIndex + 1), this.leftIndex >= 0), _defineProperty(_ref, "right-".concat(this.rightIndex + 1), this.rightIndex >= 0), _defineProperty(_ref, "current", this.isCurrent), _ref;
        }
      },
      methods: {
        getSideIndex: function getSideIndex(array) {
          var _this4 = this;

          var index = -1;
          array.forEach(function (pos, i) {
            if (_this4.matchIndex(pos)) {
              index = i;
            }
          });
          return index;
        },
        matchIndex: function matchIndex(index) {
          return index >= 0 ? this.index === index : this.parent.total + index === this.index;
        },
        calculatePosition: function calculatePosition(i, positive, zIndex, visibility) {
          visibility = visibility || 'visible'; // visible by default

          var z = !this.parent.disable3d ? parseInt(this.parent.inverseScaling) + (i + 1) * 100 : 0;
          var y = !this.parent.disable3d ? parseInt(this.parent.perspective) : 0;
          var leftRemain = this.parent.space === 'auto' ? parseInt((i + 1) * (this.parent.width / 1.5), 10) : parseInt((i + 1) * this.parent.space, 10);
          var hiddenPw = visibility === 'hidden' ? 2 : 1;
          var transform = positive ? 'translateX(' + leftRemain * hiddenPw + 'px) translateZ(-' + z + 'px) ' + 'rotateY(-' + y + 'deg)' : 'translateX(-' + leftRemain * hiddenPw + 'px) translateZ(-' + z + 'px) ' + 'rotateY(' + y + 'deg)';
          var top = this.parent.space === 'auto' ? 0 : parseInt((i + 1) * this.parent.space);
          return {
            transform: transform,
            top: top,
            zIndex: zIndex - (Math.abs(i) + 1)
          };
        },
        goTo: function goTo() {
          if (!this.isCurrent) {
            if (this.parent.clickable === true) {
              this.parent.goFar(this.index);
            }
          } else {
            this.parent.onMainSlideClick();
          }
        }
      },
      template: "<div class=\"carousel-3d-slide\"\n    v-bind:style=\"slideStyle\"\n    v-bind:class=\"computedClasses\"\n    v-on:click=\"goTo\"\n  >\n    <slot\n      v-bind:index=\"index\"\n      v-bind:isCurrent=\"isCurrent\"\n      v-bind:leftIndex=\"leftIndex\"\n      v-bind:rightIndex=\"rightIndex\" />\n  </div>"
    };
  }, {}]
}, {}, [2]);