/**
 * Component Generator
 */

/* eslint strict: ["off"] */

'use strict';

const componentExists = require('../helpers/componentExists');
const COMPONENTS_PATH = '../../app/components';

module.exports = {
	description: 'Add an unconnected component',
	prompts: [
		{
			type: 'input',
			name: 'name',
			message: 'What should it be called?',
			default: 'Button',
			validate: (value) => {
				if (/.+/.test(value)) {
					return componentExists(value)
						? 'A component or container with this name already exists'
						: true;
				}

				return 'The name is required';
			},
			filter: (value) => value.trim(),
		},
		{
			type: 'confirm',
			name: 'memo',
			default: false,
			message: 'Do you want to wrap your component in React.memo?',
		},
		{
			type: 'confirm',
			name: 'wantMessages',
			default: true,
			message: 'Do you want i18n messages (i.e. will this component use text)?',
		},
		{
			type: 'confirm',
			name: 'wantLoadable',
			default: false,
			message: 'Do you want to load the component asynchronously?',
		},
	],
	actions: (data) => {
		// Generate index.js and index.test.js
		const actions = [
			{
				type: 'add',
				path: COMPONENTS_PATH + '/{{properCase name}}/index.js',
				templateFile: './componentGenerator/index.js.hbs',
				abortOnFail: true,
			},
			{
				type: 'add',
				path: COMPONENTS_PATH + '/{{properCase name}}/tests/index.test.js',
				templateFile: './componentGenerator/test.js.hbs',
				abortOnFail: true,
			},
		];

		// If the user wants i18n messages
		if (data.wantMessages) {
			actions.push({
				type: 'add',
				path: COMPONENTS_PATH + '/{{properCase name}}/messages.js',
				templateFile: './componentGenerator/messages.js.hbs',
				abortOnFail: true,
			});
		}

		// If the user wants Loadable.js to load the component asynchronously
		if (data.wantLoadable) {
			actions.push({
				type: 'add',
				path: COMPONENTS_PATH + '/{{properCase name}}/Loadable.js',
				templateFile: './componentGenerator/loadable.js.hbs',
				abortOnFail: true,
			});
		}

		actions.push({
			type: 'prettify',
			path: '/components/',
		});

		return actions;
	},
};
