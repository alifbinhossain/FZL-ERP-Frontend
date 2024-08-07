import { lazy } from "react";

// Challan
const Challan = lazy(() => import("@pages/Delivery/Challan"));
const ChallanDetails = lazy(() => import("@pages/Delivery/Challan/Details"));
const ChallanEntry = lazy(() => import("@/pages/Delivery/Challan/Entry"));

export const DeliveryRoutes = [
	{
		id: 1,
		name: "Challan",
		path: "/delivery/challan",
		element: Challan,
		type: "delivery",
		page_name: "delivery__challan",
		actions: ["create", "read", "update", "delete", "click_receive_status"],
	},
	{
		id: 11,
		name: "Challan",
		path: "/delivery/challan/details/:challan_number",
		element: ChallanDetails,
		type: "delivery",
		page_name: "delivery__challan_details",
		actions: ["create", "read", "update", "delete", "click_receive_status"],
		hidden: true,
	},
	{
		id: 2,
		name: "Challan Entry",
		path: "/delivery/challan/entry",
		element: ChallanEntry,
		type: "delivery",
		page_name: "delivery__challan_entry",
		actions: ["create", "read", "update", "delete"],
		hidden: true,
	},
	{
		id: 3,
		name: "Challan Update",
		path: "/delivery/challan/update/:challan_number/:challan_uuid",
		element: ChallanEntry,
		type: "delivery",
		page_name: "delivery__challan_update",
		actions: ["create", "read", "update", "delete"],
		hidden: true,
	},
];
