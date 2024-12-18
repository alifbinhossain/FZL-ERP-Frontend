import { lazy } from 'react';

// * Dyeing Dashboard
const DyeingDashboard = lazy(
	() => import('@/pages/DyeingAndIron/DyeingDashboard')
);

//* Dyes Category
const DyesCategory = lazy(() => import('@/pages/DyeingAndIron/DyesCategory'));

// * Finishing Batch
const FinishingBatch = lazy(
	() => import('@/pages/DyeingAndIron/FinishingBatch')
);
const FinishingBatchDetails = lazy(
	() => import('@/pages/DyeingAndIron/FinishingBatch/Details')
);
const FinishingBatchEntry = lazy(
	() => import('@/pages/DyeingAndIron/FinishingBatch/Entry')
);

// * Finishing Dashboard
const FinishingDashboard = lazy(
	() => import('@/pages/DyeingAndIron/FinishingDashboard')
);

//* Log
const DyeingLog = lazy(() => import('@/pages/DyeingAndIron/Log'));

//* Machine
const Machine = lazy(() => import('@/pages/DyeingAndIron/Machine'));

//* Planning
const DyeingPlanning = lazy(() => import('@/pages/DyeingAndIron/Planning'));
const DyeingPlanningHeadOffice = lazy(
	() => import('@/pages/DyeingAndIron/PlanningHeadOffice')
);
const DyeingPlanningHeadOfficeDetails = lazy(
	() => import('@/pages/DyeingAndIron/PlanningHeadOffice/Details')
);
const DyeingPlanningHeadOfficeEntry = lazy(
	() => import('@/pages/DyeingAndIron/PlanningHeadOffice/Entry')
);
const DyeingPlanningSNO = lazy(
	() => import('@/pages/DyeingAndIron/PlanningSNO')
);
const DyeingPlanningSNODetails = lazy(
	() => import('@/pages/DyeingAndIron/PlanningSNO/Details')
);
const DyeingPlanningSNOEntry = lazy(
	() => import('@/pages/DyeingAndIron/PlanningSNO/Entry')
);
const ProductionCapacity = lazy(
	() => import('@/pages/DyeingAndIron/ProductionCapacity')
);
const Programs = lazy(() => import('@/pages/DyeingAndIron/Programs'));
const DyeingRMStock = lazy(() => import('@/pages/DyeingAndIron/RMStock'));
const DyeingThreadBatch = lazy(
	() => import('@/pages/DyeingAndIron/ThreadBatch')
);
const DyeingThreadBatchDetails = lazy(
	() => import('@/pages/DyeingAndIron/ThreadBatch/Details')
);
const DyeingThreadBatchDyeing = lazy(
	() => import('@/pages/DyeingAndIron/ThreadBatch/Dyeing/Entry')
);
const DyeingThreadBatchEntry = lazy(
	() => import('@/pages/DyeingAndIron/ThreadBatch/Entry')
);
const DyeingZipperBatch = lazy(
	() => import('@/pages/DyeingAndIron/ZipperBatch')
);
const DyeingZipperBatchDetails = lazy(
	() => import('@/pages/DyeingAndIron/ZipperBatch/Details')
);
const DyeingZipperBatchEntry = lazy(
	() => import('@/pages/DyeingAndIron/ZipperBatch/Entry')
);
const DyeingZipperBatchProduction = lazy(
	() => import('@/pages/DyeingAndIron/ZipperBatch/Production')
);

export const DyeingAndIronRoutes = [
	{
		name: 'Dyeing And Iron',
		children: [
			{
				name: 'RM',
				path: '/dyeing-and-iron/rm',
				element: <DyeingRMStock />,
				page_name: 'dyeing__dyeing_and_iron_rm',
				actions: ['read', 'click_name', 'click_used'],
			},

			{
				name: 'Planning',
				path: '/dyeing-and-iron/planning',
				element: <DyeingPlanning />,
				page_name: 'dyeing__planning',
				actions: ['read'],
			},
			{
				name: 'Planning SNO',
				path: '/dyeing-and-iron/planning-sno',
				element: <DyeingPlanningSNO />,
				page_name: 'dyeing__planning_sno',
				actions: ['create', 'read', 'update'],
			},
			{
				name: 'Planning SNO Entry',
				path: '/dyeing-and-iron/planning-sno/entry/:weeks',
				element: <DyeingPlanningSNOEntry />,
				hidden: true,
				page_name: 'dyeing__planning_sno_entry',
				actions: ['create', 'read', 'update'],
			},
			{
				name: 'Planning SNO Update',
				path: '/dyeing-and-iron/planning-sno/:week_id/update',
				element: <DyeingPlanningSNOEntry />,
				hidden: true,
				page_name: 'dyeing__planning_sno_entry_update',
				actions: ['create', 'read', 'update'],
			},
			{
				name: 'Planning SNO Details',
				path: '/dyeing-and-iron/planning-sno/:week_id',
				element: <DyeingPlanningSNODetails />,
				hidden: true,
				page_name: 'dyeing__planning_sno_entry_details',
				actions: ['read'],
			},

			// * Planning Head Office
			{
				name: 'Planning Head Office',
				path: '/dyeing-and-iron/planning-head-office',
				element: <DyeingPlanningHeadOffice />,
				page_name: 'dyeing__planning_head_office',
				actions: ['create', 'read', 'update'],
			},
			{
				name: 'Planning Head Office',
				path: '/dyeing-and-iron/planning-head-office/entry/:weeks',
				element: <DyeingPlanningHeadOfficeEntry />,
				hidden: true,
				page_name: 'dyeing__planning_head_office_entry',
				actions: ['create', 'read', 'update'],
			},
			{
				name: 'Planning Head Office Update',
				path: '/dyeing-and-iron/planning-head-office/:week_id/update',
				element: <DyeingPlanningHeadOfficeEntry />,
				hidden: true,
				page_name: 'dyeing__planning_head_office_entry_update',
				actions: ['create', 'read', 'update'],
			},
			{
				name: 'Planning Head Office Details',
				path: '/dyeing-and-iron/planning-head-office/:week_id',
				element: <DyeingPlanningHeadOfficeDetails />,
				hidden: true,
				page_name: 'dyeing__planning_head_office_details',
				actions: ['read'],
			},

			// * Batch
			{
				name: 'Zipper Batch',
				path: '/dyeing-and-iron/zipper-batch',
				element: <DyeingZipperBatch />,
				page_name: 'dyeing__zipper_batch',
				actions: [
					'create',
					'read',
					'update',
					'click_receive_status',
					'click_receive_status_override',
				],
			},
			{
				name: 'Zipper Batch Entry',
				path: '/dyeing-and-iron/zipper-batch/entry',
				element: <DyeingZipperBatchEntry />,
				hidden: true,
				page_name: 'dyeing__zipper_batch_entry',
				actions: ['create', 'read', 'update'],
			},
			{
				name: 'Zipper Batch Update',
				path: '/dyeing-and-iron/zipper-batch/:batch_uuid/update',
				element: <DyeingZipperBatchEntry />,
				hidden: true,
				page_name: 'dyeing__zipper_batch_entry_update',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: ' Zipper Batch Details',
				path: '/dyeing-and-iron/zipper-batch/:batch_uuid',
				element: <DyeingZipperBatchDetails />,
				hidden: true,
				page_name: 'dyeing__zipper_batch_details',
				actions: ['read'],
			},

			// * Batch Production
			{
				name: 'Batch Production',
				path: '/dyeing-and-iron/zipper-batch/batch-production/:batch_prod_uuid',
				element: <DyeingZipperBatchProduction />,
				page_name: 'dyeing__zipper_batch_production',
				hidden: true,
				actions: ['create', 'read', 'update'],
			},

			// * Batch Thread
			{
				name: 'Thread Batch',
				path: '/dyeing-and-iron/thread-batch',
				element: <DyeingThreadBatch />,
				page_name: 'dyeing__thread_batch',
				actions: [
					'create',
					'read',
					'update',
					'click_drying_status',
					'click_drying_status_override',
				],
			},

			// * Batch Thread Entry
			{
				name: 'Thread Batch Entry',
				path: '/dyeing-and-iron/thread-batch/entry',
				element: <DyeingThreadBatchEntry />,
				hidden: true,
				page_name: 'dyeing__thread_batch_entry',
				actions: ['create', 'read', 'update'],
			},

			// * Batch Thread Details
			{
				name: 'Thread Batch Details',
				path: '/dyeing-and-iron/thread-batch/:batch_uuid',
				element: <DyeingThreadBatchDetails />,
				hidden: true,
				page_name: 'dyeing__thread_batch_details',
				actions: ['read'],
			},

			// * Batch Thread Update
			{
				name: 'Thread Batch Update',
				path: '/dyeing-and-iron/thread-batch/:batch_uuid/update',
				element: <DyeingThreadBatchEntry />,
				hidden: true,
				page_name: 'dyeing__thread_batch_entry_update',
				actions: ['create', 'read', 'update', 'delete'],
			},
			// *Dyeing ThreadBatch Conening
			{
				name: 'Batch Dyeing',
				path: '/dyeing-and-iron/thread-batch/dyeing/:batch_con_uuid',
				element: <DyeingThreadBatchDyeing />,
				page_name: 'dyeing__thread_batch_dyeing',
				hidden: true,
				actions: ['create', 'read', 'update'],
			},

			// * Machine
			{
				name: 'Machine',
				path: '/dyeing-and-iron/machine',
				element: <Machine />,
				page_name: 'dyeing__machine',
				actions: ['create', 'read', 'update', 'delete'],
			},
			// * Programs
			{
				name: 'Programs',
				path: '/dyeing-and-iron/programs',
				element: <Programs />,
				page_name: 'dyeing__programs',
				actions: ['create', 'read', 'update', 'delete'],
			},
			// * Dyes Category
			{
				name: 'Dyes Category',
				path: '/dyeing-and-iron/dyes-category',
				element: <DyesCategory />,
				page_name: 'dyeing__dyes_category',
				actions: ['create', 'read', 'update', 'delete'],
			},

			{
				name: 'Log',
				path: '/dyeing-and-iron/log',
				element: <DyeingLog />,
				page_name: 'dyeing__dyeing_and_iron_log',
				actions: [
					'read',
					'click_update_sfg',
					'click_delete_sfg',
					'click_update_rm',
					'click_delete_rm',
					'click_update_production',
					'click_delete_production',
					'click_update_rm_order',
					'click_delete_rm_order',
				],
			},

			// * Finishing Batch
			{
				name: 'Finishing Batch',
				path: '/dyeing-and-iron/finishing-batch',
				element: <FinishingBatch />,
				page_name: 'dyeing__finishing_batch',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Finishing Batch Entry',
				path: '/dyeing-and-iron/finishing-batch/entry',
				element: <FinishingBatchEntry />,
				hidden: true,
				page_name: 'dyeing__finishing_batch_entry',
				actions: ['create', 'read'],
			},
			{
				name: 'Finishing Batch Details',
				path: '/dyeing-and-iron/finishing-batch/:batch_uuid',
				element: <FinishingBatchDetails />,
				hidden: true,
				page_name: 'dyeing__finishing_batch_details',
				actions: ['read'],
			},
			{
				name: 'Finishing Batch Update',
				path: '/dyeing-and-iron/finishing-batch/:batch_uuid/update',
				element: <FinishingBatchEntry />,
				hidden: true,
				page_name: 'dyeing__finishing_batch_entry_update',
				actions: ['create', 'read', 'update', 'delete'],
			},

			// * Dyeing Dashboard
			{
				name: 'Dyeing Dashboard',
				path: '/dyeing-and-iron/dyeing-dashboard',
				element: <DyeingDashboard />,
				page_name: 'dyeing__dyeing_dashboard',
				actions: ['read', 'create', 'update', 'delete'],
			},

			// * Finishing Dashboard
			{
				name: 'Finishing Dashboard',
				path: '/dyeing-and-iron/finishing-dashboard',
				element: <FinishingDashboard />,
				page_name: 'dyeing__finishing_dashboard',
				actions: ['read', 'create', 'update', 'delete'],
			},

			// * Production Capacity
			{
				name: 'Production Capacity',
				path: '/dyeing-and-iron/production-capacity',
				element: <ProductionCapacity />,
				page_name: 'dyeing__production_capacity',
				actions: ['read', 'create', 'update', 'delete'],
			},
		],
	},
];
