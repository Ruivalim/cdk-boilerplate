import { decode } from 'base-64';

function buildAllowAllPolicy(event: any, principalId: any) {
	const tmp = event.methodArn.split(':');
	const apiGatewayArnTmp = tmp[5].split('/');
	const awsAccountId = tmp[4];
	const awsRegion = tmp[3];
	const restApiId = apiGatewayArnTmp[0];
	const stage = apiGatewayArnTmp[1];
	const apiArn = `arn:aws:execute-api:${awsRegion}:${awsAccountId}:${restApiId}/${stage}/*/*`;
	const policy = {
		principalId,
		policyDocument: {
			Version: '2012-10-17',
			Statement: [
				{
					Action: 'execute-api:Invoke',
					Effect: 'Allow',
					Resource: [apiArn],
				},
			],
		},
	};

	return policy;
}

export const handler: AWSLambda.Handler = async (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context, callback: AWSLambda.Callback) => {
	try {
		const authorizationHeader = event.headers.Authorization;
		if (!authorizationHeader) return callback('Unauthorized');

		const decodedHeader = decode(authorizationHeader.replace('Basic ', ''));
		const splitted = decodedHeader.split(':');

		const name = splitted[0];
		let pass = splitted[1];

		if (splitted.length > 2) {
			splitted.shift();
			pass = splitted.join(':');
		}

		const { env } = process;

		const parsedSecret = JSON.parse(env.secret || 'undefined:undefined');

		if (name !== parsedSecret.username || pass !== parsedSecret.password) return callback('Unauthorized');

		const authResponse = buildAllowAllPolicy(event, name);

		return callback(null, authResponse);
	} catch (e) {
		console.error('Error while trying to check authorization: ', e);
		return callback('Unauthorized');
	}
};
