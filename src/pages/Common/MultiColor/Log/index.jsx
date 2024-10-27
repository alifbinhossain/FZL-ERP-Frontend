import React, { useEffect } from 'react';

import TapeReceived from './TapeReceived';
import Shafayat from './TapeToDyeing';
import PageInfo from '@/util/PageInfo';

export default function index() {

	useEffect(() => {
		document.title = 'Log';
	}, []);

	return (
		<div className='flex flex-col gap-6'>
			<Shafayat />
			<TapeReceived />
		</div>
	);
}