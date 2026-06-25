const repo = require('../modules/sessions/repository');

function sessionOwnership(paramName) {
  return async function (req, reply) {
    const sessionId = req.params[paramName];

    const session = await repo.getSessionById(
      sessionId,
      req.user.id
    );

    if (!session) {
      return reply.status(404).send({
        error: 'Session not found',
      });
    }
  };
}

module.exports = sessionOwnership;
