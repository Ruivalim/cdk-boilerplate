import { BasicAuth } from '@constructs/common/basicAuth';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class CdkBoilerplateStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		const basicAuthorizer = new BasicAuth(this, 'BasicAuthorizer', {
			username: 'admin',
		});
	}
}
