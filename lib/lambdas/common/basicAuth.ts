import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

interface BasicAuthLambdaProps {
	secret: Secret;
}

export class BasicAuthLambda extends Construct {
	public readonly function: NodejsFunction;

	constructor(scope: Construct, id: string, props: BasicAuthLambdaProps) {
		super(scope, id);

		const secretValue = props.secret.secretValue.toString();

		this.function = new NodejsFunction(this, 'AuthFunc', {
			entry: './lambda/common/basic-auth/index.ts',
			runtime: Runtime.NODEJS_14_X,
			environment: {
				secret: secretValue,
			},
		});
	}
}
