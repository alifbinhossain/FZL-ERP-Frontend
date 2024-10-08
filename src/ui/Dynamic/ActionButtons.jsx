import cn from '@/lib/cn';

import CopyButton from './CopyButton';
import RemoveButton from './RemoveButton';

export default function ActionButtons({
	duplicateClick,
	removeClick,
	showRemoveButton,
	className,
}) {
	return (
		<div className={cn('flex w-10 gap-2')}>
			<CopyButton onClick={duplicateClick} />
			<RemoveButton onClick={removeClick} showButton={showRemoveButton} />
		</div>
	);
}
