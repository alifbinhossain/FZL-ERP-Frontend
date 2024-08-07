import { DEFAULT_FONT_SIZE } from "../ui";

export const company = {
	name: "Fortune Zipper LTD.",
	address: "Aukpara, Ashulia, Savar, DHK-1340",
	contact: "Email: info@fortunezip.com, Phone: 01521533595",
	bin_tax_hscode: "BIN: 000537296-0403, VAT: 17141000815",
};

export const getPageHeader = (order_info) => {
	const order_number =
		order_info.is_sample === 1
			? order_info.order_number + " (S)"
			: order_info.order_number;
	const lc_or_cash =
		order_info.is_cash === 1
			? `Cash${order_info?.is_bill === 1 && " (Bill)"}`
			: "LC";
	return [
		// CompanyAndORDER
		[
			{
				colSpan: 2,
				text: [
					{
						text: `${company.name}\n`,
						fontSize: DEFAULT_FONT_SIZE + 4,
						bold: true,
					},
					`${company.address}\n`,
					`${company.contact}\n`,
				],
				alignment: "left",
			},
			"",
			{
				colSpan: 2,
				text: [
					{
						text: "Order Sheet\n",
						fontSize: DEFAULT_FONT_SIZE + 4,
						bold: true,
					},
					`O/N: ${order_number}\n`,
					`Date: ${order_info.date}`,
				],
				alignment: "right",
			},
			"",
		],
		[
			{ text: "Client", bold: true },
			order_info.party_name,
			{ text: "Buyer", bold: true },
			order_info.buyer_name,
		],
		[
			{ text: "Factory", bold: true },
			order_info.factory_name,
			{ text: "Marketing", bold: true },
			order_info.marketing_name,
		],
		[
			{ text: "Address", bold: true },
			order_info.factory_address,
			{ text: "LC/Cash", bold: true },
			lc_or_cash,
		],
	];
};

export const getPageFooter = ({ currentPage, pageCount }) => {
	return {
		widths: ["*", "*", "*"],
		body: [
			[
				{
					text: "SNO",
					alignment: "center",
					border: [false, true, false, false],
				},
				{
					text: "",
					alignment: "center",
					border: [false, false, false, false],
				},
				{
					text: "Managing Director",
					alignment: "center",
					border: [false, true, false, false],
				},
			],
			[
				{
					colSpan: 3,
					text: `Page ${currentPage} of ${pageCount}`,
					alignment: "center",
					border: [false, false, false, false],
				},
				"",
				"",
			],
		],
	};
};

export const TableHeader = ({ entry, uniqueSizes }) => {
	const {
		item_short_name,
		zipper_number_short_name,
		end_type_short_name,
		lock_type_short_name,
		stopper_type_short_name,
		puller_type_short_name,
		teeth_color_short_name,
		puller_color_short_name,
		hand_short_name,
		coloring_type_short_name,
		special_requirement,
	} = entry;

	const FIXED_COLUMN_LENGTH = 3;

	return [
		[
			{
				colSpan: uniqueSizes.length + FIXED_COLUMN_LENGTH,
				text: [
					item_short_name,
					"-",
					zipper_number_short_name,
					"-",
					end_type_short_name,
					"-",
					lock_type_short_name,
					"-",
					stopper_type_short_name,
					"-",
					puller_type_short_name,
					"-",
					teeth_color_short_name,
					"-",
					puller_color_short_name,
					"-",
					hand_short_name,
					"-",
					coloring_type_short_name,
					// "-",
					// special_requirement,
				],
				style: "tableHeader",
			},
			...Array.from(
				{ length: uniqueSizes.length + FIXED_COLUMN_LENGTH - 1 },
				() => ""
			),
		],
		[
			{
				text: "Style",
				style: "tableHeader",
			},
			{
				text: "Color / Size(CM)",
				style: "tableHeader",
			},
			...uniqueSizes.map((size) => ({
				text: size,
				style: "tableHeader",
				alignment: "right",
			})),
			{
				text: "Total",
				style: "tableHeader",
				alignment: "right",
			},
		],
	];
};
export const TableFooter = ({ total_quantity, total_value }) => [
	{
		colSpan: 3,
		text: `Total QTY: ${total_quantity}`,
		style: "tableFooter",
		alignment: "right",
	},
	"",
	"",
	{
		colSpan: 2,
		text: `US $${total_value}`,
		style: "tableFooter",
		alignment: "right",
	},
	"",
];
