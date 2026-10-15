// Pure policy functions: fail closed when identity, ownership, or consent is missing.
// Integrate these into routes only after migrating family grants to server-side storage.
export function canAccessFamily({actorId,memberId,grant}) {
 return Boolean(actorId && memberId && grant &&
 grant.supporterId===actorId && grant.memberId===memberId &&
 grant.status==='approved' && grant.revokedAt==null);
}
export function canManageReservation({actorId,reservation}) {
 return Boolean(actorId && reservation && reservation.ownerId===actorId);
}
export function hasActiveMembership(subscription,now=Date.now()) {
 return Boolean(subscription && subscription.status==='Active' &&
 Number.isFinite(Date.parse(subscription.endsAt)) && Date.parse(subscription.endsAt)>now);
}
export function canActivateMembership({payment,verifiedByServer}) {
 return Boolean(verifiedByServer===true && payment &&
 payment.status==='Successful' && payment.providerVerified===true);
}
