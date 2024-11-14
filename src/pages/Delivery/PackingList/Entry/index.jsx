import { Suspense, useEffect, useState } from 'react';
import {
	useDeliveryPackingList,
	useDeliveryPackingListByOrderInfoUUID,
	useDeliveryPackingListDetailsByUUID,
	useDeliveryPackingListEntry,
} from '@/state/Delivery';
import { useAuth } from '@context/auth';
import { DevTool } from '@hookform/devtools';
import { set } from 'date-fns';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useFetchForRhfReset, useRHF } from '@/hooks';

import { DeleteModal } from '@/components/Modal';
import SubmitButton from '@/ui/Others/Button/SubmitButton';

import nanoid from '@/lib/nanoid';
import { PACKING_LIST_NULL, PACKING_LIST_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

import DynamicDeliveryTable from './DyanamicDeliveryFIeld';
import Header from './Header';

export default function Index() {
	const { uuid } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();
	const {
		url: deliveryPackingListUrl,
		postData,
		updateData,
		deleteData,
		invalidateQuery: invalidateDeliveryPackingList,
	} = useDeliveryPackingList();
	const {
		url: deliveryPackingListEntryUrl,
		deleteData: deletePackingListEntry,
	} = useDeliveryPackingListEntry();

	const isUpdate = uuid !== undefined;

	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		Controller,
		useFieldArray,
		getValues,
		watch,
		setValue,
	} = useRHF(PACKING_LIST_SCHEMA, PACKING_LIST_NULL);

	const {
		data: details,
		url,
		invalidateQuery: invalidateDetails,
	} = useDeliveryPackingListDetailsByUUID(uuid, {
		params: `is_update=true`,
	});

	const { data: packingListEntries } = useDeliveryPackingListByOrderInfoUUID(
		watch('order_info_uuid')
	);
	useEffect(() => {
		if (!isUpdate && packingListEntries?.packing_list_entry) {
			setValue(
				'packing_list_entry',
				packingListEntries?.packing_list_entry
			);
		}
		if (isUpdate) {
			setValue('packing_list_entry', details?.packing_list_entry);
			setValue('new_packing_list_entry', details?.new_packing_list_entry);
		}
		// if (isUpdate && details) {
		// 	reset(details);
		// }
	}, [isUpdate, packingListEntries, details]);

	useFetchForRhfReset(url, '', reset);

	useEffect(() => {
		if (isUpdate && watch('new_packing_list_entry')) {
			setValue('packing_list_entry', details?.packing_list_entry);
			setValue('new_packing_list_entry', watch('new_packing_list_entry'));
		}
	}, [watch('order_info_uuid')]);

	const { fields: packingListEntryField } = useFieldArray({
		control,
		name: 'packing_list_entry',
	});

	const { fields: newPackingListEntryField } = useFieldArray({
		control,
		name: 'new_packing_list_entry',
	});

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	// Submit
	const onSubmit = async (data) => {
		// Update item
		if (isUpdate) {
			if (
				// Check existing packing list
				(!data.packing_list_entry?.length ||
					!data.packing_list_entry.some(
						(item) => item.quantity > 0
					)) &&
				// Check new packing list
				(!data.new_packing_list_entry?.length ||
					!data.new_packing_list_entry.some(
						(item) => item.quantity > 0
					))
			) {
				alert('Packing List cannot be null');
				return;
			} else if (
				data?.new_packing_list_entry?.some(
					(item) => item.quantity > item?.balance_quantity
				)
			) {
				alert('Quantity cannot be greater than balance quantity');
				return;
			}
			const packingListData = {
				...data,
				updated_at: GetDateTime(),
			};

			// update /packing/list/uuid
			const packingListPromise = await updateData.mutateAsync({
				url: `${deliveryPackingListUrl}/${data?.uuid}`,
				updatedData: packingListData,
				uuid: data.uuid,
				isOnCloseNeeded: false,
			});

			const updatedId = packingListPromise?.data?.[0].updatedId;

			// update /packing/list/uuid/entry
			let updatablePackingListEntryPromises = data.packing_list_entry
				.filter((item) => item.quantity > 0 && !item.isDeletable)
				.map(async (item) => {
					const updatedData = {
						...item,
						quantity: item.quantity,
						is_checked: item.is_checked,
						remarks: item.remarks,
						updated_at: GetDateTime(),
					};

					return await updateData.mutateAsync({
						url: `${deliveryPackingListEntryUrl}/${item?.uuid}`,
						updatedData: updatedData,
						uuid: item.uuid,
						isOnCloseNeeded: false,
					});
				});

			let updatableNewPackingListEntryPromises =
				data.new_packing_list_entry
					.filter((item) => item.quantity > 0 && !item.isDeletable)
					.map(async (item) => {
						return await postData.mutateAsync({
							url: deliveryPackingListEntryUrl,
							newData: {
								...item,
								uuid: nanoid(),
								is_checked: item.is_checked,
								quantity: item?.quantity,
								packing_list_uuid: uuid,
								created_at: GetDateTime(),
							},
							isOnCloseNeeded: false,
						});
					});

			let deletablePackingListEntryPromises = data.packing_list_entry
				.filter((item) => item.isDeletable)
				.map(async (item) => {
					return await deleteData.mutateAsync({
						url: `${deliveryPackingListEntryUrl}/${item?.uuid}`,
						isOnCloseNeeded: false,
					});
				});

			try {
				await Promise.all([
					packingListPromise,
					...updatablePackingListEntryPromises,
					...updatableNewPackingListEntryPromises,
					deletablePackingListEntryPromises,
				])
					.then(() => reset(Object.assign({}, PACKING_LIST_NULL)))
					.then(() => {
						invalidateDeliveryPackingList();
						invalidateDetails();
						navigate(`/delivery/zipper-packing-list/${data?.uuid}`);
					});
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}

			return;
		}

		// Add new item
		var new_uuid = nanoid();
		const created_at = GetDateTime();

		const packingListData = {
			...data,
			uuid: new_uuid,
			created_at,
			created_by: user.uuid,
		};

		delete packingListData['is_all_checked'];
		delete packingListData['packing_list_entry'];

		const packingListEntryData = [...data.packing_list_entry]
			.filter((item) => item.quantity > 0)
			.map((item) => ({
				...item,
				uuid: nanoid(),
				is_checked: true,
				packing_list_uuid: new_uuid,
				quantity: item?.quantity,
				created_at,
				remarks: item?.remarks || null,
			}));

		if (packingListEntryData.length === 0) {
			alert('Select at least one item to proceed.');
		} else {
			// create new /packing/list
			await postData.mutateAsync({
				url: deliveryPackingListUrl,
				newData: packingListData,
				isOnCloseNeeded: false,
			});
			// create new /packing/list/entry
			const commercial_packing_list_entry_promises =
				packingListEntryData.map((item) =>
					postData.mutateAsync({
						url: deliveryPackingListEntryUrl,
						newData: item,
						isOnCloseNeeded: false,
					})
				);
			try {
				await Promise.all([...commercial_packing_list_entry_promises])
					.then(() => reset(Object.assign({}, PACKING_LIST_NULL)))
					.then(() => {
						invalidateDeliveryPackingList();
						invalidateDetails();
						navigate(`/delivery/zipper-packing-list`);
					});
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}
		}
	};

	// Check if order_number is valid
	if (getValues('quantity') === null) return <Navigate to='/not-found' />;
	const rowClass =
		'group px-3 py-2 whitespace-nowrap text-left text-sm font-normal tracking-wide';

	// Remove packing list entry
	const handlePackingListEntryRemove = (index) => {
		if (
			getValues(`packing_list_entry[${index}].packing_list_uuid`) !==
				null &&
			getValues(`packing_list_entry[${index}].is_checked`) === true
		) {
			setDeleteItem({
				itemId: getValues(`packing_list_entry[${index}].uuid`),
				itemName: getValues(`packing_list_entry[${index}].uuid`),
			});
			window['packing_list_entry_delete'].showModal();
		}
	};

	return (
		<div>
			<form
				className='flex flex-col gap-4'
				onSubmit={handleSubmit(onSubmit)}
				noValidate>
				<Header
					{...{
						register,
						errors,
						control,
						getValues,
						Controller,
						isUpdate,
					}}
				/>
				<DynamicDeliveryTable
					title='Packing List Entry'
					handlePackingListEntryRemove={handlePackingListEntryRemove}
					packingListEntryField={packingListEntryField}
					isUpdate={isUpdate}
					register={register}
					watch={watch}
					getValues={getValues}
					errors={errors}
					entryFiledName='packing_list_entry'
				/>
				{isUpdate && (
					<DynamicDeliveryTable
						title='New Packing List Entry'
						handlePackingListEntryRemove={
							handlePackingListEntryRemove
						}
						packingListEntryField={newPackingListEntryField}
						isUpdate={isUpdate}
						register={register}
						watch={watch}
						getValues={getValues}
						errors={errors}
						entryFiledName='new_packing_list_entry'
					/>
				)}

				<div className='modal-action'>
					<SubmitButton />
				</div>
			</form>

			<Suspense>
				<DeleteModal
					modalId={'packing_list_entry_delete'}
					title={'Packing List Entry'}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={packingListEntryField}
					url={deliveryPackingListEntryUrl}
					deleteData={deletePackingListEntry}
					onSuccess={invalidateDetails}
				/>
			</Suspense>
			<DevTool control={control} placement='top-left' />
		</div>
	);
}
