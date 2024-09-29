import { black } from 'daisyui/src/theming/themes';
import { format } from 'date-fns';

import { DEFAULT_FONT_SIZE, PRIMARY_COLOR } from '../ui';
import { company, getEmptyColumn } from '../utils';

const PAGE_HEADER_EMPTY_ROW = ['', '', '', '', '', ''];

const getDateFormate = (date) => format(new Date(date), 'dd/MM/yyyy');

export const getPageHeader = (batch) => {
	const created_at = getDateFormate(batch?.created_at);
	const updated_at = getDateFormate(batch?.updated_at);

	return {
		//heights: ['auto', 2, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
		widths: [70, '*', 70, '*', 70, '*'],
		body: [
			[
				{
					colSpan: 3,
					text: [
						{
							text: `${company.name}\n`,
							fontSize: DEFAULT_FONT_SIZE + 4,
							bold: true,
						},
						`${company.address}\n`,
						`${company.phone}\n`,
					],
					alignment: 'left',
				},
				'',
				'',
				{
					colSpan: 3,
					text: [
						{
							text: 'Bulk Recipe\n',
							fontSize: DEFAULT_FONT_SIZE + 4,
							bold: true,
						},
						`Batch No: ${batch?.batch_id}\n`,
						`Date: ${created_at}\n`,
					],
					alignment: 'right',
				},
				'',
				'',
			],
			PAGE_HEADER_EMPTY_ROW,

			// * Start of table
			[
				{
					colSpan: 2,
					text: 'Conneing\n',
					bold: true,
					fontSize: 13,
					color: black,
				},
				'',

				{
					colSpan: 2,
					text: 'Yarn Issues',
					bold: true,
					fontSize: 13,
					color: black,
				},
				'',
				{
					colSpan: 2,
					text: 'Dyeing',
					bold: true,
					fontSize: 13,
					color: black,
				},
				'',
			],

			[
				{
					colSpan: 2,
					style: 'tableExample',
					table: {
						body: [
							['Machine', batch?.coning_machines],
							['Operator', batch?.coning_operator_name],
							['SuperVisor', batch?.coning_supervisor_name],
							['Created By', batch?.coning_created_by_name],
							// ['Created At', conning_created_at],
							// ['Updated At', conning_updated_at],
						],
					},
				},

				'',
				{
					colSpan: 2,
					style: 'tableExample',
					table: {
						body: [
							['Batch No', batch?.batch_id],
							['Quantity', batch?.yarn_quantity],
							[
								'Volume',
								batch?.water_capacity * batch?.yarn_quantity,
							],
							['Created By', batch?.yarn_issue_created_by_name],
							// ['Created At', batch?.yarn_issue_created_at],
							// ['Updated At', batch?.yarn_issue_updated_at],
						],
					},
				},

				'',
				{
					colSpan: 2,
					style: 'tableExample',
					table: {
						body: [
							['Status', batch?.status],
							['Category', batch?.category],
							['Machine', batch?.machine_name],
							['Water Capacity', batch?.water_capacity],
							['Slot', batch?.coning_created_by_name],
							['Operator', batch?.dyeing_operator_name],
							['SuperVisor', batch?.dyeing_supervisor_name],
							['Pass By', batch?.pass_by_name],
							['Shift', batch?.shift],
							['Reason', batch?.reason],
							['Created By', batch?.dyeing_created_by_name],
							// ['Created At', conning_created_at],
							// ['Updated At', conning_updated_at],
						],
					},
				},
				'',
			],
		],
	};
};

const EMPTY_COLUMN = getEmptyColumn(6);

export const getPageFooter = ({ currentPage, pageCount }) => ({
	body: [
		[
			{
				colSpan: 6,
				text: `Page ${currentPage} / ${pageCount}`,
				alignment: 'center',
				border: [false, false, false, false, false, false],
				// color,
			},
			...EMPTY_COLUMN,
		],
	],
});
