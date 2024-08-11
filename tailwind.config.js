import daisyui from 'daisyui';

const LIGHT_THEME = require('daisyui/src/theming/themes')['light'];

const WHITE = '#FFFFFF';
const BLACK = '#000000';
// const PRIMARY = '#4F496F';
// const SECONDARY = '#ADB7D6';
const PRIMARY = '#3C50E0';
const SECONDARY = '#80CAEE';

export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				poppins: ['Poppins', 'sans-serif'],
			},
			keyframes: {
				slideIn: {
					'0%': { opacity: 0, transform: 'translateX(100%)' },
					'100%': { opacity: 1, transform: 'translateX(0)' },
				},
			},
			animation: {
				slideIn: 'slideIn .25s ease-in-out forwards var(--delay, 0)',
			},
		},
	},
	// eslint-disable-next-line no-undef
	plugins: [daisyui],
	daisyui: {
		themes: [
			{
				light: {
					...LIGHT_THEME,

					primary: PRIMARY,
					'primary-content': WHITE,

					secondary: SECONDARY,
					'secondary-content': PRIMARY,

					accent: '#9e0059',
					'accent-content': WHITE,

					neutral: '#2a2e37',
					'neutral-content': WHITE,

					'base-100': WHITE,
					'base-200': '#f9fafb',
					'base-300': '#d1d5db',
					'base-content': '#1f2937',

					background: '#1C2434',
					'background-text-1': '#DEE4EE',
					'background-text-2': '#8A99AF',

					foreground: '#64748B',

					'tab-active': '#333A48',

					info: '#428fce',
					'info-content': WHITE,

					// success: '#3adb76',
					success: '#10B981',
					'success-content': WHITE,

					warning: '#ffae00',
					'warning-content': WHITE,

					// error: '#a4243b',
					error: '#FB5454',
					'error-content': WHITE,

					'--rounded-btn': '0.3rem',
					'--animation-btn': '.15s',
					'--btn-text-case': 'uppercase',
					'--btn-focus-scale': '1.1',
					'--border-btn': '0.1rem',
				},
			},
		],
		darkTheme: 'light',
		rtl: false,
		prefix: '',
		logs: false,
		themeRoot: ':root',
	},
};
