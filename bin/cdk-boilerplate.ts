#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkBoilerplateStack } from '../lib/cdk-boilerplate-stack';

const app = new cdk.App();
new CdkBoilerplateStack(app, 'CdkBoilerplateStack', {
	env: {
		account: process.env.CDK_DEFAULT_ACCOUNT,
		region: process.env.CDK_DEFAULT_REGION,
	},
});
