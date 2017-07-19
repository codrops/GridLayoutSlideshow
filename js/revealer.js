/**
 * revealer.js
 * 
 * http://www.codrops.com
 * 
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2017, Codrops
 * http://www.codrops.com
 */
{
	window.Revealer = class Revealer {
		constructor(el, options) {
			this.CONFIG = {
				hidden: false,
				color: '#fff'
			};
			Object.assign(this.CONFIG, options);

			this.DOM = {};
			this.DOM.item = el;
			this.layout();
		}
		layout() {
			this.allClasses = ['revealer--visible','revealer--right','revealer--left','revealer--top','revealer--bottom','revealer--showX','revealer--showY','revealer--hideX','revealer--hideY'];

			this.revealerEl = document.createElement('div');
			this.revealerEl.className = 'revealer';
			this.revealerEl.style.backgroundColor = this.CONFIG.color;
			this.DOM.item.appendChild(this.revealerEl);

			if ( this.CONFIG.hidden ) {
				this.revealerEl.classList.add('revealer--visible');
			}
		}
		show(animation) {
			return this.toggle(animation, 'show');
		}
		hide(animation) {
			return this.toggle(animation, 'hide');
		}
		toggle(animationOpts, action) {
			return new Promise((resolve, reject) => {
				if ( animationOpts ) {
					this.animate(animationOpts, action);
					this.revealerEl.addEventListener('animationend', resolve);
				}
				else {
					this.revealerEl.classList.remove(...this.allClasses);
					this.revealerEl.classList.add('revealer--visible');
					resolve();
				}
			});
		}
		showFilled(animation) {
			return new Promise((resolve, reject) => {
				this.hide();
				animation.target = this.DOM.item;
				animation.target.style.visibility = 'hidden';
				this.animate(animation, 'hide');

				let completefn = () => {
					animation.target.removeEventListener('animationend', completefn);
					animation.target = this.revealerEl;
					this.animate(animation, 'show');
					animation.target.addEventListener('animationend', (ev) => {
						if ( ev.target === animation.target ) {
							resolve();
						}
					});
				};
				animation.target.addEventListener('animationend', completefn);
			});
		}
		hideFilled(animation) {
			return new Promise((resolve, reject) => {
				this.animate(animation, 'hide');

				let completefn = () => {
					this.revealerEl.removeEventListener('animationend', completefn);
					animation.target = this.DOM.item;
					this.animate(animation, 'show');
					animation.target.addEventListener('animationend', (ev) => {
						if ( ev.target === animation.target ) {
							resolve();
						}
					});
				};
				this.revealerEl.addEventListener('animationend', completefn);
			});
		}
		animate(animationOpts, action) {
			setTimeout(() => {
				const target = animationOpts.target || this.revealerEl;
				target.style.visibility = 'visible';
				target.classList.remove(...this.allClasses);

				let dirClass = 'revealer--right'; 
				let orientation = 'h';

				if ( animationOpts.direction === 'rtl' ) {
					dirClass = action === 'hide' ? 'revealer--right' : 'revealer--left';
					orientation = 'h';
				}
				else if ( animationOpts.direction === 'ltr' ) {
					dirClass = action === 'hide' ? 'revealer--left' : 'revealer--right';
					orientation = 'h';
				}
				else if ( animationOpts.direction === 'ttb' ) {
					dirClass = action === 'hide' ? 'revealer--top' : 'revealer--bottom';
					orientation = 'v';
				}
				else if ( animationOpts.direction === 'btt' ) {
					dirClass = action === 'hide' ? 'revealer--bottom' : 'revealer--top';
					orientation = 'v';
				}
				target.classList.add(dirClass, orientation === 'h' ? `revealer--${action}X` : `revealer--${action}Y`);
			}, animationOpts.delay || 0);
		}
	};
};