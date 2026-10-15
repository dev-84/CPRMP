
function checkResourceOwnership({
  ownerField = 'userId',
  allowAdmin = false,
} = {}) {
  if (typeof ownerField !== 'string' || ownerField.trim() === '') {
    throw new Error('A valid ownerField is required');
  }

  return function resourceOwnershipMiddleware(req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication is required',
      });
    }

    // Admin override must be explicitly enabled for a route.
    if (allowAdmin && req.user.role === 'admin') {
      return next();
    }

    // This middleware expects the route/controller to load the resource
    // and assign it to req.resource before ownership is checked.
    const resource = req.resource;

    if (!resource) {
      return res.status(404).json({
        status: 'error',
        message: 'Resource not found',
      });
    }

    const ownerId = resource[ownerField];

    if (ownerId == null) {
      return res.status(403).json({
        status: 'error',
        message: 'Resource ownership could not be verified',
      });
    }

    const ownerIdString =
      typeof ownerId === 'object' && ownerId._id != null
        ? String(ownerId._id)
        : String(ownerId);

    if (ownerIdString !== String(req.user.id)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to access this resource',
      });
    }

    return next();
  };
}

module.exports = { checkResourceOwnership };
