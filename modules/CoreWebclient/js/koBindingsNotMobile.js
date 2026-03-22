'use strict';

var
	ko = require('knockout'),
	_ = require('underscore'),
	$ = require('jquery'),
	
	Utils = require('%PathToCoreWebclientModule%/js/utils/Common.js'),
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	Browser = require('%PathToCoreWebclientModule%/js/Browser.js'),
	Storage = require('%PathToCoreWebclientModule%/js/Storage.js'),
	Splitter = require('%PathToCoreWebclientModule%/js/vendors/split.js')
;

require('jquery-ui/ui/widgets/droppable');
require('jquery-ui/ui/widgets/draggable');
require('jquery-ui/ui/widgets/autocomplete');
require('%PathToCoreWebclientModule%/js/vendors/customscroll.js');
require('%PathToCoreWebclientModule%/js/autocomplete.js');

ko.bindingHandlers.splitterFlex = {
	'valiateStorageData': function (aData, aDefaultValue) {
		if ((!_.isArray(aData) || _.contains(aData, 0) || _.contains(aData, null) ||  _.contains(aData, NaN)) && _.isArray(aDefaultValue))
		{
			aData = aDefaultValue;
		}
		return aData;
	},
	'init': function (oElement, fValueAccessor) {
		_.defer(function() {
			//https://nathancahill.github.io/Split.js/
			var
				oCommand = Object.assign({
					minSize : 200,
					sizes: [20, 80],
					storagePrefix: ''
				}, fValueAccessor()),
				storageKey = `${oCommand['storagePrefix']}resizer-width`,
				aInitSizes = ko.bindingHandlers.splitterFlex.valiateStorageData(Storage.getData(storageKey), oCommand['sizes']),
				gutterCallback = function (i, gutterDirection) {
					var elGutter = document.createElement('div');
					elGutter.appendChild(document.createElement('div'));
					elGutter.className = "gutter gutter-" + gutterDirection;
					return elGutter;
				},
				oSplitter = null,
				aElements = [].slice.call(oElement.children),
				oSplitterParams = {
					minSize: oCommand['minSize'],
					gutterSize: 0,
					gutter: gutterCallback,
					onDragEnd: function () {
						Storage.setData(storageKey, oSplitter.getSizes());
						if (oCommand.expandSecondPaneWidth) {
							oCommand.expandSecondPaneWidth(false);
						}
						if (oCommand.expandThirdPaneWidth) {
							oCommand.expandThirdPaneWidth(false);
						}
					}
				}
			;
			
			if (_.isArray(aInitSizes))
			{
				oSplitterParams['sizes'] = aInitSizes;
			}
			if (oCommand['direction'] && oCommand['direction'] === 'vertical') {
				oSplitterParams['direction'] = 'vertical';
			}

			oSplitter = Splitter(aElements, oSplitterParams);
			
			
			function _setPrevSizes()
			{
				var
					secondPaneExpanded = oCommand.expandSecondPaneWidth && oCommand.expandSecondPaneWidth(),
					thirdPaneExpanded = oCommand.expandThirdPaneWidth && oCommand.expandThirdPaneWidth()
				;
				if (!secondPaneExpanded && !thirdPaneExpanded) {
					var aPrevSizes = Storage.getData(storageKey);
					if (_.isArray(aPrevSizes)) {
						oSplitter.setSizes(aPrevSizes);
					}
				}
			}
			var collapsedPercent = 1;
			if (oCommand.expandSecondPaneWidth) {
				oCommand.expandSecondPaneWidth.subscribe(function () {
					if (oCommand.expandThirdPaneWidth) {
						oCommand.expandThirdPaneWidth(false);
					}

					var aSizes = oSplitter.getSizes();
					if (oCommand.expandSecondPaneWidth()) {
						oSplitter.setSizes([aSizes[0], 100 - collapsedPercent - aSizes[0], collapsedPercent]);
					} else {
						_setPrevSizes();
					}
				});
			}
			if (oCommand.expandThirdPaneWidth) {
				oCommand.expandThirdPaneWidth.subscribe(function () {
					if (oCommand.expandSecondPaneWidth) {
						oCommand.expandSecondPaneWidth(false);
					}

					var aSizes = oSplitter.getSizes();
					if (oCommand.expandThirdPaneWidth()) {
						oSplitter.setSizes([aSizes[0], collapsedPercent, 100 - collapsedPercent - aSizes[0]]);
					} else {
						_setPrevSizes();
					}
				});
			}
		});
	}
};

ko.bindingHandlers.customScrollbar = {
	'init': function (oElement, fValueAccessor, fAllBindingsAccessor, oViewModel) {
		var
			jqElement = $(oElement),
			oCommand = _.defaults(fValueAccessor(), {
				'oScroll' : null,
				'scrollToTopTrigger': null,
				'scrollToBottomTrigger': null,
				'scrollTo': null

			}),
			oScroll = null
		;

		oCommand = /** @type {{scrollToTopTrigger:{subscribe:Function},scrollToBottomTrigger:{subscribe:Function},scrollTo:{subscribe:Function},reset:Function}}*/ oCommand;

		jqElement.addClass('scroll-wrap').customscroll(oCommand);
		oScroll = jqElement.data('customscroll');

		if (oCommand['oScroll'] && _.isFunction(oCommand['oScroll'].subscribe))
		{		
			oCommand['oScroll'](oScroll);
		}
		else
		{
			oCommand['oScroll'] = oScroll;
		}

		if (!oCommand.reset)
		{
			oElement._customscroll_reset = _.throttle(function () {
				oScroll.reset();
			}, 100);
		}
		
		if (oCommand['scrollToTopTrigger'] && _.isFunction(oCommand.scrollToTopTrigger.subscribe)) {
			oCommand.scrollToTopTrigger.subscribe(function () {
				if (oScroll) {
					oScroll['scrollToTop']();
				}
			});
		}
		
		if (oCommand['scrollToBottomTrigger'] && _.isFunction(oCommand.scrollToBottomTrigger.subscribe))
		{
			oCommand.scrollToBottomTrigger.subscribe(function () {
				if (oScroll)
				{
					oScroll['scrollToBottom']();
				}
			});
		}

		if (oCommand['scrollTo'] && _.isFunction(oCommand.scrollTo.subscribe))
		{
			oCommand.scrollTo.subscribe(function ()
			{
				if (oScroll)
				{
					oScroll['scrollTo'](oCommand.scrollTo());
				}
			});
		}
	},
	
	'update': function (oElement, fValueAccessor, fAllBindingsAccessor, oViewModel, bindingContext) {
		if (oElement._customscroll_reset)
		{
			oElement._customscroll_reset();
		}
		if (fValueAccessor().top)
		{
			$(oElement).data('customscroll')['vertical'].set(fValueAccessor().top);
		}
	}
};

function removeActiveFocus()
{
	if (document && document.activeElement && document.activeElement.blur)
	{
		var oA = $(document.activeElement);
		if (oA.is('input') || oA.is('textarea'))
		{
			document.activeElement.blur();
		}
	}
}

ko.bindingHandlers.draggable = {
	'init': function (oElement, fValueAccessor) {
		$(oElement).attr('draggable', ko.utils.unwrapObservable(fValueAccessor()));
	}
};

ko.bindingHandlers.draggablePlace = {
	'update': function (oElement, fValueAccessor, fAllBindingsAccessor, oViewModel, bindingContext) {
		if (fValueAccessor() === null)
		{
			if ($(oElement).draggable())
			{
				$(oElement).draggable('destroy');
			}
			return null;
		}

		var oAllBindingsAccessor = fAllBindingsAccessor ? fAllBindingsAccessor() : null;
		$(oElement).draggable({
			'distance': 20,
			'handle': '.dragHandle',
			'cursorAt': {'top': 0, 'left': 0},
			'helper': function (oEvent) {
				var
					isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0,
					ctrlOrCmdUsed = isMac ? oEvent.metaKey : oEvent.ctrlKey
				;
				if (isMac && oEvent.ctrlKey) {
					return $('<span></span>');
				}
				return fValueAccessor().apply(oViewModel, oEvent && oEvent.target ? [ko.dataFor(oEvent.target), ctrlOrCmdUsed] : null);
			},
			'start': (oAllBindingsAccessor && oAllBindingsAccessor['draggableDragStartCallback']) ? oAllBindingsAccessor['draggableDragStartCallback'] : function () {},
			'stop': (oAllBindingsAccessor && oAllBindingsAccessor['draggableDragStopCallback']) ? oAllBindingsAccessor['draggableDragStopCallback'] : function () {}
		}).on('mousedown', function () {
			removeActiveFocus();
		});
	}
};

ko.bindingHandlers.droppable = {
	'update': function (oElement, fValueAccessor) {
		var
			oOptions = fValueAccessor(),
			fValueFunc = oOptions.valueFunc,
			fSwitchObserv = oOptions.switchObserv
		;
		if (!_.isFunction(fValueFunc))
		{
			if ($(oElement).droppable())
			{
				$(oElement).droppable('destroy');
			}
			return;
		}
		
		$(oElement).droppable({
			'hoverClass': 'droppableHover',
			'drop': function (oEvent, oUi) {
				fValueFunc(oEvent, oUi);
			}
		});

		if (ko.isObservable(fSwitchObserv)) {
			const checkDropEnabled = function (bDroppable) {
				if($(oElement).data().uiDroppable) {
					$(oElement).droppable(bDroppable ? 'disable' : 'enable');
				}
			}
			fSwitchObserv.subscribe(checkDropEnabled, this);
			checkDropEnabled(fSwitchObserv());
		}
	}
};

ko.bindingHandlers.quickReplyAnim = {
	'update': function (oElement, fValueAccessor, fAllBindingsAccessor, oViewModel, bindingContext) {

		var
			jqTextarea = oElement.jqTextarea || null,
			jqStatus = oElement.jqStatus || null,
			jqButtons = oElement.jqButtons || null,
			jqElement = oElement.jqElement || null,
			oPrevActions = oElement.oPrevActions || null,
			values = fValueAccessor(),
			oActions = null
		;

		oActions = _.defaults(
			values, {
				'saveAction': false,
				'sendAction': false,
				'activeAction': false
			}
		);

		if (!jqElement)
		{
			oElement.jqElement = jqElement = $(oElement);
			oElement.jqTextarea = jqTextarea = jqElement.find('textarea');
			oElement.jqStatus = jqStatus = jqElement.find('.status');
			oElement.jqButtons = jqButtons = jqElement.find('.buttons');
			
			oElement.oPrevActions = oPrevActions = {
				'saveAction': null,
				'sendAction': null,
				'activeAction': null
			};
		}

		if (true || jqElement.is(':visible'))
		{
			if (Browser.ie9AndBelow)
			{
				if (jqTextarea && !jqElement.defualtHeight && !jqTextarea.defualtHeight)
				{
					jqElement.defualtHeight = jqElement.outerHeight();
					jqTextarea.defualtHeight = jqTextarea.outerHeight();
					jqStatus.defualtHeight = jqButtons.outerHeight();
					jqButtons.defualtHeight = jqButtons.outerHeight();
				}

				_.defer(function () {
					var 
						activeChanged = oPrevActions.activeAction !== oActions['activeAction'],
						sendChanged = oPrevActions.sendAction !== oActions['sendAction'],
						saveChanged = oPrevActions.saveAction !== oActions['saveAction']
					;

					if (activeChanged)
					{
						if (oActions['activeAction'])
						{
							jqTextarea.animate({
								'height': jqTextarea.defualtHeight + 50
							}, 300);
							jqElement.animate({
								'max-height': jqElement.defualtHeight + jqButtons.defualtHeight + 50
							}, 300);
						}
						else
						{
							jqTextarea.animate({
								'height': jqTextarea.defualtHeight
							}, 300);
							jqElement.animate({
								'max-height': jqElement.defualtHeight
							}, 300);
						}
					}

					if (sendChanged || saveChanged)
					{
						if (oActions['sendAction'])
						{
							jqElement.animate({
								'max-height': '30px'
							}, 300);
							jqStatus.animate({
								'max-height': '30px',
								'opacity': 1
							}, 300);
						}
						else if (oActions['saveAction'])
						{
							jqElement.animate({
								'max-height': 0
							}, 300);
						}
						else
						{
							jqElement.animate({
								'max-height': jqElement.defualtHeight + jqButtons.defualtHeight + 50
							}, 300);
							jqStatus.animate({
								'max-height': 0,
								'opacity': 0
							}, 300);
						}
					}
				});
			}
			else
			{
				jqElement.toggleClass('saving', oActions['saveAction']);
				jqElement.toggleClass('sending', oActions['sendAction']);
				jqElement.toggleClass('active', oActions['activeAction']);
			}
		}

		_.defer(function () {
			oPrevActions = oActions;
		});
	}
};

ko.bindingHandlers.onCtrlEnter = {
	'init': function (oElement, fValueAccessor, fAllBindingsAccessor, oViewModel) {
		var $Element = $(oElement);
		$Element.on('keydown', function (oEvent) {
			if (oEvent.ctrlKey && oEvent.keyCode === Enums.Key.Enter)
			{
				$Element.trigger('change');
				fValueAccessor().call(oViewModel);
			}
		});
	}
};

ko.bindingHandlers.onEsc = {
	'init': function (oElement, fValueAccessor, fAllBindingsAccessor, oViewModel) {
		var $Element = $(oElement);
		$Element.on('keydown', function (oEvent) {
			if (oEvent.keyCode === Enums.Key.Esc)
			{
				$Element.trigger('change');
				fValueAccessor().call(oViewModel);
			}
		});
	}
};

ko.bindingHandlers.autocompleteSimple = {
	'init': function (oElement, fValueAccessor, fAllBindingsAccessor, oViewModel, bindingContext) {

		var
			jqEl = $(oElement),
			oOptions = fValueAccessor(),
			fCallback = oOptions['callback'],
			fDataAccessor = oOptions.dataAccessor ? oOptions.dataAccessor : Utils.emptyFunction(),
			fDelete = function () {
				fDeleteAccessor(oSelectedItem);
				var oAutocomplete = jqEl.data('customAutocomplete') || jqEl.data('uiAutocomplete') || jqEl.data('autocomplete') || jqEl.data('ui-autocomplete');
				$.ui.autocomplete.prototype.__response.call(oAutocomplete, _.filter(aSourceResponseItems, function (oItem) { return oItem.value !== oSelectedItem.value; }));
			},
			aSourceResponseItems = null,
			oSelectedItem = null
		;

		if (fCallback && jqEl && jqEl[0])
		{
			jqEl.autocomplete({
				'minLength': 1,
				'autoFocus': true,
				'position': {
					collision: "flip" //prevents the escape off the screen
				},
				'source': function (oRequest, fSourceResponse) {
					fCallback(oRequest, function (oItems) { //additional layer for story oItems
						aSourceResponseItems = oItems;
						fSourceResponse(oItems);
					});
				},
				'focus': function (oEvent, oItem) {
					if (!oItem.item || oItem.item.disabled)
					{
						return false;
					}
					else
					{
						oSelectedItem = oItem.item;
						return true;
					}
				},
				'open': function (oEvent, oItem) {
					$(jqEl.autocomplete('widget')).find('span.del').on('click', function(oEvent, oItem) {
						Utils.calmEvent(oEvent);
						fDelete();
					});
				},
				'select': function (oEvent, oItem) {
					if (!oItem.item || oItem.item.disabled)
					{
						return false;
					}
					else
					{
						_.delay(function () {
							jqEl.trigger('change');
						}, 5);
						fDataAccessor(oItem.item);

						return true;
					}
				}
			}).on('click', function(oEvent, oItem) {
				if (jqEl.val() === '')
				{
					if (!$(jqEl.autocomplete('widget')).is(':visible'))
					{
						jqEl.autocomplete("option", "minLength", 0); //for triggering search on empty field
						jqEl.autocomplete("search");
						jqEl.autocomplete("option", "minLength", 1);
					}
					else
					{
						jqEl.autocomplete("close");
					}
				}
			}).on('keydown', function(oEvent, oItem) {
				if (aSourceResponseItems && oSelectedItem && !oSelectedItem.global && oEvent.keyCode === Enums.Key.Del && oEvent.shiftKey) //shift+del on suggestions list
				{
					Utils.calmEvent(oEvent);
					fDelete();
				}
			});
			var oAutocomplete = jqEl.data('customAutocomplete') || jqEl.data('uiAutocomplete') || jqEl.data('autocomplete') || jqEl.data('ui-autocomplete');
			if (oAutocomplete)
			{
				if (_.isFunction(oOptions.renderItem))
				{
					oAutocomplete._renderItem = oOptions.renderItem;
				}
				oAutocomplete._resizeMenu = function () {
					var oUl = this.menu.element;
					oUl.outerWidth(this.element.outerWidth());
				};
			}
			jqEl.autocomplete('widget').addClass('autocomplete-simple');
		}
	}
};

ko.bindingHandlers.customSelect = {
	'init': function (oElement, fValueAccessor, fAllBindingsAccessor, oViewModel) {
		var
			jqElement = $(oElement),
			oCommand = _.defaults(
				fValueAccessor(), {
					'disabled': 'disabled',
					'selected': 'selected',
					'expand': 'expand',
					'control': true,
					'input': false,
					'expandState': function () {},
					'options': [],
					'optionsValue': 'value',
					'optionsText': 'text',
					'timeOptions': null,
				}
			),
			aOptions = [],
			oControl = oCommand['control'] ? jqElement.find('.control') : jqElement,
			oContainer = jqElement.find('.dropdown_content'),
			oText = jqElement.find('.link'),

			updateField = function (value) {
				const options = ko.isObservable(oCommand['options']) ? oCommand['options']() : oCommand['options'];

				_.each(aOptions, function (item) {
					item.removeClass(oCommand['selected']);
				});
				var item = _.find(options, function (item) {
					return item[oCommand['optionsValue']] === value;
				});
				if (!item) {
					item = options[0];
				} else {
					aOptions[_.indexOf(options, item)].addClass(oCommand['selected']);
					oText.text(TextUtils.trim(item[oCommand['optionsText']]));
				}
				return item[oCommand['optionsValue']];
			},
			updateList = function () {
				oContainer.empty();
				aOptions = [];

				_.each(ko.isObservable(oCommand['options']) ? oCommand['options']() : oCommand['options'], function (item) {
					var
						oOption = $('<span class="item"></span>')
							.text(item[oCommand['optionsText']])
							.data('value', item[oCommand['optionsValue']])
					;

					oOption.data('isDisabled', item['isDisabled']).toggleClass('disabled', !!item['isDisabled']);

					aOptions.push(oOption);
					oContainer.append(oOption);
				}, this);
			}
		;

		updateList();

		oContainer.on('click', '.item', function () {
			var jqItem = $(this);

			if(!jqItem.data('isDisabled')) {
				oCommand['value'](jqItem.data('value'));
			}
		});

		if (ko.isObservable(oCommand['value'])) {
			oCommand['value'].subscribe(function () {
				const mValue = updateField(oCommand['value']());
				if (!oCommand['input'] && oCommand['value']() !== mValue) {
					oCommand['value'](mValue);
				}
			}, oViewModel);

			oCommand['value'].valueHasMutated();
		}
		
		if (ko.isObservable(oCommand['options'])) {
			oCommand['options'].subscribe(function () {
				updateList();
			}, oViewModel);
		}

		//TODO fix data-bind click
		jqElement.removeClass(oCommand['expand']);

		oControl.on('click', function () {
			if (!jqElement.hasClass(oCommand['disabled'])) {
				jqElement.toggleClass(oCommand['expand']);
				oCommand['expandState'](jqElement.hasClass(oCommand['expand']));

				if (jqElement.hasClass(oCommand['expand'])) {
					var
						jqContent = jqElement.find('.dropdown_content'),
						jqSelected = jqContent.find('.selected')
					;

					if (jqSelected.position()) {
						jqContent.scrollTop(0);// need for proper calculation position().top
						jqContent.scrollTop(jqSelected.position().top - 100);// 100 - hardcoded indent to the element in pixels
					}

					_.defer(function () {
						$(document).one('click', function () {
							jqElement.removeClass(oCommand['expand']);
							oCommand['expandState'](false);
						});
					});
				}
			}
		});
	}
};
