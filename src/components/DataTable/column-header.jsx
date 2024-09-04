import { cn } from '@/lib/utils';
import { Button } from '@/registry/new-york/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/registry/new-york/ui/dropdown-menu';
import {
	ArrowDownIcon,
	ArrowUpIcon,
	CaretSortIcon,
	EyeNoneIcon,
} from '@radix-ui/react-icons';

export function DataTableColumnHeader({ column, title, className }) {
	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>;
	}

	return (
		<div className={cn('flex items-center space-x-2', className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='ghost'
						size='sm'
						className='-ml-3 h-8 data-[state=open]:bg-accent'>
						<span>{title}</span>
						{column.getIsSorted() === 'desc' ? (
							<ArrowDownIcon className='ml-2 h-4 w-4' />
						) : column.getIsSorted() === 'asc' ? (
							<ArrowUpIcon className='ml-2 h-4 w-4' />
						) : (
							<CaretSortIcon className='ml-2 h-4 w-4' />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='start'>
					<DropdownMenuItem
						onClick={() => column.toggleSorting(false)}>
						<ArrowUpIcon className='text-muted-foreground/70 mr-2 h-3.5 w-3.5' />
						Asc
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => column.toggleSorting(true)}>
						<ArrowDownIcon className='text-muted-foreground/70 mr-2 h-3.5 w-3.5' />
						Desc
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => column.toggleVisibility(false)}>
						<EyeNoneIcon className='text-muted-foreground/70 mr-2 h-3.5 w-3.5' />
						Hide
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
