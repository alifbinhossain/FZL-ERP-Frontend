import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess, useFetchFunc, useFetchFuncForReport } from '@/hooks';
import { useCommonCoilRM, useCommonTapeRM } from '@/state/Common';
import { EditDelete, Transfer } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));

export default function Index() {
	const { data, isLoading, url, deleteData } = useCommonTapeRM();
	const info = new PageInfo('Tape Stock', url, 'common__tape_rm');
	const haveAccess = useAccess(info.getTab());

	//   "uuid": "0UEnxvp0dRSNN3O",
	//   "material_uuid": "0UEnxvp0dRSNN3O",
	//   "material_name": "Tape Material",
	//   "stock": "950.0000",
	//   "tape_making": "50.0000",
	//   "remarks": null

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'material_name',
				header: 'Material Name',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'tape_making',
				header: 'Stock',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'unit',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'action',
				header: 'Used',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_used'),
				width: 'w-24',
				cell: (info) => (
					<Transfer onClick={() => handelUpdate(info.row.index)} />
				),
			},
		],
		[data]
	);
	//   "uuid": "0UEnxvp0dRSNN3O",
	//   "material_uuid": "0UEnxvp0dRSNN3O",
	//   "material_name": "Tape Material",
	//   "stock": "950.0000",
	//   "tape_making": "50.0000",
	//   "remarks": null

	const [updateTapeStock, setUpdateTapeStock] = useState({
		uuid: null,
		unit: null,
	});

	const handelUpdate = (idx) => {
		setUpdateTapeStock((prev) => ({
			...prev,
			uuid: data[idx].uuid,
			unit: data[idx].unit,
			tape_making: data[idx].tape_making,
		}));
		window[info.getAddOrUpdateModalId()].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className='container mx-auto px-2 md:px-4'>
			<ReactTable
				title={info.getTitle()}
				data={data}
				columns={columns}
				extraClass='py-2'
			/>
			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updateTapeStock,
						setUpdateTapeStock,
					}}
				/>
			</Suspense>
		</div>
	);
}
