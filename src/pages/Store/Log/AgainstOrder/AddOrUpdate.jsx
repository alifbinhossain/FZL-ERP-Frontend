import { AddModal } from '@/components/Modal';
import { useRHF } from '@/hooks';
import {
	useCommonOrderAgainstCoilRMLog,
	useCommonOrderAgainstTapeRMLog,
} from '@/state/Common';
import { useOrderAgainstDeliveryRMLog } from '@/state/Delivery';
import { useOrderAgainstDyeingRMLog } from '@/state/Dyeing';
import { useOrderAgainstLabDipRMLog } from '@/state/LabDip';
import {
	useOrderAgainstMetalFinishingRMLog,
	useOrderAgainstMetalTCRMLog,
	useOrderAgainstMetalTMRMLog,
} from '@/state/Metal';
import { useOrderAgainstNylonMetallicFinishingRMLog } from '@/state/Nylon';
import {
	useOrderAgainstDieCastingRMLog,
	useOrderAgainstSliderAssemblyRMLog,
	useOrderAgainstSliderColorRMLog,
} from '@/state/Slider';
import {
	useMaterialInfo,
	useMaterialTrxAgainstOrderDescription,
	useMaterialTrxAgainstOrderDescriptionByUUID,
} from '@/state/Store';
import {
	useOrderAgainstVislonFinishingRMLog,
	useOrderAgainstVislonTMRMLog,
} from '@/state/Vislon';
import { FormField, Input, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import {
	MATERIAL_TRX_AGAINST_ORDER_NULL,
	MATERIAL_TRX_AGAINST_ORDER_SCHEMA,
} from '@util/Schema';

import getTransactionArea from '@/util/TransactionArea';
import { useEffect } from 'react';

export default function Index({
	modalId = '',
	updateMaterialTrxToOrder = {
		uuid: null,
		material_name: null,
		trx_quantity: null,
		stock: null,
	},
	setUpdateMaterialTrxToOrder,
}) {
	const { url, updateData } = useMaterialTrxAgainstOrderDescription();
	const { data } = useMaterialTrxAgainstOrderDescriptionByUUID(
		updateMaterialTrxToOrder?.uuid
	);
	const { invalidateQuery: invalidateMaterialInfo } = useMaterialInfo();
	const { invalidateQuery: invalidateOrderAgainstDeliveryRMLog } =
		useOrderAgainstDeliveryRMLog();
	const { invalidateQuery: invalidateOrderAgainstDieCastingRMLog } =
		useOrderAgainstDieCastingRMLog();
	const { invalidateQuery: invalidateOrderAgainstLabDipRMLog } =
		useOrderAgainstLabDipRMLog();
	const { invalidateQuery: invalidateOrderAgainstMetaFinishingRMLog } =
		useOrderAgainstMetalFinishingRMLog();
	const { invalidateQuery: invalidateOrderAgainstMetalTCRMLog } =
		useOrderAgainstMetalTCRMLog();
	const { invalidateQuery: invalidateOrderAgainstMetalTMRMLog } =
		useOrderAgainstMetalTMRMLog();
	const { invalidateQuery: invalidateOrderAgainstDyeingRMLog } =
		useOrderAgainstDyeingRMLog();
	const { invalidateQuery: invalidateOrderAgainstCoilRMLog } =
		useCommonOrderAgainstCoilRMLog();
	const { invalidateQuery: invalidateOrderAgainstTapeRMLog } =
		useCommonOrderAgainstTapeRMLog();
	const { invalidateQuery: invalidateOrderAgainstMetallicFinishingRMLog } =
		useOrderAgainstNylonMetallicFinishingRMLog();
	const { invalidateQuery: invalidateOrderAgainstVislonFinishingRMLog } =
		useOrderAgainstVislonFinishingRMLog();
	const { invalidateQuery: invalidateOrderAgainstTMRMLog } =
		useOrderAgainstVislonTMRMLog();
	const { invalidateQuery: invalidateOrderAgainstSliderAssemblyRMLog } =
		useOrderAgainstSliderAssemblyRMLog();
	const { invalidateQuery: invalidateOrderAgainstSliderColorRMLog } =
		useOrderAgainstSliderColorRMLog();

	const schema = {
		...MATERIAL_TRX_AGAINST_ORDER_SCHEMA,
		// trx_quantity: MATERIAL_TRX_AGAINST_ORDER_SCHEMA.trx_quantity.max(
		// 	updateMaterialTrxToOrder?.stock
		// ),
	};
	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		reset,
		getValues,
		context,
	} = useRHF(schema, MATERIAL_TRX_AGAINST_ORDER_NULL);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

	const onClose = () => {
		setUpdateMaterialTrxToOrder((prev) => ({
			...prev,
			uuid: null,
			material_name: null,
			trx_quantity: null,
			stock: null,
		}));
		reset(MATERIAL_TRX_AGAINST_ORDER_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateMaterialTrxToOrder?.uuid !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};
			await updateData.mutateAsync({
				url: `${url}/${updateMaterialTrxToOrder?.uuid}`,
				uuid: updateMaterialTrxToOrder?.uuid,
				updatedData,
				onClose,
			});

			invalidateMaterialInfo();
			invalidateOrderAgainstDeliveryRMLog();
			invalidateOrderAgainstDieCastingRMLog();
			invalidateOrderAgainstLabDipRMLog();
			invalidateOrderAgainstMetaFinishingRMLog();
			invalidateOrderAgainstMetalTCRMLog();
			invalidateOrderAgainstMetalTMRMLog();
			invalidateOrderAgainstDyeingRMLog();
			invalidateOrderAgainstCoilRMLog();
			invalidateOrderAgainstTapeRMLog();
			invalidateOrderAgainstMetallicFinishingRMLog();
			invalidateOrderAgainstVislonFinishingRMLog();
			invalidateOrderAgainstTMRMLog();
			invalidateOrderAgainstSliderAssemblyRMLog();
			invalidateOrderAgainstSliderColorRMLog();

			return;
		}
	};

	const transactionArea = getTransactionArea();
	return (
		<AddModal
			id={modalId}
			title={`Against Order Log of ${updateMaterialTrxToOrder?.material_name}`}
			formContext={context}
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
								value={transactionArea?.filter(
									(item) => item.value == getValues('trx_to')
								)}
								onChange={(e) => onChange(e.value)}
								isDisabled={
									updateMaterialTrxToOrder?.uuid !== null
								}
							/>
						);
					}}
				/>
			</FormField>
			<Input
				label='trx_quantity'
				// sub_label={`Max: ${updateMaterialTrxToOrder?.stock}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}