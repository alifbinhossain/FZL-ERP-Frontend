import { Suspense, useCallback, useEffect, useState } from 'react';
import {
	useAllZipperThreadOrderList,
	useOtherCountLength,
} from '@/state/Other';
import {
	useThreadDetailsByUUID,
	useThreadOrderInfo,
	useThreadOrderInfoEntry,
} from '@/state/Thread';
import { useAuth } from '@context/auth';
import { FormProvider } from 'react-hook-form';
import { configure, HotKeys } from 'react-hotkeys';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useRHF } from '@/hooks';

import { DeleteModal } from '@/components/Modal';
import { Footer } from '@/components/Modal/ui';
import HandsonSpreadSheet from '@/ui/Dynamic/HandsonSpreadSheet';
import SwitchToggle from '@/ui/Others/SwitchToggle';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import {
	THREAD_ORDER_INFO_ENTRY_NULL,
	THREAD_ORDER_INFO_ENTRY_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

import Header from './Header';
import OrderEntrySpreadsheet from './spreadsheets/order-entry-spreadsheet';
import useGenerateFieldDefs from './useGenerateFieldDefs';

export default function Index() {
	const { url: threadOrderInfoUrl } = useThreadOrderInfo();
	const { url: threadOrderEntryUrl } = useThreadOrderInfoEntry();
	const { updateData, postData, deleteData } = useThreadOrderInfo();
	const { uuid, order_info_uuid } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();
	const { invalidateQuery: invalidateOtherZipperThreadOrderList } =
		useAllZipperThreadOrderList();
	const isUpdate = order_info_uuid !== undefined || uuid !== undefined;
	const { data } = useThreadDetailsByUUID(order_info_uuid);
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
		trigger,
		clearErrors,
		context: form,
	} = useRHF(THREAD_ORDER_INFO_ENTRY_SCHEMA, THREAD_ORDER_INFO_ENTRY_NULL);

	useEffect(() => {
		uuid !== undefined
			? (document.title = `Thread Shade Recipe: Update ${uuid}`)
			: (document.title = 'Thread Shade Recipe: Entry');
	}, []);

	const { data: countLength } = useOtherCountLength();

	const bleaching = [
		{ label: 'Bleach', value: 'bleach' },
		{ label: 'Non-Bleach', value: 'non-bleach' },
	];

	const {
		fields: threadOrderInfoEntryField,
		append: threadOrderInfoEntryAppend,
		remove: threadOrderInfoEntryRemove,
		update: threadOrderInfoEntryUpdate,
	} = useFieldArray({
		control,
		name: 'order_info_entry',
	});

	useEffect(() => {
		if (data && isUpdate) {
			reset(data);
		}
	}, [data, isUpdate]);

	// order_info_entry

	const [bleachAll, setBleachAll] = useState();

	useEffect(() => {
		if (bleachAll !== null) {
			threadOrderInfoEntryField.forEach((item, index) => {
				setValue(
					`order_info_entry[${index}].bleaching`,
					bleachAll ? 'bleach' : 'non-bleach',
					{
						shouldDirty: true,
						shouldValidate: true,
					}
				);
			});
		}
	}, [bleachAll, threadOrderInfoEntryField]);

	useEffect(() => {
		const subscription = watch((value, { name, type }) => {
			const { order_info_entry } = value;
			if (order_info_entry?.length > 0) {
				const allBleach = order_info_entry.every(
					(item) => item.bleaching === 'bleach'
				);
				const allNonBleach = order_info_entry.every(
					(item) => item.bleaching === 'non-bleach'
				);

				if (allBleach) {
					setBleachAll(true);
				} else if (allNonBleach) {
					setBleachAll(false);
				} else {
					setBleachAll(null);
				}
			}
		});
		return () => subscription.unsubscribe();
	}, [watch]);

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handleThreadOrderInfoEntryRemove = (index) => {
		if (getValues(`order_info_entry[${index}].uuid`) !== undefined) {
			setDeleteItem({
				itemId: getValues(`order_info_entry[${index}].uuid`),
				itemName: getValues(`order_info_entry[${index}].uuid`),
			});
			window['order_info_entry_delete'].showModal();
		}
		threadOrderInfoEntryRemove(index);
	};

	const handleThreadOrderInfoEntryAppend = () => {
		threadOrderInfoEntryAppend({
			order_info_uuid: null,
			lab_ref: '',
			// po: '',
			// recipe_uuid: null,
			style: '',
			color: '',
			count_length_uuid: null,
			type: '',
			quantity: null,
			bleaching: 'non-bleach',
			company_price: 0,
			party_price: 0,
			remarks: '',
		});
	};
	const onClose = () => reset(THREAD_ORDER_INFO_ENTRY_NULL);

	// Submit
	const onSubmit = async (data) => {
		// Update
		if (isUpdate) {
			const order_info_data = {
				...data,
				is_sample: data.is_sample ? 1 : 0,
				is_bill: data.is_bill ? 1 : 0,
				is_cash: data.is_cash ? 1 : 0,
				updated_at: GetDateTime(),
			};

			const order_info_promise = await updateData.mutateAsync({
				url: `${threadOrderInfoUrl}/${data?.uuid}`,
				updatedData: order_info_data,
				uuid: data.uuid,
				isOnCloseNeeded: false,
			});

			const order_info_entries_promise = data.order_info_entry.map(
				async (item) => {
					if (item.uuid === undefined) {
						item.order_info_uuid = order_info_uuid;
						item.created_at = GetDateTime();
						item.uuid = nanoid();
						return await postData.mutateAsync({
							url: threadOrderEntryUrl,
							newData: item,
							isOnCloseNeeded: false,
						});
					} else {
						item.updated_at = GetDateTime();
						const updatedData = {
							...item,
						};
						return await updateData.mutateAsync({
							url: `${threadOrderEntryUrl}/${item.uuid}`,
							uuid: item.uuid,
							updatedData,
							isOnCloseNeeded: false,
						});
					}
				}
			);

			try {
				await Promise.all([
					order_info_promise,
					...order_info_entries_promise,
				])
					.then(() => reset(THREAD_ORDER_INFO_ENTRY_NULL))
					.then(() => {
						invalidateOtherZipperThreadOrderList();
						navigate(`/thread/order-info/${order_info_uuid}`);
					});
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}

			return;
		}

		// Add new item
		const new_order_info_uuid = nanoid();
		const created_at = GetDateTime();
		const created_by = user.uuid;

		// Create Shade Recipe description
		const order_info_data = {
			...data,
			is_sample: data.is_sample ? 1 : 0,
			is_bill: data.is_bill ? 1 : 0,
			is_cash: data.is_cash ? 1 : 0,
			uuid: new_order_info_uuid,
			created_at,
			created_by,
		};

		// delete shade_recipe field from data to be sent
		delete order_info_data['order_info_entry'];

		const order_info_promise = await postData.mutateAsync({
			url: threadOrderInfoUrl,
			newData: order_info_data,
			isOnCloseNeeded: false,
		});

		// Create Shade Recipe entries
		const order_info_entries = [...data.order_info_entry].map((item) => ({
			...item,
			order_info_uuid: new_order_info_uuid,
			uuid: nanoid(),
			created_at,
			created_by,
			// swatch_approval_date:
			// 	item.recipe_uuid === null ? null : GetDateTime(),
		}));

		const order_info_entries_promise = [
			...order_info_entries.map(
				async (item) =>
					await postData.mutateAsync({
						url: threadOrderEntryUrl,
						newData: item,
						isOnCloseNeeded: false,
					})
			),
		];

		try {
			await Promise.all([
				order_info_promise,
				...order_info_entries_promise,
			])
				.then(() => reset(THREAD_ORDER_INFO_ENTRY_NULL))
				.then(() => {
					invalidateOtherZipperThreadOrderList();
					navigate(`/thread/order-info/${new_order_info_uuid}`);
				});
		} catch (err) {
			console.error(`Error with Promise.all: ${err}`);
		}
	};

	// Check if uuid is valuuid
	if (getValues('quantity') === null) return <Navigate to='/not-found' />;

	const handelDuplicateDynamicField = useCallback(
		(index) => {
			const item = getValues(`order_info_entry[${index}]`);
			threadOrderInfoEntryAppend({ ...item, uuid: undefined });
		},
		[getValues, threadOrderInfoEntryAppend]
	);

	const handleEnter = (event) => {
		event.preventDefault();
		if (Object.keys(errors).length > 0) return;
	};

	// const keyMap = {
	// 	NEW_ROW: 'alt+n',
	// 	COPY_LAST_ROW: 'alt+c',
	// 	ENTER: 'enter',
	// };

	const handlers = {
		NEW_ROW: handleThreadOrderInfoEntryAppend,
		COPY_LAST_ROW: () =>
			handelDuplicateDynamicField(threadOrderInfoEntryField.length - 1),
		ENTER: (event) => handleEnter(event),
	};

	configure({
		ignoreTags: ['input', 'select', 'textarea'],
		ignoreEventsCondition: function () {},
	});

	const rowClass =
		'group whitespace-nowrap text-left text-sm font-normal tracking-wide';

	const headerButtons = [
		<div className='flex items-center gap-2'>
			<label className='text-sm text-white'>Bleach All</label>
			<SwitchToggle
				checked={bleachAll}
				onChange={() => setBleachAll(!bleachAll)}
			/>
		</div>,
	];

	const handleCopy = (index) => {
		const field = form.watch('order_info_entry')[index];
		threadOrderInfoEntryAppend({
			color: field.color,
			style: field.style,
			count_length_uuid: field.count_length_uuid,
			bleaching: field.bleaching,
			quantity: field.quantity,
			company_price: field.company_price,
			party_price: field.party_price,
			remarks: field.remarks,
		});
	};

	return (
		<FormProvider {...form}>
			{/* <HotKeys {...{ keyMap, handlers }}> */}
			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				className='flex flex-col gap-4'>
				<Header
					{...{
						register,
						errors,
						control,
						getValues,
						Controller,
						watch,
					}}
				/>

				<OrderEntrySpreadsheet
					extraHeader={headerButtons}
					title='Details'
					form={form}
					fieldName='order_info_entry'
					handleCopy={handleCopy}
					handleAdd={handleThreadOrderInfoEntryAppend}
					handleRemove={handleThreadOrderInfoEntryRemove}
				/>
				{/* <HandsonSpreadSheet
					extraHeader={headerButtons}
					title='Details'
					form={form}
					fieldName='order_info_entry'
					fieldDefs={useGenerateFieldDefs({
						copy: handleCopy,
						remove: handleThreadOrderInfoEntryRemove,
						watch: watch,
					})}
					handleAdd={handleThreadOrderInfoEntryAppend}
					fields={threadOrderInfoEntryField}
				/> */}

				<Footer buttonClassName='!btn-primary' />
			</form>
			{/* </HotKeys> */}
			<Suspense>
				<DeleteModal
					modalId={'order_info_entry_delete'}
					title={'Order info Entry'}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={threadOrderInfoEntryField}
					url={threadOrderEntryUrl}
					deleteData={deleteData}
				/>
			</Suspense>
			<DevTool control={control} placement='top-left' />
		</FormProvider>
	);
}
