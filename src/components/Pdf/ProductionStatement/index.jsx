import { DEFAULT_FONT_SIZE, xMargin } from '@/components/Pdf/ui';
import { DEFAULT_A4_PAGE, getTable, TableHeader } from '@/components/Pdf/utils';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const node = [
	getTable('party_name', 'Party'),
	getTable('type', 'Type'),
	getTable('marketing', 'Team'),
	getTable('order_number', 'O/N'),
	getTable('order_qty', 'Ord.Qty'),
	getTable('item_description', 'Item'),
	getTable('size', 'Size'),
	getTable('running_total_close_end_quantity', 'C/E', 'right'),
	getTable('running_total_open_end_quantity', 'O/E', 'right'),
	getTable('running_total_quantity', 'Total Qty', 'right'),
	getTable('company_price_dzn', 'Price', 'right'),
	getTable('value', 'Value', 'right'),
];
export default function Index(data, from, to) {
	const headerHeight = 80;
	let footerHeight = 50;
	const PdfData = data || [];
	const title = [
		'Current Total',
		'Opening Bal.',
		'Closing Bal.',
		'P.Current Total',
		'P.Opening Bal.',
		'P.Closing Bal.',
	];
	const grandTotal = {
		current: {
			close_end_quantity: 0,
			open_end_quantity: 0,
			quantity: 0,
			value: 0,
		},
		closing: {
			close_end_quantity: 0,
			open_end_quantity: 0,
			quantity: 0,
			value: 0,
		},
		opening: {
			close_end_quantity: 0,
			open_end_quantity: 0,
			quantity: 0,
			value: 0,
		},
	};

	PdfData?.forEach((item) => {
		const partyTotal = {
			current: {
				close_end_quantity: 0,
				open_end_quantity: 0,
				quantity: 0,
				value: 0,
			},
			closing: {
				close_end_quantity: 0,
				open_end_quantity: 0,
				quantity: 0,
				value: 0,
			},
			opening: {
				close_end_quantity: 0,
				open_end_quantity: 0,
				quantity: 0,
				value: 0,
			},
		};

		item.orders?.forEach((orderItem, orderIndex) => {
			orderItem.items?.forEach((itemItem) => {
				const totalCloseEnd = itemItem.other?.reduce((total, item) => {
					return total + (item.running_total_close_end_quantity || 0);
				}, 0);

				partyTotal.current.close_end_quantity += totalCloseEnd;
				grandTotal.current.close_end_quantity += totalCloseEnd;
				const totalOpenEnd = itemItem.other?.reduce((total, item) => {
					return total + (item.running_total_open_end_quantity || 0);
				}, 0);
				partyTotal.current.open_end_quantity += totalOpenEnd;
				grandTotal.current.open_end_quantity += totalOpenEnd;
				const totalQuantity = itemItem.other?.reduce((total, item) => {
					return total + (item.running_total_quantity || 0);
				}, 0);

				partyTotal.current.quantity += totalQuantity;
				grandTotal.current.quantity += totalQuantity;
				const totalOpeningCloseEnd = itemItem.other?.reduce(
					(total, item) => {
						return (
							total + (item.opening_total_close_end_quantity || 0)
						);
					},
					0
				);

				partyTotal.opening.close_end_quantity += totalOpeningCloseEnd;
				grandTotal.opening.close_end_quantity += totalOpeningCloseEnd;
				const totalOpeningOpenEnd = itemItem.other?.reduce(
					(total, item) => {
						return (
							total + (item.opening_total_open_end_quantity || 0)
						);
					},
					0
				);

				partyTotal.opening.open_end_quantity += totalOpeningOpenEnd;
				grandTotal.opening.open_end_quantity += totalOpeningOpenEnd;
				const OpeningTotalQuantity = itemItem.other?.reduce(
					(total, item) => {
						return total + (item.opening_total_quantity || 0);
					},
					0
				);

				partyTotal.opening.quantity += OpeningTotalQuantity;
				grandTotal.opening.quantity += OpeningTotalQuantity;
				const totalClosingCloseEnd = itemItem.other?.reduce(
					(total, item) => {
						return (
							total + (item.closing_total_close_end_quantity || 0)
						);
					},
					0
				);
				partyTotal.closing.close_end_quantity += totalClosingCloseEnd;
				grandTotal.closing.close_end_quantity += totalClosingCloseEnd;
				const totalClosingOpenEnd = itemItem.other?.reduce(
					(total, item) => {
						return (
							total + (item.closing_total_open_end_quantity || 0)
						);
					},
					0
				);

				partyTotal.closing.open_end_quantity += totalClosingOpenEnd;
				grandTotal.closing.open_end_quantity += totalClosingOpenEnd;
				const CloseTotalQuantity = itemItem.other?.reduce(
					(total, item) => {
						return total + (item.closing_total_quantity || 0);
					},
					0
				);
				partyTotal.closing.quantity += CloseTotalQuantity;
				grandTotal.closing.quantity += CloseTotalQuantity;
				const totalValue = itemItem.other?.reduce((total, item) => {
					return (
						total +
						(itemItem.other?.reduce((total, item) => {
							return total + (item.running_total_value || 0);
						}, 0) || 0)
					);
				}, 0);
				partyTotal.current.value += totalValue;
				grandTotal.current.value += totalValue;
				const OpeningTotalValue = itemItem.other?.reduce(
					(total, item) => {
						return (
							total +
							(itemItem.other?.reduce((total, item) => {
								return total + (item.opening_total_value || 0);
							}, 0) || 0)
						);
					},
					0
				);

				partyTotal.opening.value += OpeningTotalValue;
				grandTotal.opening.value += OpeningTotalValue;
				const ClosingTotalValue = itemItem.other?.reduce(
					(total, item) => {
						return (
							total +
							(itemItem.other?.reduce((total, item) => {
								return total + (item.closing_total_value || 0);
							}, 0) || 0)
						);
					},
					0
				);
				partyTotal.closing.value += ClosingTotalValue;
				grandTotal.closing.value += ClosingTotalValue;
				itemItem.other.push({
					size: 'Current Total',
					running_total_close_end_quantity: totalCloseEnd,
					running_total_open_end_quantity: totalOpenEnd,
					running_total_quantity: totalQuantity,
					company_price_pcs: 1,
					running_total_value: totalValue,
				});
				itemItem.other.push({
					size: 'Opening Bal.',
					running_total_close_end_quantity: totalOpeningCloseEnd,
					running_total_open_end_quantity: totalOpeningOpenEnd,
					running_total_quantity: OpeningTotalQuantity,
					company_price_pcs: 1,
					running_total_value: OpeningTotalValue,
				});
				itemItem.other.push({
					size: 'Closing Bal.',
					running_total_close_end_quantity: totalClosingCloseEnd,
					running_total_open_end_quantity: totalClosingOpenEnd,
					running_total_quantity: CloseTotalQuantity,
					company_price_pcs: 1,
					running_total_value: ClosingTotalValue,
				});
				if (item.orders.length === orderIndex + 1) {
					itemItem.other.push({
						size: 'P.Current Total',
						running_total_close_end_quantity:
							partyTotal.current.close_end_quantity,
						running_total_open_end_quantity:
							partyTotal.current.open_end_quantity,
						running_total_quantity: partyTotal.current.quantity,
						company_price_pcs: 1,
						running_total_value: partyTotal.current.value,
					});

					itemItem.other.push({
						size: 'P.Opening Bal.',
						running_total_close_end_quantity:
							partyTotal.opening.close_end_quantity,
						running_total_open_end_quantity:
							partyTotal.opening.open_end_quantity,
						running_total_quantity: partyTotal.opening.quantity,
						company_price_pcs: 1,
						running_total_value: partyTotal.opening.value,
					});
					itemItem.other.push({
						size: 'P.Closing Bal.',
						running_total_close_end_quantity:
							partyTotal.closing.close_end_quantity,
						running_total_open_end_quantity:
							partyTotal.closing.open_end_quantity,
						running_total_quantity: partyTotal.closing.quantity,
						company_price_pcs: 1,
						running_total_value: partyTotal.closing.value,
					});
				}
			});
		});
	});

	const tableData = PdfData.flatMap((item) => {
		const typeRowSpan =
			item?.orders?.reduce((total, orders) => {
				return (
					total +
						orders.items?.reduce((itemTotal, item) => {
							return itemTotal + (item.other?.length || 1);
						}, 0) || 0
				);
			}, 0) || 0;

		return item?.orders?.flatMap((orderItem, orderIndex) => {
			const orderRowSpan =
				orderItem.items?.reduce((total, item) => {
					return total + (item.other?.length || 1);
				}, 0) || 0;

			return orderItem.items?.flatMap((itemItem, itemIndex) => {
				const itemRowSpan = itemItem.other?.length || 1;

				return itemItem.other?.map((otherItem) => ({
					party_name: {
						text: item.party_name,
						rowSpan: typeRowSpan,
					},
					type: {
						text: item.type,
						rowSpan: typeRowSpan,
					},
					marketing: {
						text: item.marketing_name,
						rowSpan: typeRowSpan,
					},
					order_number: {
						text: orderItem.order_number,
						rowSpan: orderRowSpan,
					},
					order_qty: {
						text: orderItem.total_quantity,
						rowSpan: orderRowSpan,
					},
					item_description: {
						text: itemItem.item_description,
						rowSpan: itemRowSpan,
					},
					size: {
						text: title.includes(otherItem.size)
							? otherItem.size
								? otherItem.size
								: '---'
							: `${otherItem.size.includes('-') ? `(${otherItem.size})` : otherItem.size} ${otherItem.unit}`,

						bold: title.includes(otherItem.size) ? true : false,
					},
					running_total_close_end_quantity: {
						text: otherItem.running_total_close_end_quantity,
						bold: title.includes(otherItem.size) ? true : false,
					},
					running_total_open_end_quantity: {
						text: otherItem.running_total_open_end_quantity,
						bold: title.includes(otherItem.size) ? true : false,
					},
					running_total_quantity: {
						text: otherItem.running_total_quantity,
						bold: title.includes(otherItem.size) ? true : false,
					},
					company_price_dzn: {
						text: otherItem.company_price_dzn
							? otherItem.company_price_dzn + '/DZN'
							: '---',
						bold: title.includes(otherItem.size) ? true : false,
					},
					value: {
						text: Number(otherItem.running_total_value).toFixed(3),
						bold: title.includes(otherItem.size) ? true : false,
					},
				}));
			});
		});
	});

	const pdfDocGenerator = pdfMake.createPdf({
		...DEFAULT_A4_PAGE({
			xMargin,
			headerHeight,
			footerHeight,
		}),
		pageOrientation: 'landscape',
		header: {
			table: getPageHeader(from, to),
			layout: 'noBorders',
			margin: [xMargin, 30, xMargin, 0],
		},
		footer: (currentPage, pageCount) => ({
			table: getPageFooter({
				currentPage,
				pageCount,
			}),
			margin: [xMargin, 2],
			fontSize: DEFAULT_FONT_SIZE - 2,
		}),
		content: [
			{
				table: {
					headerRows: 1,
					widths: [100, 40, 80, 50, 50, 70, 60, 45, 45, 45, 45, 45],
					body: [
						TableHeader(node),

						// Body
						...tableData?.map((item) =>
							node?.map((nodeItem) => {
								const cellData = nodeItem.field
									? item[nodeItem.field]
									: '---';
								return {
									text: cellData?.text || cellData,
									style: nodeItem.cellStyle,
									alignment: nodeItem.alignment,
									rowSpan: cellData?.rowSpan,
									colSpan: cellData?.colSpan,
									bold: cellData?.bold,
								};
							})
						),
						[
							{
								text: 'Grand Current Total',
								bold: true,
								colSpan: 7,
							},
							{},
							{},
							{},
							{},
							{},
							{},

							{
								text: Number(
									grandTotal.current.close_end_quantity
								).toFixed(2),
								bold: true,
							},
							{
								text: Number(
									grandTotal.current.open_end_quantity
								).toFixed(2),
								bold: true,
							},

							{
								text: Number(
									grandTotal.current.quantity
								).toFixed(2),
								bold: true,
							},
							{},
							{
								text: Number(grandTotal.current.value).toFixed(
									2
								),
								bold: true,
							},
						],
						[
							{
								text: 'Grand Opening Total',
								bold: true,
								colSpan: 7,
							},
							{},
							{},
							{},
							{},
							{},
							{},

							{
								text: Number(
									grandTotal.opening.close_end_quantity
								).toFixed(2),
								bold: true,
							},
							{
								text: Number(
									grandTotal.opening.open_end_quantity
								).toFixed(2),
								bold: true,
							},

							{
								text: Number(
									grandTotal.opening.quantity
								).toFixed(2),
								bold: true,
							},
							{},
							{
								text: Number(grandTotal.opening.value).toFixed(
									2
								),
								bold: true,
							},
						],
						[
							{
								text: 'Grand Closing Total',
								bold: true,
								colSpan: 7,
							},
							{},
							{},
							{},
							{},
							{},
							{},

							{
								text: Number(
									grandTotal.closing.close_end_quantity
								).toFixed(2),
								bold: true,
							},
							{
								text: Number(
									grandTotal.closing.open_end_quantity
								).toFixed(2),
								bold: true,
							},

							{
								text: Number(
									grandTotal.closing.quantity
								).toFixed(2),
								bold: true,
							},
							{},
							{
								text: Number(grandTotal.closing.value).toFixed(
									2
								),
								bold: true,
							},
						],
					],
				},
			},
		],
	});

	return pdfDocGenerator;
}
