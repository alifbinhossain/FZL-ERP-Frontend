import { Fragment, useCallback, useMemo } from "react";
import DebouncedInput from "../DebouncedInput";
import { Template } from "./_components";

function StatusInput({ columnName, column, isFullFilter }) {
	const { setFilterValue } = column;

	const handleStatusChange = useCallback(
		(e) => {
			const val =
				Number(e.target.value) === -1
					? undefined
					: Number(e.target.value);
			setFilterValue([val, val]);
		},
		[column]
	);

	if (!isFullFilter) {
		return (
			<select
				className="select select-bordered select-primary select-sm w-full"
				defaultValue={-1}
				onChange={handleStatusChange}
			>
				<option value="-1">All</option>
				<option value="0">Inactive</option>
				<option value="1">Active</option>
			</select>
		);
	}

	return (
		<Template
			columnName={columnName}
			onClick={() => setFilterValue(undefined)}
		>
			<select
				className="select select-bordered select-primary select-sm w-full"
				defaultValue={-1}
				onChange={handleStatusChange}
			>
				<option value="-1">All</option>
				<option value="0">Inactive</option>
				<option value="1">Active</option>
			</select>
		</Template>
	);
}

function NumberInput({ columnName, column, isFullFilter }) {
	const { getFilterValue, setFilterValue, getFacetedMinMaxValues } = column;

	const handleMinValueChange = useCallback(
		(value) => setFilterValue((old) => [value, old?.[1]]),
		[column]
	);

	const handleMaxValueChange = useCallback(
		(value) => setFilterValue((old) => [old?.[0], value]),
		[column]
	);

	const [min, max] = getFacetedMinMaxValues() ?? [0, 0];
	const DefaultInputProps = {
		type: "text",
		min: Number(min ?? ""),
		max: Number(max ?? ""),
		width: "md:w-28 placeholder-gray-400",
	};

	if (!isFullFilter) {
		return (
			<div className="flex flex-col gap-1 md:flex-row">
				<DebouncedInput
					// placeholder="Min"
					value={getFilterValue()?.[0] ?? ""}
					onChange={handleMinValueChange}
					{...DefaultInputProps}
				/>

				<DebouncedInput
					// placeholder="Max"
					value={getFilterValue()?.[1] ?? ""}
					onChange={handleMaxValueChange}
					{...DefaultInputProps}
				/>
			</div>
		);
	}

	return (
		<Template
			columnName={columnName}
			onClick={() => setFilterValue(undefined)}
			showResetButton={getFilterValue()?.[0] || getFilterValue()?.[1]}
		>
			<div className="flex flex-col justify-between gap-1 md:flex-row">
				<DebouncedInput
					placeholder={`Min: ${min}`}
					value={getFilterValue()?.[0] ?? ""}
					onChange={handleMinValueChange}
					{...DefaultInputProps}
				/>

				<DebouncedInput
					placeholder={`Max: ${max}`}
					value={getFilterValue()?.[1] ?? ""}
					onChange={handleMaxValueChange}
					{...DefaultInputProps}
				/>
			</div>
		</Template>
	);
}

function StringInput({ columnName, column, firstValue, isFullFilter }) {
	const { id, getFacetedUniqueValues, getFilterValue, setFilterValue } =
		column;

	const sortedUniqueValues = useMemo(
		() => Array.from(getFacetedUniqueValues().keys()).sort(),
		[getFacetedUniqueValues(), firstValue]
	);

	const handleTextValueChange = useCallback(
		(e) => {
			const val = typeof e === "string" ? e : e.target.value;
			setFilterValue(val);
		},
		[column]
	);

	if (!isFullFilter) {
		return (
			<Fragment key={id}>
				<datalist id={id + "list"}>
					{sortedUniqueValues.slice(0, 10).map((value) => (
						<option key={value} value={value} />
					))}
				</datalist>
				<DebouncedInput
					type="text"
					list={id + "list"}
					value={getFilterValue() ?? ""}
					onChange={handleTextValueChange}
				/>
			</Fragment>
		);
	}

	return (
		<Template
			columnName={columnName}
			onClick={() => setFilterValue(undefined)}
			showResetButton={getFilterValue()}
		>
			<DebouncedInput
				type="text"
				list={id + "list"}
				value={getFilterValue() ?? ""}
				onChange={handleTextValueChange}
			/>
			<datalist id={id + "list"}>
				{sortedUniqueValues.slice(0, 10).map((value) => (
					<option key={value} value={value} />
				))}
			</datalist>
		</Template>
	);
}

function FilterColumnValue({
	columnName,
	column,
	getPreFilteredRowModel,
	isFullFilter = false,
}) {
	if (column.id.includes("status"))
		return <StatusInput {...{ columnName, column, isFullFilter }} />;

	const firstValue = getPreFilteredRowModel().flatRows[0]?.getValue(
		column.id
	);

	if (typeof firstValue === "number")
		return <NumberInput {...{ columnName, column, isFullFilter }} />;

	return (
		<StringInput
			key={column.id}
			{...{ columnName, column, firstValue, isFullFilter }}
		/>
	);
}

export default FilterColumnValue;
