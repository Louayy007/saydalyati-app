const prisma = require('../prisma');

const RETRYABLE_PRISMA_CODES = new Set(['P1001', 'P1002']);

async function runWithDbRetry(action, retries = 6, delayMs = 1000) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await action();
    } catch (error) {
      lastError = error;
      const isRetryable = RETRYABLE_PRISMA_CODES.has(error?.code);
      if (!isRetryable || attempt === retries) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
    }
  }

  throw lastError;
}

function mapListing(item) {
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    type: item.type,
    quantity: item.quantity,
    unit: item.unit,
    priceDa: item.priceDa,
    urgency: item.urgency,
    wilaya: item.wilaya,
    notes: item.notes,
    status: item.status,
    createdAt: item.createdAt,
    owner: {
      userId: item.user.id,
      email: item.user.email,
      fullName: item.user.profile?.fullName || null,
      establishmentName: item.user.profile?.establishmentName || null,
      establishmentType: item.user.profile?.establishmentType || null,
      phone: item.user.profile?.phone || null,
      wilaya: item.user.profile?.wilaya || null,
    },
  };
}

async function listListings(query) {
  const and = [{ status: 'active' }];

  if (query.type && ['offre', 'demande'].includes(query.type)) {
    and.push({ type: query.type });
  }

  if (query.category) {
    and.push({ category: query.category });
  }

  if (query.urgentOnly === 'true') {
    and.push({ urgency: { in: ['urgent', 'critique'] } });
  } else if (query.urgency && ['normal', 'urgent', 'critique'].includes(query.urgency)) {
    and.push({ urgency: query.urgency });
  }

  if (query.wilaya) {
    and.push({
      OR: [
        { wilaya: query.wilaya },
        {
          user: {
            profile: {
              is: {
                wilaya: query.wilaya,
              },
            },
          },
        },
      ],
    });
  }

  if (query.ownerType && ['pharmacie', 'hopital', 'labo'].includes(query.ownerType)) {
    and.push({
      user: {
        profile: {
          is: {
            establishmentType: query.ownerType,
          },
        },
      },
    });
  }

  if (query.search) {
    and.push({
      OR: [
        { title: { contains: query.search, mode: 'insensitive' } },
        { category: { contains: query.search, mode: 'insensitive' } },
        {
          user: {
            profile: {
              is: {
                establishmentName: { contains: query.search, mode: 'insensitive' },
              },
            },
          },
        },
      ],
    });
  }

  const where = { AND: and };

  const orderBy = { createdAt: 'desc' };
  if (query.sort === 'price_asc') orderBy.priceDa = 'asc';
  if (query.sort === 'price_desc') orderBy.priceDa = 'desc';
  if (query.sort === 'qty_desc') orderBy.quantity = 'desc';

  const rows = await runWithDbRetry(() =>
    prisma.listing.findMany({
      where,
      orderBy,
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    })
  );

  return rows.map(mapListing);
}

async function createListing(userId, input) {
  const created = await runWithDbRetry(() =>
    prisma.listing.create({
      data: {
        userId,
        title: input.title,
        category: input.category,
        type: input.type,
        quantity: input.quantity,
        unit: input.unit,
        priceDa: input.priceDa ?? null,
        urgency: input.urgency || 'normal',
        wilaya: input.wilaya ?? null,
        notes: input.notes ?? null,
        status: input.status || 'active',
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    })
  );

  return mapListing(created);
}

module.exports = {
  listListings,
  createListing,
};
