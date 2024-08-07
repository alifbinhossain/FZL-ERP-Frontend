import { lazy } from "react";

// Pages
// Admin
const User = lazy(() => import("@pages/Admin/User"));
const UserDepartment = lazy(
	() => import("@pages/Admin/UserDepartmentDesignation")
);
const NotFound = lazy(() => import("@pages/Public/NoEntry/notFound"));
const NoAccess = lazy(() => import("@pages/Public/NoEntry/noAccess"));

export const AdminRoutes = [
	{
		id: 1,
		name: "User",
		path: "/admin/user",
		element: User,
		type: "admin",
		page_name: "admin__user",
		actions: [
			"create",
			"read",
			"update",
			"delete",
			"click_status",
			"click_reset_password",
			"click_page_assign",
		],
	},
	{
		id: 11,
		name: "Department",
		path: "/admin-user/department",
		element: UserDepartment,
		type: "admin",
		page_name: "admin__user_department",
		actions: ["create", "read", "update", "delete"],
	},
	{
		id: 2,
		name: "Not Found",
		path: "*",
		element: NotFound,
		page_name: "admin__public",
	},
	{
		id: 3,
		name: "No Access",
		path: "/no-access",
		element: NoAccess,
		page_name: "admin__public",
	},
];
