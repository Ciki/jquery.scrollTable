/*
 * scrollTable - jQuery scrollable table plugin
 *
 * Copyright (c) 2015 Matus Matula
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.github.com/Ciki/scrollTable
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
			var $body = $table.find('tbody'),
					$bodyRows = $body.find('tr'),
					$trFirst = $bodyRows.eq(0),
					$bodyCells = $trFirst.children(),
					numberOfCells = $bodyCells.length,
					$headCells = $table.find('thead tr').children(),
					tableW = parseInt($table.css('width')),
					cellWidthAdjustment = 0, // int, how many pixels needs to be added to every cell to fill whole row
					scrollbarWidth = 20; // int, in pixels

			// is tbody scrollable?
			var bodyContentH = 0;
			$bodyRows.each(function () {
				bodyContentH += $(this).height();
			});
			var isBodyScrollable = $body.height() < bodyContentH;

			//reset cell widths so widthDiff can be reliably computed
			$headCells.width('auto');
			$bodyCells.width('auto');

			// width difference between $table & $trFirst used to adjust cell widths to fit 100% table width
			var widthDiff = tableW - parseInt($trFirst.css('width'));
			if (widthDiff) {
				cellWidthAdjustment = Math.floor(widthDiff / numberOfCells);
			}

			// Set the width of thead & tbody columns
			var totalTdW = 0;
			$bodyCells.each(function (i, v) {
				var $td = $(v),
						tdW = parseInt($td.css('width')),
						tdNewW = 0,
						thNewW = 0;
				// compute width for last cell to fill whole row
				if (i === numberOfCells - 1) {
					tdNewW =
							thNewW = tableW - totalTdW;
					// subtract scrollbarWidth from td:last width if isBodyScrollable
					if (isBodyScrollable) {
						tdNewW -= scrollbarWidth;
					}
				} else {
					tdNewW =
							thNewW = tdW + cellWidthAdjustment;
				}

				totalTdW += tdNewW;

				$td.css('width', tdNewW);
				$headCells.eq(i).css('width', thNewW);
			});
		});
	}

})(jQuery);