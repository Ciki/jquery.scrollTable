/*
 * scrollTable - jQuery scrollable table plugin
 *
 * Copyright (c) 2015 Matus Matula
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.github.com/Ciki/jquery.scrollTable
 *
 * Usage:
 *  $('.table-scrollable').scrollTable();
 *
 *	you can also specify preferred width on th elements
 *	using html attribute width or inline style like:
 *	<th width="100"> or <th style="width:100px">
 *
 *	This plugin stores some data on html elements
 *	using dataset with prefix `jst` === jquery scroll table
 *
 */

/**
 * Version 1.0
 *
 *
 * @name  scrollTable
 * @type  jQuery
 * @usage $('.table-scrollable').scrollTable();
 */

(function ($) {
	$.fn.scrollTable = function (options)
	{
		var $tables = this;

		// adjust the width of cells when window resizes
		$(window).resize(function () {
			_makeTablesScrollable($tables);
		}).resize(); // trigger resize handler

		// enable jQuery chain
		return this;
	};


	function _makeTablesScrollable($tables) {
		$tables.each(function (i, table) {
			var $table = $(table);
			var $tbody = $table.find('tbody'),
					tbodyW = parseInt($tbody.css('width')),
					$tbodyRows = $tbody.find('tr'),
					$trFirst = $tbodyRows.eq(0),
					$tbodyCells = $trFirst.children(),
					numberOfCells = $tbodyCells.length, // number of columns
					numberOfModifiableWidthCells = numberOfCells, // number of columns with no preferred width defined
					isInitialized = $table.data('jstInitialized') || false, // has scrollTable been initialized?
					$theadCells = $table.find('thead tr').children(),
					cellWidthAdjustment = 0, // int, how many pixels needs to be added to every cell to fill whole row
					scrollbarWidth = 20; // int, in pixels

			// initialize => set preferred widths if present
			if (!isInitialized) {
				$theadCells.each(function () {
					var $el = $(this);
					var preferredWidth = parseInt($el.prop('style').width || $el.attr('width'));
					if (preferredWidth) {
						numberOfModifiableWidthCells--;
					}
					$el.data('jstPreferredWidth', preferredWidth);
				});
				$table.data('jstInitialized', true);
				$table.data('jstModifiableWidthColumnsNumber', numberOfModifiableWidthCells);
			} else {
				numberOfModifiableWidthCells = $table.data('jstModifiableWidthColumnsNumber');
			}


			// is tbody scrollable?
			var bodyContentH = 0;
			$tbodyRows.each(function () {
				bodyContentH += $(this).height();
			});
			var isBodyScrollable = $tbody.height() < bodyContentH;


			// reset both theady & tbody cell widths so widthDiff can be reliably computed
			// use preferredWidth if specified, defaults to 'auto'
			$tbodyCells.each(function (i, v) {
				var $td = $(v),
						$th = $theadCells.eq(i),
						thPreferredW = $th.data('jstPreferredWidth'),
						w = thPreferredW || 'auto';
				$th.css('width', w);
				$td.css('width', w);
			});


			// compute width difference between tbody & first row,
			// used to adjust cell widths to fit 100% table width
			var widthDiff = tbodyW - parseInt($trFirst.css('width'));
			if (widthDiff) {
				cellWidthAdjustment = Math.floor(widthDiff / numberOfModifiableWidthCells);
			}


			// Set the width of thead & tbody columns
			var totalTdW = 0;
			$tbodyCells.each(function (i, v) {
				var $td = $(v),
						tdW = parseInt($td.css('width')),
						$th = $theadCells.eq(i),
						thPreferredW = $th.data('jstPreferredWidth'),
						tdNewW = 0,
						thNewW = 0;

				// compute width for last cell to fill whole row
				if (i === numberOfCells - 1) {
					if (thPreferredW) {
						tdNewW = thNewW = thPreferredW;
					} else {
						tdNewW = thNewW = tbodyW - totalTdW;
					}
					// subtract scrollbarWidth from td:last width if isBodyScrollable
					if (isBodyScrollable) {
						tdNewW -= scrollbarWidth;
					}
				} else {
					if (thPreferredW) {
						tdNewW = thNewW = thPreferredW;

					} else {
						tdNewW = thNewW = tdW + cellWidthAdjustment;
					}
				}

				totalTdW += tdNewW;

				$td.css('width', tdNewW);
				$th.css('width', thNewW);
			});
		});
	}

})(jQuery);