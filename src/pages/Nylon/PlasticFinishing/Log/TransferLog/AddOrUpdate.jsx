import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useRHF } from '@/hooks';
import {
	useMetalTMProduction,
	useMetalTMTrxLog,
	useMetalTMTrxLogByUUID,
} from '@/state/Metal';
import {
	useNylonPlasticFinishingProduction,
	useNylonPlasticFinishingTrxLog,
	useNylonPlasticFinishingTrxLogByUUID,
} from '@/state/Nylon';
import { FormField, Input, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { SFG_TRANSFER_LOG_NULL, SFG_TRANSFER_LOG_SCHEMA } from '@util/Schema';
import { useEffect } from 'react';

export default function Index({
	modalId = '',
	updateTeethMoldingLog = {
		uuid: null,
		sfg_uuid: null,
		section: null,
		production_quantity_in_kg: null,
		production_quantity: null,
		coloring_prod: null,
		nylon_plastic_finishing: null,
		wastage: null,
		remarks: null,
	},
	setUpdateTeethMoldingLog,
}) {
	const { invalidateQuery } = useNylonPlasticFinishingProduction();
	const { updateData } = useNylonPlasticFinishingTrxLog();
	const { data: dataByUUID } = useNylonPlasticFinishingTrxLogByUUID(
		updateTeethMoldingLog.uuid,
		{
			enabled: updateTeethMoldingLog.uuid !== null,
		}
	);
	const MAX_QUANTITY =
		Number(updateTeethMoldingLog?.finishing_prod) +
		Number(updateTeethMoldingLog?.trx_quantity);
	const schema = {
		...SFG_TRANSFER_LOG_SCHEMA,
		trx_quantity: SFG_TRANSFER_LOG_SCHEMA.trx_quantity.max(MAX_QUANTITY),
	};
	const { user } = useAuth();
	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		reset,
		getValues,
	} = useRHF(schema, SFG_TRANSFER_LOG_NULL);
	console.log(getValues());

	useEffect(() => {
		if (dataByUUID) {
			console.log({
				dataByUUID,
			});
			reset(dataByUUID);
		}
	}, [dataByUUID]);

	const onClose = () => {
		setUpdateTeethMoldingLog((prev) => ({
			...prev,
			uuid: null,
			sfg_uuid: null,
			section: null,
			production_quantity_in_kg: null,
			production_quantity: null,
			coloring_prod: null,
			nylon_plastic_finishing: null,
			wastage: null,
			remarks: null,
		}));
		reset(SFG_TRANSFER_LOG_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateTeethMoldingLog?.uuid !== null) {
			const updatedData = {
				...data,
				order_entry_uuid: updateTeethMoldingLog?.order_entry_uuid,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `/zipper/sfg-transaction/${updateTeethMoldingLog?.uuid}`,
				updatedData,
				onClose,
			});

			invalidateQuery();

			return;
		}
	};

	const transactionArea = [
		{ label: 'Dying and Iron', value: 'dying_and_iron_stock' },
		{ label: 'Teeth Molding', value: 'teeth_molding_stock' },
		{ label: 'Teeth Coloring', value: 'teeth_coloring_stock' },
		{ label: 'Finishing', value: 'finishing_stock' },
		{ label: 'Warehouse', value: 'warehouse' },
		{ label: 'Slider Assembly', value: 'slider_assembly_stock' },
		{ label: 'Coloring', value: 'coloring_stock' },
	];

	return (
		<AddModal
			id={modalId}
			title={`Nylon Plastic Finshing Transfer Log`}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<FormField label='trx_to' title='Trx to' errors={errors}>
				<Controller
					name={'trx_to'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Transaction Area'
								options={transactionArea}
								value={transactionArea?.find(
									(item) => item.value == getValues('trx_to')
								)}
								onChange={(e) => onChange(e.value)}
								isDisabled={
									updateTeethMoldingLog?.uuid !== null
								}
							/>
						);
					}}
				/>
			</FormField>
			<Input
				label='trx_quantity'
				sub_label={`Max: ${MAX_QUANTITY}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}