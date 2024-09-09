import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess } from '@/hooks';
import cn from '@/lib/cn';
import { useLabDipInfo } from '@/state/LabDip';
import { EditDelete, LinkWithCopy, StatusButton } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Index() {
	const { data, isLoading, isError, url, updateData } = useLabDipInfo();
	const navigate = useNavigate();
	const info = new PageInfo('Lab Dip/Info', url, 'lab_dip__info');
	const haveAccess = useAccess('lab_dip__info');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'info_id',
				header: 'ID',
				width: 'w-8',
				cell: (info) => {
					const { uuid } = info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={uuid}
							uri='/lab-dip/info/details'
						/>
					);
				},
			},
			{
				accessorKey: 'order_number',
				header: 'Order ID',
				width: 'w-8',
				cell: (info) => {
					const { order_number } = info.row.original;
					const { order_info_uuid } = info.row.original;
					if (order_info_uuid) {
						return (
							<LinkWithCopy
								title={info.getValue()}
								id={order_number}
								uri='/order/details'
							/>
						);
					}
				},
			},
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				width: 'w-12',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'buyer_name',
				header: 'Buyer',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'marketing_name',
				header: 'Marketing',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'merchandiser_name',
				header: 'Merchandiser',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'lab_status',
				header: 'Status',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('update'),
				cell: (info) => {
					return (
						<input
							onChange={() => handelStatusChange(info.row.index)}
							checked={info.getValue() === 1}
							type='checkbox'
							className={cn(
								'toggle toggle-md checked:toggle-accent'
							)}
							defaultChecked
						/>
					);
				},
			},
			{
				accessorKey: 'created_by_name',
				header: 'Created By',
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
				header: 'Action',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('update'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							showEdit={haveAccess.includes('update')}
							showDelete={false}
						/>
					);
				},
			},
		],
		[data]
	);

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	// Add
	const handelAdd = () => navigate('/lab-dip/info/entry');

	// Update
	const handelUpdate = (idx) => {
		const { uuid, info_id } = data[idx];

		navigate(`/lab-dip/info/update/${info_id}/${uuid}`);
	};
	const handelStatusChange = async (idx) => {
		await updateData.mutateAsync({
			url: `${url}/${data[idx]?.uuid}`,
			updatedData: {
				lab_status: data[idx]?.lab_status === 1 ? 0 : 1,
				updated_at: GetDateTime(),
			},
			isOnCloseNeeded: false,
		});
	};
	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				accessor={haveAccess.includes('create')}
				data={data}
				columns={columns}
				handelAdd={handelAdd}
			/>
		</div>
	);
}
