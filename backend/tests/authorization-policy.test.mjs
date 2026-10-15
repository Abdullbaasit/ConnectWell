import test from 'node:test';
import assert from 'node:assert/strict';
import {canAccessFamily,canManageReservation,hasActiveMembership,canActivateMembership} from '../src/authorization-policy.mjs';
test('family access requires approved matching grant',()=>{
 const grant={supporterId:'family-1',memberId:'member-1',status:'approved',revokedAt:null};
 assert.equal(canAccessFamily({actorId:'family-1',memberId:'member-1',grant}),true);
 assert.equal(canAccessFamily({actorId:'attacker',memberId:'member-1',grant}),false);
 assert.equal(canAccessFamily({actorId:'family-1',memberId:'other',grant}),false);
 assert.equal(canAccessFamily({actorId:'family-1',memberId:'member-1',grant:{...grant,revokedAt:'2026-10-01'}}),false);
 assert.equal(canAccessFamily({actorId:'family-1',memberId:'member-1',grant:{...grant,status:'pending'}}),false);
});
test('reservation ownership is server-side',()=>{
 assert.equal(canManageReservation({actorId:'a',reservation:{ownerId:'a'}}),true);
 assert.equal(canManageReservation({actorId:'b',reservation:{ownerId:'a'}}),false);
 assert.equal(canManageReservation({actorId:'a',reservation:null}),false);
});
test('membership must be active and unexpired',()=>{
 const now=Date.parse('2026-10-15T00:00:00Z');
 assert.equal(hasActiveMembership({status:'Active',endsAt:'2026-10-16T00:00:00Z'},now),true);
 assert.equal(hasActiveMembership({status:'Active',endsAt:'2026-10-14T00:00:00Z'},now),false);
 assert.equal(hasActiveMembership({status:'Cancelled',endsAt:'2026-10-16T00:00:00Z'},now),false);
 assert.equal(hasActiveMembership(null,now),false);
});
test('client success alone never activates membership',()=>{
 const payment={status:'Successful',providerVerified:false};
 assert.equal(canActivateMembership({payment,verifiedByServer:false}),false);
 assert.equal(canActivateMembership({payment,verifiedByServer:true}),false);
 assert.equal(canActivateMembership({payment:{...payment,providerVerified:true},verifiedByServer:true}),true);
});
