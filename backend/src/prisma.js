const { PrismaClient } = require('@prisma/client');

function buildDatasourceUrl(rawUrl) {
	if (!rawUrl) return undefined;

	try {
		const parsed = new URL(rawUrl);

		if (!parsed.searchParams.get('connect_timeout')) {
			parsed.searchParams.set('connect_timeout', '20');
		}

		if (!parsed.searchParams.get('pool_timeout')) {
			parsed.searchParams.set('pool_timeout', '20');
		}

		if (parsed.hostname.includes('-pooler.') && !parsed.searchParams.get('pgbouncer')) {
			parsed.searchParams.set('pgbouncer', 'true');
		}

		return parsed.toString();
	} catch {
		return rawUrl;
	}
}

const datasourceUrl = buildDatasourceUrl(process.env.DATABASE_URL);

const prisma = datasourceUrl
	? new PrismaClient({
			datasources: {
				db: {
					url: datasourceUrl,
				},
			},
		})
	: new PrismaClient();

module.exports = prisma;
