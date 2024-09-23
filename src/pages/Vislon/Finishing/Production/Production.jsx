import { useAuth } from '@/context/auth';
import { useVislonFinishingProd, useVislonTMP } from '@/state/Vislon';
import { DevTool } from '@hookform/devtools';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { JoinInput, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import {
	NUMBER_DOUBLE_REQUIRED,
	NUMBER_REQUIRED,
	SFG_PRODUCTION_SCHEMA_IN_KG,
	SFG_PRODUCTION_SCHEMA_IN_KG_NULL,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateFinishingProd = {
		uuid: null,
		sfg_uuid: null,
		section: null,
		production_quantity_in_kg: null,
		production_quantity: null,
		coloring_prod: null,
		wastage: null,
		remarks: null,
	},
	setUpdateFinishingProd,
}) {
	const { postData } = useVislonTMP();
	const { invalidateQuery } = useVislonFinishingProd();
	const { user } = useAuth();

	const MAX_PROD = Math.min(
		Number(updateFinishingProd.balance_quantity),
		Number(updateFinishingProd.order_quantity)
	);

	const MAX_PROD_KG = Number(updateFinishingProd.finishing_stock);

	const { register, handleSubmit, errors, reset, watch, control, context } =
		useRHF(
			{
				...SFG_PRODUCTION_SCHEMA_IN_KG,
				production_quantity: NUMBER_REQUIRED.moreThan(
					0,
					'More Than 0'
				).max(MAX_PROD, 'Beyond Max Quantity'),
				production_quantity_in_kg: NUMBER_DOUBLE_REQUIRED.moreThan(
					0,
					'More Than 0'
				).max(MAX_PROD_KG, 'Beyond Max Quantity'),
			},
			SFG_PRODUCTION_SCHEMA_IN_KG_NULL
		);

	const MAX_WASTAGE_KG = Number(
		MAX_PROD_KG - (watch('production_quantity_in_kg') || 0)
	).toFixed(3);

	const onClose = () => {
		setUpdateFinishingProd((prev) => ({
			...prev,
			uuid: null,
			sfg_uuid: null,
			section: null,
			production_quantity_in_kg: null,
			production_quantity: null,
			coloring_prod: null,
			wastage: null,
			remarks: null,
		}));

		reset(SFG_PRODUCTION_SCHEMA_IN_KG_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			uuid: nanoid(),
			sfg_uuid: updateFinishingProd?.sfg_uuid,
			coloring_prod: updateFinishingProd?.coloring_prod,
			section: 'finishing',
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url: '/zipper/sfg-production',
			newData: updatedData,
			onClose,
		});

		invalidateQuery();
	};

	return (
		<AddModal
			id='TeethMoldingProdModal'
			title={'Finishing Production'}
			subTitle={`
				${updateFinishingProd.order_number} -> 
				${updateFinishingProd.item_description} -> 
				${updateFinishingProd.style_color_size} 
				`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				title='Production Quantity'
				label='production_quantity'
				unit='PCS'
				sub_label={`MAX: ${MAX_PROD} PCS`}
				{...{ register, errors }}
			/>
			<JoinInput
				title='Production Quantity (KG)'
				label='production_quantity_in_kg'
				unit='KG'
				sub_label={`MAX: ${MAX_PROD_KG} kg`}
				{...{ register, errors }}
			/>
			<JoinInput
				title='wastage'
				label='wastage'
				unit='KG'
				sub_label={`MAX: ${MAX_WASTAGE_KG} kg`}
				{...{ register, errors }}
			/>
			<Textarea label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
