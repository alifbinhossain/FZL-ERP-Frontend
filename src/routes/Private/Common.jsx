import { lazy } from "react";

// Common
const TapeStock = lazy(() => import("@/pages/Common/Tape/Stock"));
const TapeProd = lazy(() => import("@/pages/Common/Tape/Prod"));
const TapeLog = lazy(() => import("@/pages/Common/Tape/Log"));
const CoilStock = lazy(() => import("@/pages/Common/Coil/Stock"));
const CoilProd = lazy(() => import("@/pages/Common/Coil/Prod"));
const CoilLog = lazy(() => import("@/pages/Common/Coil/Log"));

export const CommonRoutes = [
	{
		id: 21,
		name: "RM",
		path: "/common/tape/rm",
		element: TapeStock,
		type: ["common", "tape"],
		page_name: "common__tape_rm",
		actions: ["read", "click_name", "click_used"],
	},
	{
		id: 22,
		name: "SFG",
		path: "/common/tape/sfg",
		element: TapeProd,
		type: ["common", "tape"],
		page_name: "common__tape_sfg",
		actions: [
			"read",
			"click_production",
			"click_to_coil",
			"click_to_dyeing",
		],
	},
	{
		id: 23,
		name: "Log",
		path: "/common/tape/log",
		element: TapeLog,
		type: ["common", "tape"],
		page_name: "common__tape_log",
		actions: [
			"read",
			"click_update_tape_to_coil",
			"click_delete_tape_to_coil",
			"click_update_tape_to_dying",
			"click_delete_tape_to_dying",
			"click_update_tape_production",
			"click_delete_tape_production",
			"click_update_rm",
			"click_delete_rm",
		],
	},
	{
		id: 24,
		name: "RM",
		path: "/common/coil/rm",
		element: CoilStock,
		type: ["common", "coil"],
		page_name: "common__coil_rm",
		actions: ["read", "click_name", "click_used"],
	},
	{
		id: 25,
		name: "SFG",
		path: "/common/coil/sfg",
		element: CoilProd,
		type: ["common", "coil"],
		page_name: "common__coil_sfg",
		actions: ["read", "click_production", "click_to_dyeing"],
	},
	{
		id: 26,
		name: "Log",
		path: "/common/coil/log",
		element: CoilLog,
		type: ["common", "coil"],
		page_name: "common__coil_log",
		actions: [
			"read",
			"click_update_sfg",
			"click_delete_sfg",
			"click_update_rm",
			"click_delete_rm",
			"click_update_coil_production",
			"click_delete_coil_production",
		],
	},
];
