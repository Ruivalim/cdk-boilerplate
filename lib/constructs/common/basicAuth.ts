import { BasicAuthLambda } from '@lambdas/common/basicAuth';
import { IdentitySource, RequestAuthorizer } from 'aws-cdk-lib/aws-apigateway';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

interface BasicAuthProps {
	username: string;
}

export class BasicAuth extends Construct {
	public readonly requestAuthorizer: RequestAuthorizer;

	constructor(scope: Construct, id: string, props: BasicAuthProps) {
		super(scope, id);

		const secret = new Secret(this, 'BasicAuthorizationSecret', {
			generateSecretString: {
				secretStringTemplate: JSON.stringify({ username: props.username }),
				generateStringKey: 'password',
			},
		});

		const basicAuthLambda = new BasicAuthLambda(this, 'BasicAuthLambda', {
			secret,
		});

		const source = IdentitySource.header('Authorization');

		this.requestAuthorizer = new RequestAuthorizer(this, 'BasicAuthorizer', {
			handler: basicAuthLambda.function,
			identitySources: [source],
		});
	}
}
