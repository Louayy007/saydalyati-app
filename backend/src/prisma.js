/**
 * Prisma ORM Client Configuration
 * Initializes database connection with connection pooling and retry logic
 */

const { PrismaClient } = require('@prisma/client');

/**
 * Build optimized database URL with connection pooling parameters
 * Adds connection timeout and pool timeout for better connection management
 * @param {string} rawUrl - Raw database URL from environment
 * @returns {string} Configured database URL with pooling parameters
 */
function buildDatasourceUrl(rawUrl) {
	// Return undefined if no URL provided
	if (!rawUrl) return undefined;

	try {
		const parsed = new URL(rawUrl);

		// Set connection timeout to 20 seconds if not specified
		if (!parsed.searchParams.get('connect_timeout')) {
			parsed.searchParams.set('connect_timeout', '20');
		}

		// Set pool timeout to 20 seconds if not specified
		if (!parsed.searchParams.get('pool_timeout')) {
			parsed.searchParams.set('pool_timeout', '20');
		}

		// Enable PgBouncer for connection pooling if using Vercel Postgres or similar
		if (parsed.hostname.includes('-pooler.') && !parsed.searchParams.get('pgbouncer')) {
			parsed.searchParams.set('pgbouncer', 'true');
		}

		return parsed.toString();
	} catch {
		// If URL parsing fails, return original URL as fallback
		return rawUrl;
	}
}

// Build optimized database URL
const datasourceUrl = buildDatasourceUrl(process.env.DATABASE_URL);

// Initialize Prisma client with configured URL or fallback to default
const prisma = datasourceUrl
	? new PrismaClient({
			datasources: {
				db: {
					url: datasourceUrl,
				},
			},
		})
	: new PrismaClient();

// Export singleton Prisma instance
module.exports = prisma;
