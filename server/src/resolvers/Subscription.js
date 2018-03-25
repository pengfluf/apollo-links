const newLink = {
  subscribe: (parent, args, ctx, info) => ctx.db.subscription.link(
    // https://github.com/graphcool/prisma/issues/1734
    // { where: { mutation_in: ['CREATED'] } },
    { },
    info,
  ),
};

const newVote = {
  subscribe: (parent, args, ctx, info) => ctx.db.subscription.vote(
    // https://github.com/graphcool/prisma/issues/1734
    // { where: { mutation_in: ['CREATED'] } },
    { },
    info,
  ),
};

module.exports = {
  newLink,
  newVote,
};
