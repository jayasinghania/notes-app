import asyncHandler from 'express-async-handler';
import Tenant from '../models/Tenant.js';

// @desc    Upgrade a tenant to pro
// @route   POST /api/tenants/:slug/upgrade
// @access  Private/Admin
const upgradeTenant = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findOne({ slug: req.params.slug });

  if (tenant) {
    tenant.plan = 'pro';
    const updatedTenant = await tenant.save();
    res.json(updatedTenant);
  } else {
    res.status(404);
    throw new Error('Tenant not found');
  }
});

export { upgradeTenant };